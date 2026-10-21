import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

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

  async signUp(fullName: string, email: string, password: string): Promise<AuthResult> {
    if (!supabase) return notAvailable;
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { full_name: fullName.trim() } } });
    if (error) return { ok: false, error: friendly(error.message) };
    if (!data.session) return { ok: true, needsConfirmation: true, message: "Almost there! Check your email to confirm your account, then sign in." };
    return { ok: true };
  },

  async resetPassword(email: string): Promise<AuthResult> {
    if (!supabase) return notAvailable;
    if (!email.trim()) return { ok: false, error: "Enter your email above, then tap “Forgot password?” again." };
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
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
