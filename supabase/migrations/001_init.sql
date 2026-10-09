-- =============================================================================
-- 001_init.sql — initial schema
--
-- Run in the Supabase dashboard (SQL editor) or via `supabase db push`.
-- Idempotent: every statement is guarded, safe to run twice.
--
-- Security model:
--   * anon (the public site)  — read published content, categories, facts,
--                               settings; INSERT-only into subscribers.
--   * authenticated admin     — full write, matched by email against the
--                               app.admin_email database setting.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists pgcrypto; -- gen_random_uuid()
create extension if not exists citext;   -- case-insensitive subscriber emails

-- ---------------------------------------------------------------------------
-- Admin email setting (used by RLS so "who is the admin" lives in the DB)
-- ---------------------------------------------------------------------------
-- The canonical value lives in the app_settings table below, which the seed
-- script upserts. Optionally pin it at the database level too (SQL editor):
--   alter database current_database() is not valid syntax; use:
--   alter database postgres set app.admin_email = 'you@example.com';
create table if not exists public.app_settings (
  key   text primary key,
  value text not null
);
alter table public.app_settings enable row level security;
-- No policies on purpose: only the service role reads/writes this table.

create or replace function public.admin_email()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select value from public.app_settings where key = 'admin_email'),
    current_setting('app.admin_email', true)
  );
$$;

-- The admin check itself: the caller is authenticated AND their email matches.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    auth.role() = 'authenticated'
    and auth.email() is not null
    and lower(auth.email()) = lower(public.admin_email());
$$;

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- content (one table for posts and projects)
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.content_type as enum ('post', 'project');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.publish_status as enum ('draft', 'published', 'scheduled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.project_status as enum ('live', 'in-progress', 'archived');
exception when duplicate_object then null; end $$;

create table if not exists public.content (
  id             uuid primary key default gen_random_uuid(),
  type           public.content_type      not null default 'post',
  title          text                     not null,
  slug           text                     not null unique,
  excerpt        text                     not null default '',
  body           text                     not null default '',
  cover_image_url text,

  category_id    uuid references public.categories (id) on delete set null,
  tags           text[] not null default '{}',

  tech_stack     text[] not null default '{}',
  live_url       text,
  repo_url       text,
  project_status public.project_status,

  featured       boolean not null default false,
  publish_status public.publish_status not null default 'draft',
  published_at   timestamptz,
  read_time      integer,
  blur_data_url  text,

  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists content_slug_idx on public.content (slug);
create index if not exists content_public_list_idx
  on public.content (type, publish_status, published_at desc);
create index if not exists content_category_idx on public.content (category_id);

-- Keep updated_at fresh on every write.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists content_set_updated_at on public.content;
create trigger content_set_updated_at
  before update on public.content
  for each row execute function public.set_updated_at();

-- Reading time: ~200 wpm, minimum 1, recalculated on insert and update.
create or replace function public.calc_read_time()
returns trigger language plpgsql as $$
declare
  plain text;
  words integer;
begin
  plain := new.body;
  plain := coalesce(regexp_replace(plain, '```[\s\S]*?```', ' ', 'g'), plain);
  plain := coalesce(regexp_replace(plain, '<[^>]+>', ' ', 'g'), plain);
  plain := coalesce(regexp_replace(plain, '!\[[^\]]*\]\([^)]*\)', ' ', 'g'), plain);
  words := array_length(regexp_split_to_array(trim(plain), '\s+'), 1);
  if words is null or words = 0 then
    new.read_time := 1;
  else
    new.read_time := greatest(1, ceil(words / 200.0)::integer);
  end if;
  return new;
end $$;

drop trigger if exists content_calc_read_time on public.content;
create trigger content_calc_read_time
  before insert or update of body on public.content
  for each row execute function public.calc_read_time();

-- ---------------------------------------------------------------------------
-- subscribers (public may insert only)
-- ---------------------------------------------------------------------------
create table if not exists public.subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      citext not null unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- facts (About page "A few facts" cards)
-- ---------------------------------------------------------------------------
create table if not exists public.facts (
  id         uuid primary key default gen_random_uuid(),
  icon       text not null default 'sparkles',
  label      text not null,
  value      text not null,
  sort_order integer not null default 0
);

-- ---------------------------------------------------------------------------
-- site_settings (single row)
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id          integer primary key default 1 check (id = 1),
  name        text not null default 'Emmanuel',
  role        text not null default 'Web developer and designer',
  location    text,
  email       text not null default '',
  bio         text not null default '',
  avatar_url  text,
  twitter_url text,
  github_url  text,
  updated_at  timestamptz not null default now()
);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.content        enable row level security;
alter table public.categories     enable row level security;
alter table public.subscribers    enable row level security;
alter table public.facts          enable row level security;
alter table public.site_settings  enable row level security;

-- content: public sees published-now rows; admin sees everything.
drop policy if exists "content_public_read" on public.content;
create policy "content_public_read" on public.content
  for select to anon, authenticated
  using (
    (publish_status = 'published' and published_at is not null and published_at <= now())
    or public.is_admin()
  );

drop policy if exists "content_admin_insert" on public.content;
create policy "content_admin_insert" on public.content
  for insert to authenticated with check (public.is_admin());

drop policy if exists "content_admin_update" on public.content;
create policy "content_admin_update" on public.content
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "content_admin_delete" on public.content;
create policy "content_admin_delete" on public.content
  for delete to authenticated using (public.is_admin());

-- categories: readable by everyone; writable by admin.
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
  for select to anon, authenticated using (true);

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- facts: readable by everyone; writable by admin.
drop policy if exists "facts_public_read" on public.facts;
create policy "facts_public_read" on public.facts
  for select to anon, authenticated using (true);

drop policy if exists "facts_admin_write" on public.facts;
create policy "facts_admin_write" on public.facts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- site_settings: readable by everyone; writable by admin.
drop policy if exists "settings_public_read" on public.site_settings;
create policy "settings_public_read" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "settings_admin_write" on public.site_settings;
create policy "settings_admin_write" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- subscribers: anyone may subscribe, nobody may read via the public API.
drop policy if exists "subscribers_public_insert" on public.subscribers;
create policy "subscribers_public_insert" on public.subscribers
  for insert to anon, authenticated with check (true);
-- No select policy: only the service role (seed, admin backend, CSV export)
-- can read the list.

-- ---------------------------------------------------------------------------
-- Storage: `covers` bucket, public read, admin write
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do update set public = true;

drop policy if exists "covers_public_read" on storage.objects;
create policy "covers_public_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'covers');

drop policy if exists "covers_admin_insert" on storage.objects;
create policy "covers_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'covers' and public.is_admin());

drop policy if exists "covers_admin_update" on storage.objects;
create policy "covers_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'covers' and public.is_admin());

drop policy if exists "covers_admin_delete" on storage.objects;
create policy "covers_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'covers' and public.is_admin());
