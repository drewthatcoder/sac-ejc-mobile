import { Linking } from "react-native";

/**
 * Captures incoming deep links (including the #fragment, which Expo Router drops) as early as possible,
 * so app/auth/callback can read Supabase tokens even if the event fired before that screen mounted.
 */
type Listener = (url: string) => void;
let latest: string | null = null;
const listeners = new Set<Listener>();
const emit = (url: string | null | undefined) => { if (!url) return; latest = url; listeners.forEach((l) => l(url)); };

Linking.getInitialURL().then(emit).catch(() => {});
Linking.addEventListener("url", ({ url }) => emit(url));

export function latestAuthUrl(): string | null {
  return latest && latest.includes("auth/callback") ? latest : null;
}
export function onDeepLink(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}
