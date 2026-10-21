// Supabase Edge Function: delete-account (Deno). NOT DEPLOYED — Lead deploys with:
//   supabase functions deploy delete-account --project-ref fdkmurqcsshjjnkhnaod
// Verifies the caller's JWT, then (service role, server-side only) deletes the user's
// contact_submissions + join_submissions rows (case-insensitive email match), their profiles row,
// and finally the auth user. Any delete error returns 500 and the auth user is kept.
import { createClient } from "jsr:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return json({ error: "Server not configured" }, 500);

  const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!jwt) return json({ error: "Missing authorization" }, 401);

  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await admin.auth.getUser(jwt);
  if (error || !data.user) return json({ error: "Invalid or expired session" }, 401);

  const user = data.user;

  // Fail closed: if any data delete errors, stop before deleting the auth user.
  // Only match submissions by email once the user has proven they own that address.
  if (user.email && user.email_confirmed_at) {
    // Case-insensitive exact match: ILIKE with LIKE wildcards (and the escape char) escaped.
    const pattern = user.email.replace(/[\\%_]/g, (c) => "\\" + c);
    for (const table of ["contact_submissions", "join_submissions"]) {
      const { error: e } = await admin.from(table).delete().ilike("email", pattern);
      if (e) return json({ error: `Could not delete ${table}` }, 500);
    }
  }

  const { error: profErr } = await admin.from("profiles").delete().eq("id", user.id);
  if (profErr) return json({ error: "Could not delete profile" }, 500);

  const { error: delErr } = await admin.auth.admin.deleteUser(user.id);
  if (delErr) return json({ error: "Could not delete account" }, 500);
  return json({ ok: true });
});
