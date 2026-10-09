-- =============================================================================
-- 005_messages_marquee.sql — Contact inbox + landing marquee manager
--
-- * `messages`      — contact-form submissions. The public may INSERT only
--                     (like subscribers: no SELECT policy, so submissions can
--                     never be scraped); the admin reads and manages them.
-- * `landing_images` — artwork for the "Selected Work" cover carousel, fully
--                     admin-managed; replaces the auto-repeated project covers
--                     when at least three images exist.
--
-- Guarded; safe to run twice.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- messages (contact form inbox)
-- ---------------------------------------------------------------------------
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name  text not null,
  email      citext not null,
  phone      text,
  message    text not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists messages_created_idx
  on public.messages (created_at desc);
create index if not exists messages_unread_idx
  on public.messages (created_at desc) where not is_read;

alter table public.messages enable row level security;

-- Anyone may submit; nobody anonymous may read. Same shape as subscribers.
drop policy if exists "messages_public_insert" on public.messages;
create policy "messages_public_insert" on public.messages
  for insert to anon, authenticated with check (true);

drop policy if exists "messages_admin_select" on public.messages;
create policy "messages_admin_select" on public.messages
  for select to authenticated using (public.is_admin());

drop policy if exists "messages_admin_update" on public.messages;
create policy "messages_admin_update" on public.messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "messages_admin_delete" on public.messages;
create policy "messages_admin_delete" on public.messages
  for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- landing_images (Selected Work cover carousel)
-- ---------------------------------------------------------------------------
create table if not exists public.landing_images (
  id         uuid primary key default gen_random_uuid(),
  image_url  text not null,
  alt        text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists landing_images_sort_idx
  on public.landing_images (sort_order);

alter table public.landing_images enable row level security;

drop policy if exists "landing_images_public_read" on public.landing_images;
create policy "landing_images_public_read" on public.landing_images
  for select to anon, authenticated using (true);

drop policy if exists "landing_images_admin_write" on public.landing_images;
create policy "landing_images_admin_write" on public.landing_images
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
