-- =============================================================================
-- 002_about_projects.sql — About / Projects phase additions
--
-- Everything is guarded; safe to run twice, and harmless after 001.
-- =============================================================================

-- Where the author is based (About meta line). name/role/email already exist
-- from 001; this adds anything the newer phases need.
do $$ begin
  alter table public.site_settings add column location text;
exception when duplicate_column then null; end $$;

-- The seed script upserts facts with `onConflict: "label"`, so the label needs
-- a unique index for repeated runs to be idempotent.
create unique index if not exists facts_label_key on public.facts (label);

-- The Projects filters hit tech_stack and project_status directly; keep both
-- indexable.
create index if not exists content_tech_stack_idx
  on public.content using gin (tech_stack);

create index if not exists content_project_status_idx
  on public.content (project_status)
  where project_status is not null;
