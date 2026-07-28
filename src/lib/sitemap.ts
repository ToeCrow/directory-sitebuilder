import type { MetadataRoute } from "next";
import {
  getArticles,
  getProducts,
  getSiteBySlug,
  siteSlugs,
  type SiteSlug,
} from "@/lib/site";
import { getPublicAbsoluteUrl, siteUsesPublicPaths } from "@/lib/paths";
import { siteUsesAboutPage } from "@/lib/about";
import { siteUsesPrivacyPolicy } from "@/lib/privacy-policy";
import { siteUsesResearchScore } from "@/lib/research-score";

export function buildSiteSitemapEntries(
  siteSlug: string,
): MetadataRoute.Sitemap {
  const siteData = getSiteBySlug(siteSlug);
  if (!siteData) {
    return [];
  }

  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: getPublicAbsoluteUrl(siteSlug, siteData.siteUrl, "/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: getPublicAbsoluteUrl(siteSlug, siteData.siteUrl, "/products"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: getPublicAbsoluteUrl(siteSlug, siteData.siteUrl, "/comparisons"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
  ];

  if (siteUsesAboutPage(siteSlug)) {
    entries.push({
      url: getPublicAbsoluteUrl(siteSlug, siteData.siteUrl, "/about"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    });
  }

  if (siteUsesPrivacyPolicy(siteSlug)) {
    entries.push({
      url: getPublicAbsoluteUrl(siteSlug, siteData.siteUrl, "/privacy-policy"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    });
  }

  entries.push({
    url: getPublicAbsoluteUrl(siteSlug, siteData.siteUrl, "/affiliate"),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.4,
  });

  if (siteUsesResearchScore(siteSlug)) {
    entries.push({
      url: getPublicAbsoluteUrl(siteSlug, siteData.siteUrl, "/research-score"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    });
  }

  for (const product of getProducts(siteSlug as SiteSlug)) {
    entries.push({
      url: getPublicAbsoluteUrl(
        siteSlug,
        siteData.siteUrl,
        `/products/${product.slug}`,
      ),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const article of getArticles(siteSlug as SiteSlug)) {
    entries.push({
      url: getPublicAbsoluteUrl(
        siteSlug,
        siteData.siteUrl,
        `/articles/${article.slug}`,
      ),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  if (siteUsesPublicPaths(siteSlug)) {
    const badPrefix = `${siteData.siteUrl.replace(/\/$/, "")}/${siteSlug}/`;
    for (const entry of entries) {
      if (entry.url.startsWith(badPrefix)) {
        throw new Error(
          `Sitemap URL incorrectly includes siteSlug prefix: ${entry.url}`,
        );
      }
    }
  }

  return entries;
}

export function buildAllSitesSitemapEntries(): MetadataRoute.Sitemap {
  return siteSlugs.flatMap((slug) => buildSiteSitemapEntries(slug));
}
