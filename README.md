# SAC EJC Mobile

Native Expo (React Native + TypeScript + Expo Router) app for the Sacramento Environmental Justice Coalition. iOS bundle id / Android package: `org.sacejc.app`.

Screens: Home, Join Our Cause, Live Data (Clarity map in browser), Donate (PayPal hosted button in browser), Contact, FAQ (placeholder — TODO: Drew to fill in).

## Setup
```
npm install
cp .env.example .env   # fill in EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_KEY (publishable/anon key)
npx expo run:ios       # or run:android
```
If the env vars are unset, Contact and Join show an "online submissions aren't available yet" notice up front and after validation, keep the typed data, and never report success. Set `ORG_CONTACT_EMAIL` in `src/content.ts` to enable a prefilled mailto: fallback (no real contact email exists in the source site yet).

## Backend
Apply `supabase/migrations/*.sql` to a new Supabase project (tables `contact_submissions`, `join_submissions`; RLS on; anon INSERT only).

Accounts: `app/login.tsx` and `app/signup.tsx` are design-only. They call the stub in `src/lib/auth.ts`, which returns "Accounts coming soon" until Supabase Auth is wired in. Every tab works without signing in.

Not published to any store.
