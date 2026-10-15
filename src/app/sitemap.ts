import type { MetadataRoute } from "next";
import { getPublishedPostSlugs, getPublishedProjectSlugs } from "@/lib/queries";
import { site } from "@/lib/site";

/**
 * Sitemap for search engines, served at `/sitemap.xml`.
 *
 * Only public routes appear here: the admin is deliberately (and permanently)
 * left out, which is why it is also disallowed in `robots.ts`. Blog and project
 * detail URLs are read from the same RLS-scoped queries the pages use, so
 * drafts and future-dated rows can never leak into the index.
 *
 * Regenerated hourly. Publishing revalidates the pages it touches but not this
 * file, so a fresh item can take up to an hour to show up in the sitemap; that
 * is well inside crawlers' own revisit intervals, so it is not worth threading
 * a `revalidatePath("/sitemap.xml")` through every action.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");
  const [postSlugs, projectSlugs] = await Promise.all([
    getPublishedPostSlugs(),
    getPublishedProjectSlugs(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/writing`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/cookies`, changeFrequency: "yearly", priority: 0.2 },
  ];

  return [
    ...staticRoutes,
    ...projectSlugs.map((slug) => ({
      url: `${base}/projects/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...postSlugs.map((slug) => ({
      url: `${base}/writing/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
