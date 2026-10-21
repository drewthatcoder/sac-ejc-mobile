import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { AppState, Platform } from "react-native";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_KEY;

export const supabase: SupabaseClient | null =
  url && key
    ? createClient(url, key, {
        auth: {
          storage: Platform.OS === "web" && typeof window === "undefined" ? undefined : AsyncStorage,
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      })
    : null;

// Only refresh tokens while the app is in the foreground (Supabase RN guidance).
if (supabase && Platform.OS !== "web") {
  AppState.addEventListener("change", (s) => (s === "active" ? supabase.auth.startAutoRefresh() : supabase.auth.stopAutoRefresh()));
}

export const isBackendConfigured = supabase !== null;

export type SubmitResult = { ok: true } | { ok: false; notConnected?: boolean; error: string };

/** Insert-only: the submissions tables are not readable via the API, so never chain .select(). */
export async function insertRow(table: "contact_submissions" | "join_submissions", row: Record<string, unknown>): Promise<SubmitResult> {
  if (!supabase) return { ok: false, notConnected: true, error: "Online submissions aren't available yet." };
  try {
    const { error } = await supabase.from(table).insert(row); // v2 default = return=minimal (no .select())
    return error ? { ok: false, error: error.message } : { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
