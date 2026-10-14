/**
 * Hero artwork for PageHero.
 *
 * Phase 5's admin will move this into site_settings; until then it is one
 * constant — a local file if you dropped one in, else a fixed Unsplash photo
 * so the hero matches the design's photographic look without any asset work.
 */
export const HERO_IMAGE =
  process.env.NEXT_PUBLIC_HERO_IMAGE_URL ?? "/images/hero.jpg";

/**
 * The dark, code-flavoured photo each archive hero uses as its backdrop,
 * behind the title.
 *
 * Both files ship with the repo (`public/images/hero-work.jpg` and
 * `hero-blog.jpg`) and come from Unsplash, whose licence allows commercial use
 * without attribution. Drop your own file at either path to swap it.
 */
export const HERO_ART = {
  projects: "/images/hero-work.jpg",
  writing: "/images/hero-blog.jpg",
} as const;
