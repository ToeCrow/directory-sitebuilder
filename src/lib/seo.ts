import type { Article, SiteData } from "@/types/site";

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export type OgImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

/** Relative path resolved to an absolute URL via site metadataBase. */
export function getDefaultOgImage(site: SiteData): OgImage {
  return {
    url: `/sites/${site.slug}/og-default.png`,
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    alt: site.title,
  };
}

export function getArticleOgImage(site: SiteData, article: Article): OgImage {
  if (article.ogImage) {
    return {
      url: article.ogImage.src,
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      alt: article.ogImage.alt,
    };
  }

  return getDefaultOgImage(site);
}

export function toAbsoluteUrl(siteUrl: string, pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }

  const base = siteUrl.replace(/\/$/, "");
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}
