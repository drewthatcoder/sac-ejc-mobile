import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/** AsyncStorage key. The app already persists the Supabase session here, not in SecureStore. */
export const HAS_SEEN_WELCOME_KEY = "hasSeenWelcome";

let seen = false;
let loaded = false;
let loadStarted = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function load() {
  if (loadStarted) return;
  loadStarted = true;
  AsyncStorage.getItem(HAS_SEEN_WELCOME_KEY)
    .then((value) => {
      // A tap can set `seen` before storage returns; don't overwrite that.
      if (!seen) seen = value === "true";
    })
    .catch(() => {})
    .finally(() => {
      loaded = true;
      emit();
    });
}

/** Remember that the welcome screen was dismissed. Updates listeners immediately so navigation doesn't bounce back. */
export function markWelcomeSeen(): Promise<void> {
  seen = true;
  loaded = true;
  emit();
  return AsyncStorage.setItem(HAS_SEEN_WELCOME_KEY, "true").then(() => undefined, () => undefined);
}

export function peekWelcomeSeen(): boolean {
  return seen;
}

export function useWelcomeSeen(): { loaded: boolean; seen: boolean } {
  const [state, setState] = useState({ loaded, seen });
  useEffect(() => {
    const sync = () => setState({ loaded, seen });
    listeners.add(sync);
    sync();
    load();
    return () => { listeners.delete(sync); };
  }, []);
  return state;
}
