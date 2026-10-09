/**
 * Seed data — default tiles for the landing page's image carousel.
 * `scripts/seed.ts` upserts these once the 005 migration has run.
 */

export interface SeedLandingImage {
  slug: string;
  alt: string;
  sort_order: number;
}

/** Built from the project covers, matching the fixtures' fallback strip. */
export const seedLandingImages: SeedLandingImage[] = [
  { slug: "emmanuel-portfolio", alt: "Portfolio site cover", sort_order: 1 },
  { slug: "pigment", alt: "Pigment design-token pipeline", sort_order: 2 },
  { slug: "digest", alt: "Digest newsletter service", sort_order: 3 },
  { slug: "static-notes", alt: "Static Notes generator", sort_order: 4 },
];
