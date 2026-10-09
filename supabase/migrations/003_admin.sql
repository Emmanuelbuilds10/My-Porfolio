-- =============================================================================
-- 003_admin.sql — admin phase additions
--
-- Everything is guarded; safe to run twice and harmless after 001/002.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Cover alt text (accessibility; authored in the admin editor).
-- ---------------------------------------------------------------------------
do $$ begin
  alter table public.content add column alt_text text;
exception when duplicate_column then null; end $$;

-- ---------------------------------------------------------------------------
-- Scheduled publishing becomes live on its own.
--
-- A row is public once `published_at` has passed and it is either `published`
-- or `scheduled` — so a scheduled post appears at its time without a status
-- flip. RLS is the real gate; the public queries filter the same way.
-- ---------------------------------------------------------------------------
drop policy if exists "content_public_read" on public.content;
create policy "content_public_read" on public.content
  for select to anon, authenticated
  using (
    (
      publish_status in ('published', 'scheduled')
      and published_at is not null
      and published_at <= now()
    )
    or public.is_admin()
  );

-- ---------------------------------------------------------------------------
-- Admin dashboard indexes: sort by updated_at, filter by type/status.
-- ---------------------------------------------------------------------------
create index if not exists content_admin_updated_idx
  on public.content (updated_at desc);

create index if not exists content_admin_type_status_idx
  on public.content (type, publish_status);

create index if not exists subscribers_created_idx
  on public.subscribers (created_at desc);
