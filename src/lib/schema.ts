import type { Article, SiteData } from "@/types/site";
import { getArticleOgImage, toAbsoluteUrl } from "@/lib/seo";

type JsonLdObject = Record<string, unknown>;

export function buildWebSiteSchema(site: SiteData): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.title,
    url: site.siteUrl,
  };
}

export function buildOrganizationSchema(site: SiteData): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.title,
    url: site.siteUrl,
  };
}

type BuildArticleSchemaArgs = {
  site: SiteData;
  article: Article;
  /** Absolute or site-relative page URL */
  url: string;
};

export function buildArticleSchema({
  site,
  article,
  url,
}: BuildArticleSchemaArgs): JsonLdObject {
  const absoluteUrl = toAbsoluteUrl(site.siteUrl, url);
  const ogImage = getArticleOgImage(site, article);
  const imageUrl = toAbsoluteUrl(site.siteUrl, ogImage.url);
  const description = article.excerpt ?? article.intro[0];

  const schema: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description,
    url: absoluteUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl,
    },
    image: [imageUrl],
    publisher: {
      "@type": "Organization",
      name: site.title,
      url: site.siteUrl,
    },
  };

  if (article.publishedAt) {
    schema.datePublished = article.publishedAt;
  }

  if (article.updatedAt) {
    schema.dateModified = article.updatedAt;
  } else if (article.publishedAt) {
    schema.dateModified = article.publishedAt;
  }

  if (article.author) {
    schema.author = {
      "@type": "Person",
      name: article.author,
    };
  }

  return schema;
}
