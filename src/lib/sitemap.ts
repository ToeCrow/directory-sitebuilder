import type { MetadataRoute } from "next";
import {
  getAllSites,
  getSiteBySlug,
  siteSlugs,
  type SiteSlug,
} from "@/data/sites";

/**
 * Sitemap reads the static seed modules — no build-time DB access.
 * TODO after Neon: DB-backed sitemap + force-dynamic / on-demand revalidation.
 */
export function buildSiteSitemapEntries(
  siteSlug: string,
): MetadataRoute.Sitemap {
  const siteData = getSiteBySlug(siteSlug);
  if (!siteData) {
    return [];
  }

  const base = siteData.siteUrl.replace(/\/$/, "");
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  for (const product of siteData.products) {
    entries.push({
      url: `${base}/${siteSlug}/products/${product.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const article of siteData.articles) {
    entries.push({
      url: `${base}/${siteSlug}/articles/${article.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}

export function buildAllSitesSitemapEntries(): MetadataRoute.Sitemap {
  return siteSlugs.flatMap((slug) => buildSiteSitemapEntries(slug));
}

export { getAllSites };
export type { SiteSlug };
