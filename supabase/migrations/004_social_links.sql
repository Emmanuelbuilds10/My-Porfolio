-- =============================================================================
-- 004_social_links.sql — admin-editable Behance + LinkedIn profile URLs
--
-- Extends `site_settings` beyond the original Twitter/GitHub pair so every
-- social link shown in the footer is owned by the admin. Guarded; safe to
-- run twice.
-- =============================================================================

do $$ begin
  alter table public.site_settings add column behance_url text;
exception when duplicate_column then null; end $$;

do $$ begin
  alter table public.site_settings add column linkedin_url text;
exception when duplicate_column then null; end $$;
