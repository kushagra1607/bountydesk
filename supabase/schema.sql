-- BountyDesk database schema
-- Run this in the Supabase Dashboard -> SQL Editor -> New query -> Run.
-- Safe to re-run (idempotent where practical).

-- ---------------------------------------------------------------------------
-- profiles : 1 row per auth user, holds the subscription plan
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id                     uuid primary key references auth.users(id) on delete cascade,
  email                  text,
  plan                   text not null default 'free' check (plan in ('free', 'pro')),
  paddle_customer_id     text,
  paddle_subscription_id text,
  created_at             timestamptz not null default now()
);

-- For existing installs created before billing columns were added:
alter table public.profiles
  add column if not exists paddle_customer_id text;
alter table public.profiles
  add column if not exists paddle_subscription_id text;

alter table public.profiles enable row level security;

drop policy if exists "own profile - select" on public.profiles;
create policy "own profile - select" on public.profiles
  for select using (auth.uid() = id);

-- SECURITY: users must NOT be able to update their own plan or billing fields.
-- The Paddle webhook (service_role) is the only writer to this table.
drop policy if exists "own profile - update" on public.profiles;
revoke update on public.profiles from anon, authenticated;

drop policy if exists "own profile - insert" on public.profiles;
create policy "own profile - insert" on public.profiles
  for insert with check (auth.uid() = id);
revoke insert on public.profiles from anon;

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- handle_new_user is trigger-only; don't expose it as a callable PostgREST RPC.
revoke execute on function public.handle_new_user() from anon, authenticated, public;

-- ---------------------------------------------------------------------------
-- programs : bug bounty programs the user hunts
-- ---------------------------------------------------------------------------
create table if not exists public.programs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  platform   text not null default 'Other',
  url        text,
  scope      text,
  min_bounty numeric,
  max_bounty numeric,
  notes      text,
  created_at timestamptz not null default now()
);

create index if not exists programs_user_id_idx on public.programs(user_id);

alter table public.programs enable row level security;

drop policy if exists "programs - own rows" on public.programs;
create policy "programs - own rows" on public.programs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- submissions : the core tracker
-- ---------------------------------------------------------------------------
create table if not exists public.submissions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  program_id    uuid references public.programs(id) on delete set null,
  title         text not null,
  vuln_type     text not null default 'Other',
  severity      text not null default 'Medium',
  status        text not null default 'Draft',
  bounty_amount numeric not null default 0,
  currency      text not null default 'USD',
  target        text,
  description   text,
  submitted_at  date,
  resolved_at   date,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists submissions_user_id_idx on public.submissions(user_id);
create index if not exists submissions_status_idx on public.submissions(status);
create index if not exists submissions_program_id_idx on public.submissions(program_id);

alter table public.submissions enable row level security;

drop policy if exists "submissions - own rows" on public.submissions;
create policy "submissions - own rows" on public.submissions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists submissions_touch on public.submissions;
create trigger submissions_touch
  before update on public.submissions
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Backfill profiles for any users that already exist (safe to run anytime).
-- ---------------------------------------------------------------------------
insert into public.profiles (id, email)
select id, email from auth.users
on conflict (id) do nothing;
