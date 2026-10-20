# SAC EJC Mobile

Native Expo (React Native + TypeScript + Expo Router) app for the Sacramento Environmental Justice Coalition. iOS bundle id / Android package: `org.sacejc.app`.

Screens: Home, Join Our Cause, Live Data (Clarity map in browser), Donate (PayPal hosted button in browser), Contact, FAQ (placeholder — TODO: Drew to fill in).

## Setup
```
npm install
cp .env.example .env   # fill in EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_KEY (publishable/anon key)
npx expo run:ios       # or run:android
```
If the env vars are unset, forms validate and then show "Submissions are not yet connected".

## Backend
Apply `supabase/migrations/*.sql` to a new Supabase project (tables `contact_submissions`, `join_submissions`; RLS on; anon INSERT only).

Not published to any store.
