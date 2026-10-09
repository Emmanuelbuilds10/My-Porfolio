/**
 * Hero artwork for PageHero.
 *
 * Phase 5's admin will move this into site_settings; until then it is one
 * constant — a local file if you dropped one in, else a fixed Unsplash photo
 * so the hero matches the design's photographic look without any asset work.
 */
export const HERO_IMAGE =
  process.env.NEXT_PUBLIC_HERO_IMAGE_URL ?? "/images/hero.jpg";
