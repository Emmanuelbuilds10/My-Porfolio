-- ---------------------------------------------------------------------------
-- content.gallery — the extra images attached to a post or project.
--
-- One ordered JSON array of `{ url, alt }` instead of a child table: the images
-- belong to exactly one item, are only ever read alongside it, and the editor
-- already holds the whole array in memory, so a join table would add a
-- round-trip and a sort column for nothing. `url` points at the `covers`
-- Storage bucket exactly like `cover_image_url`; `alt` is per-image alt text.
--
-- Defaults to an empty array so every existing row and the seed stay valid.
-- ---------------------------------------------------------------------------

alter table public.content
  add column if not exists gallery jsonb not null default '[]'::jsonb;

comment on column public.content.gallery is
  'Ordered [{ url, alt }] extra images rendered on the detail page.';
