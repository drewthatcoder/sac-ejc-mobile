/**
 * Auth service stub. Accounts are design-only for now.
 * TODO: wire to Supabase Auth (supabase.auth.signInWithPassword / signUp / resetPasswordForEmail)
 * once a project exists. Every call currently returns { ok: false, notAvailable: true } — never a fake session.
 */
export type AuthResult = { ok: true } | { ok: false; notAvailable?: boolean; error: string };

export const ACCOUNTS_COMING_SOON = "Accounts are coming soon! For now, you can use every part of the app as a guest.";

const notAvailable = async (): Promise<AuthResult> => ({ ok: false, notAvailable: true, error: ACCOUNTS_COMING_SOON });

export const authService = {
  isAvailable: false,
  signIn: (_email: string, _password: string) => notAvailable(),
  signUp: (_name: string, _email: string, _password: string) => notAvailable(),
  resetPassword: (_email: string) => notAvailable(),
};
