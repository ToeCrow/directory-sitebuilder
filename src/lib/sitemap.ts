import type { MetadataRoute } from "next";
import {
  getArticles,
  getProducts,
  getSiteBySlug,
  siteSlugs,
  type SiteSlug,
} from "@/lib/site";

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

  for (const product of getProducts(siteSlug as SiteSlug)) {
    entries.push({
      url: `${base}/${siteSlug}/products/${product.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const article of getArticles(siteSlug as SiteSlug)) {
    entries.push({
      url: `${base}/${siteSlug}/articles/${article.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  return entries;
}

export function buildAllSitesSitemapEntries(): MetadataRoute.Sitemap {
  return siteSlugs.flatMap((slug) => buildSiteSitemapEntries(slug));
}
