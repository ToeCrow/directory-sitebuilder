import type { MetadataRoute } from "next";
import { getSiteBySlug, siteSlugs } from "@/data/sites";
import { getPublicAbsoluteUrl, siteUsesPublicPaths } from "@/lib/paths";
import {
  getDirectoryCategories,
  getDirectoryProducts,
} from "@/lib/directory-catalog";
import { canAccessRoute } from "@/lib/site-routes";
import { getArticleConfig, siteHasFeature } from "@/lib/site-config";

export function buildSiteSitemapEntries(
  siteSlug: string,
): MetadataRoute.Sitemap {
  const siteData = getSiteBySlug(siteSlug);
  if (!siteData) {
    return [];
  }

  const now = new Date();

  if (siteHasFeature(siteSlug, "catalog")) {
    const entries: MetadataRoute.Sitemap = [
      {
        url: getPublicAbsoluteUrl(siteSlug, siteData.siteUrl, "/"),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 1,
      },
      {
        url: getPublicAbsoluteUrl(
          siteSlug,
          siteData.siteUrl,
          "/affiliate-disclosure",
        ),
        lastModified: now,
        changeFrequency: "yearly",
        priority: 0.3,
      },
      {
        url: getPublicAbsoluteUrl(siteSlug, siteData.siteUrl, "/products"),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.85,
      },
    ];

    for (const category of getDirectoryCategories(siteSlug)) {
      entries.push({
        url: getPublicAbsoluteUrl(siteSlug, siteData.siteUrl, `/${category.slug}`),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    for (const product of getDirectoryProducts(siteSlug)) {
      entries.push({
        url: getPublicAbsoluteUrl(
          siteSlug,
          siteData.siteUrl,
          `/${product.categorySlug}/${product.reviewSlug}`,
        ),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }

    const articleRoute = getArticleConfig(siteSlug)?.route;
    const blogArticles =
      articleRoute === "blog" ? siteData.articles : [];
    if (blogArticles.length > 0 && articleRoute) {
      entries.push({
        url: getPublicAbsoluteUrl(siteSlug, siteData.siteUrl, `/${articleRoute}`),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    for (const post of blogArticles) {
      entries.push({
        url: getPublicAbsoluteUrl(
          siteSlug,
          siteData.siteUrl,
          `/${articleRoute}/${post.slug}`,
        ),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.65,
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
  ];

  // Construction-software (and similar) keep /comparisons; Side Sleeper does not.
  if (canAccessRoute(siteSlug, "comparisons")) {
    entries.push({
      url: getPublicAbsoluteUrl(siteSlug, siteData.siteUrl, "/comparisons"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  entries.push({
    url: getPublicAbsoluteUrl(siteSlug, siteData.siteUrl, "/buying-guide"),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  });

  if (canAccessRoute(siteSlug, "about")) {
    entries.push({
      url: getPublicAbsoluteUrl(siteSlug, siteData.siteUrl, "/about"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    });
  }

  if (canAccessRoute(siteSlug, "privacy")) {
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

  for (const product of siteData.products) {
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

  if (siteData.articles.length > 0) {
    entries.push({
      url: getPublicAbsoluteUrl(siteSlug, siteData.siteUrl, "/reviews"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  for (const article of siteData.articles) {
    entries.push({
      url: getPublicAbsoluteUrl(
        siteSlug,
        siteData.siteUrl,
        `/reviews/${article.slug}`,
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
