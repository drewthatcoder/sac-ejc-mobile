import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import { deriveFirstName } from "./name";
import { supabase } from "./supabase";

/** Deep link Supabase sends users back to (sacejc://auth/callback in builds). */
export const authCallbackUrl = () => Linking.createURL("auth/callback");

export type AuthResult =
  | { ok: true; needsConfirmation?: boolean; message?: string }
  | { ok: false; notAvailable?: boolean; error: string };

export const ACCOUNTS_COMING_SOON = "Accounts are coming soon! For now, you can use every part of the app as a guest.";
const notAvailable: AuthResult = { ok: false, notAvailable: true, error: ACCOUNTS_COMING_SOON };

function friendly(msg: string): string {
  if (/invalid login credentials/i.test(msg)) return "That email and password don't match an account.";
  if (/email not confirmed/i.test(msg)) return "Please confirm your email first — check your inbox for the link.";
  if (/rate limit/i.test(msg)) return "Too many attempts. Please wait a bit and try again.";
  return msg || "Something went wrong. Please try again.";
}

export const authService = {
  isAvailable: supabase !== null,

  async signIn(email: string, password: string): Promise<AuthResult> {
    if (!supabase) return notAvailable;
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return error ? { ok: false, error: friendly(error.message) } : { ok: true };
  },

  async signUp(firstName: string, lastName: string, email: string, password: string): Promise<AuthResult> {
    if (!supabase) return notAvailable;
    const first = firstName.trim();
    const last = lastName.trim();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { first_name: first, last_name: last, full_name: `${first} ${last}`.trim() },
        emailRedirectTo: authCallbackUrl(),
      },
    });
    if (error) return { ok: false, error: friendly(error.message) };
    if (!data.session) return { ok: true, needsConfirmation: true, message: "Almost there! Check your email to confirm your account, then sign in." };
    return { ok: true };
  },

  async resetPassword(email: string): Promise<AuthResult> {
    if (!supabase) return notAvailable;
    if (!email.trim()) return { ok: false, error: "Enter your email above, then tap “Forgot password?” again." };
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: authCallbackUrl() });
    return error ? { ok: false, error: friendly(error.message) } : { ok: true, message: "If an account exists for that email, we've sent a reset link." };
  },

  async signOut(): Promise<void> {
    await supabase?.auth.signOut();
  },

  /** Calls the delete-account Edge Function (must be deployed by Lead), then signs out locally. */
  async deleteAccount(): Promise<AuthResult> {
    if (!supabase) return notAvailable;
    const { error } = await supabase.functions.invoke("delete-account", { method: "POST" });
    if (error) return { ok: false, error: "We couldn't delete your account right now. Please try again later." };
    await supabase.auth.signOut();
    return { ok: true };
  },
};

export function displayName(session: Session | null): string | null {
  if (!session) return null;
  const n = session.user.user_metadata?.full_name;
  return typeof n === "string" && n.trim() ? n.trim() : session.user.email ?? "Account";
}

/** Header chip and other first-name UI. Existing users may only have full_name. */
export function firstName(session: Session | null): string | null {
  if (!session) return null;
  return deriveFirstName(session.user.user_metadata, session.user.email) ?? "Account";
}

export function useSession(): { session: Session | null; loading: boolean } {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(!!supabase);
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  return { session, loading };
}

export type CallbackResult =
  | { ok: true; type: string }
  | { ok: false; error: string };

function expiredOrInvalid(code?: string | null, desc?: string | null): string {
  const d = (desc ?? "").replace(/\+/g, " ");
  if (/expired/i.test(d) || code === "otp_expired") return "This link has expired. Please request a new one.";
  if (d) return `This link didn't work: ${d}`;
  return "This link is invalid or has already been used. Please request a new one.";
}

/** Parses a Supabase auth redirect (implicit #access_token… or PKCE ?code=…) and starts a session. */
export async function handleAuthCallbackUrl(url: string): Promise<CallbackResult> {
  if (!supabase) return { ok: false, error: ACCOUNTS_COMING_SOON };
  const [beforeHash, hash = ""] = url.split("#");
  const query = beforeHash.includes("?") ? beforeHash.slice(beforeHash.indexOf("?") + 1) : "";
  const params = new URLSearchParams(query);
  new URLSearchParams(hash).forEach((v, k) => params.set(k, v));

  const err = params.get("error") || params.get("error_code");
  if (err) return { ok: false, error: expiredOrInvalid(params.get("error_code"), params.get("error_description")) };

  const type = params.get("type") ?? "signup";
  const code = params.get("code");
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");
  try {
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) return { ok: false, error: expiredOrInvalid(error.code, error.message) };
    } else if (access_token && refresh_token) {
      const { error } = await supabase.auth.setSession({ access_token, refresh_token });
      if (error) return { ok: false, error: expiredOrInvalid(error.code, error.message) };
    } else {
      return { ok: false, error: expiredOrInvalid() };
    }
  } catch (e) {
    return { ok: false, error: expiredOrInvalid(null, e instanceof Error ? e.message : String(e)) };
  }
  return { ok: true, type };
}

export async function updatePassword(password: string): Promise<AuthResult> {
  if (!supabase) return notAvailable;
  const { error } = await supabase.auth.updateUser({ password });
  return error ? { ok: false, error: friendly(error.message) } : { ok: true };
}
