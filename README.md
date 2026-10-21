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
Supabase project `fdkmurqcsshjjnkhnaod` (schema managed by Mobile Lead). Forms insert into `contact_submissions` / `join_submissions` (insert-only, no read via API). Auth uses Supabase Auth with AsyncStorage sessions; `profiles` rows are created by the `on_auth_user_created` trigger.

`supabase/functions/delete-account` backs the in-app "Delete account" button. It is **not deployed**; deploy with
`supabase functions deploy delete-account --project-ref fdkmurqcsshjjnkhnaod`.

Not published to any store.
