import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const base = site.url.replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin"],
      },
    ],
    // The sitemap is the crawler's map of the site; without it a new domain can
    // sit unlisted far longer than it needs to.
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
