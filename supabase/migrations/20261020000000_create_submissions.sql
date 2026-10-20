-- SAC EJC form submissions. Anonymous clients may INSERT only.
create extension if not exists pgcrypto;

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text not null,
  subject text not null,
  message text not null
);

create table if not exists public.join_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  zip text not null,
  interests text[] not null check (cardinality(interests) >= 1),
  message text
);

alter table public.contact_submissions enable row level security;
alter table public.join_submissions enable row level security;

revoke all on public.contact_submissions from anon;
revoke all on public.join_submissions from anon;
grant insert on public.contact_submissions to anon;
grant insert on public.join_submissions to anon;

create policy "anon can insert contact" on public.contact_submissions for insert to anon with check (true);
create policy "anon can insert join" on public.join_submissions for insert to anon with check (true);
-- No select/update/delete policies for anon: those operations are denied.
