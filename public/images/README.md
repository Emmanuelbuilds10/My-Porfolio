# Image assets

Drop real artwork at these paths and the site picks it up with no code change.
Until a file exists, `CoverImage` / `Avatar` draw a violet placeholder, so the
layout is never broken by a missing asset.

| Path | Used by |
| --- | --- |
| `public/images/hero.jpg` | Fallback backdrop for `PageHero` (Writing / Projects). Landscape, at least 2000px wide. |
| `public/images/hero-work.jpg` | Backdrop of the Projects banner. |
| `public/images/hero-blog.jpg` | Backdrop of the Writing banner. |
| `public/images/avatar.png` | Author card on post pages + the avatar on About. Square cut-out with a transparent background. |
| `public/images/portrait.svg` | Fallback portrait in the landing "Hello" section until `avatar.png` exists. |
| `public/images/covers/<slug>.jpg` | Cover for the post or project with that slug. 3:2 landscape works best (cards crop to 6:5). |

The slug is the last segment of the item's URL — the post at
`/writing/elevate-your-development-game-today` uses
`public/images/covers/elevate-your-development-game-today.jpg`.

Once the admin is live (Phase 4), uploads go to Supabase Storage and the
`cover_image_url` column wins over these local files.

## Licence of the bundled photography

`hero-work.jpg` and `hero-blog.jpg` are stock photographs from
[Unsplash](https://unsplash.com), used under the
[Unsplash Licence](https://unsplash.com/license): free to use commercially,
no attribution required, but they may not be resold as-is or used to build a
competing image service. Keep a copy of the source URL for each file if you
replace them — that record is what you would show if anyone ever queried the
rights. The Terms & Conditions page states this provenance for visitors.

If you swap either file for client photography, get written permission from the
client first: the portfolio shows commissioned work, and the client owns the
images unless the agreement says otherwise.
