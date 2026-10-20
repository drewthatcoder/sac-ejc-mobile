import "react-native-url-polyfill/auto";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_KEY;

export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;

export type SubmitResult = { ok: true } | { ok: false; notConnected?: boolean; error: string };

export async function insertRow(table: "contact_submissions" | "join_submissions", row: Record<string, unknown>): Promise<SubmitResult> {
  if (!supabase) return { ok: false, notConnected: true, error: "Submissions are not yet connected. Your form looks good — please check back soon!" };
  const { error } = await supabase.from(table).insert(row);
  return error ? { ok: false, error: error.message } : { ok: true };
}
