# Image assets

Drop real artwork at these paths and the site picks it up with no code change.
Until a file exists, `CoverImage` / `Avatar` draw a violet placeholder, so the
layout is never broken by a missing asset.

| Path | Used by |
| --- | --- |
| `public/images/hero.jpg` | Background of every `PageHero` (home, Writing, Projects, About). Landscape, at least 2000px wide. |
| `public/images/avatar.png` | Author card on post pages + the avatar on About. Square cut-out with a transparent background. |
| `public/images/covers/<slug>.jpg` | Cover for the post or project with that slug. 3:2 landscape works best (cards crop to 6:5). |

The slug is the last segment of the item's URL — the post at
`/writing/elevate-your-development-game-today` uses
`public/images/covers/elevate-your-development-game-today.jpg`.

Once the admin is live (Phase 4), uploads go to Supabase Storage and the
`cover_image_url` column wins over these local files.
