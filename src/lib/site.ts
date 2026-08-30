import { cache } from "react";
import {
  getSiteBySlug as getStaticSiteBySlug,
  siteSlugs as staticSiteSlugs,
} from "@/data/sites";
import { hydrateSiteData } from "@/lib/db/hydrate";
import { getStaticParamSiteSlugsForRoute } from "@/lib/site-routes";
import {
  countSites,
  findSiteBySlug,
  listPublishedSiteSlugs,
  listPublishedSiteSummaries,
} from "@/lib/db/repositories/sites";
import {
  articleBySlugFrom,
  articlesByReviewCategoryFrom,
  articlesFeaturingProductFrom,
  comparisonProductsFrom,
  directoryProductsFrom,
  featuredHomeReviewsFrom,
  featuredProductsFrom,
  productBySlugFrom,
  productsByCategoryFrom,
} from "@/lib/site-view";
import type { Article, Product, ProductCategory, ReviewCategory, SiteData } from "@/types/site";

export type { SiteData };
export type SiteSlug = string;

export {
  articleBySlugFrom,
  articlesByReviewCategoryFrom,
  articlesFeaturingProductFrom,
  comparisonProductsFrom,
  directoryProductsFrom,
  featuredHomeReviewsFrom,
  featuredProductsFrom,
  getComparisonValue,
  productByIdFrom,
  productBySlugFrom,
  roundupProductFrom,
  productsByCategoryFrom,
  siteHasMattressPillowNav,
} from "@/lib/site-view";

export const getSiteData = cache(async (siteSlug: string): Promise<SiteData> => {
  return hydrateSiteData(siteSlug, { publishedOnly: true });
});

export function isMissingSiteError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }
  return (
    error.message.startsWith("Site not found:") ||
    error.message.startsWith("Site is not published:")
  );
}

export async function getSiteBySlug(
  slug: string,
): Promise<SiteData | undefined> {
  try {
    return await getSiteData(slug);
  } catch (error) {
    if (isMissingSiteError(error)) {
      return undefined;
    }
    console.error(`[db] failed to load site "${slug}"`, error);
    throw error;
  }
}

/** Full hydrate of every published site — expensive; prefer listPublishedSiteLinks. */
export async function getAllSites(): Promise<SiteData[]> {
  const slugs = await listPublishedSiteSlugs();
  const sites: SiteData[] = [];
  for (const slug of slugs) {
    const site = await getSiteBySlug(slug);
    if (site) {
      sites.push(site);
    }
  }
  return sites;
}

export async function listPublishedSiteLinks(): Promise<
  { slug: string; title: string }[]
> {
  return listPublishedSiteSummaries();
}

export async function siteSlugs(): Promise<string[]> {
  return listPublishedSiteSlugs();
}

export async function isValidSiteSlug(slug: string): Promise<boolean> {
  const site = await findSiteBySlug(slug);
  return site != null && site.status === "published";
}

export async function getProducts(siteSlug: string): Promise<Product[]> {
  return (await getSiteData(siteSlug)).products;
}

export async function getProductBySlug(
  siteSlug: string,
  slug: string,
): Promise<Product | undefined> {
  return productBySlugFrom(await getSiteData(siteSlug), slug);
}

export async function getArticles(siteSlug: string): Promise<Article[]> {
  return (await getSiteData(siteSlug)).articles;
}

export async function getArticleBySlug(
  siteSlug: string,
  slug: string,
): Promise<Article | undefined> {
  return articleBySlugFrom(await getSiteData(siteSlug), slug);
}

export async function getArticlesFeaturingProduct(
  siteSlug: string,
  productSlug: string,
): Promise<Article[]> {
  return articlesFeaturingProductFrom(await getSiteData(siteSlug), productSlug);
}

export async function getArticlesByReviewCategory(
  siteSlug: string,
  category?: ReviewCategory,
): Promise<Article[]> {
  return articlesByReviewCategoryFrom(await getSiteData(siteSlug), category);
}

export async function getFeaturedHomeReviews(
  siteSlug: string,
): Promise<Article[]> {
  return featuredHomeReviewsFrom(await getSiteData(siteSlug));
}

export async function getProductsByCategory(
  siteSlug: string,
  category: ProductCategory,
): Promise<Product[]> {
  return productsByCategoryFrom(await getSiteData(siteSlug), category);
}

export async function getFeaturedProducts(siteSlug: string): Promise<Product[]> {
  return featuredProductsFrom(await getSiteData(siteSlug));
}

export async function getComparisonProducts(
  siteSlug: string,
): Promise<Product[]> {
  return comparisonProductsFrom(await getSiteData(siteSlug));
}

export async function getDirectoryProducts(
  siteSlug: string,
  category?: ProductCategory,
): Promise<Product[]> {
  return directoryProductsFrom(await getSiteData(siteSlug), category);
}

export function getLegacyDirectorySiteSlugs(): string[] {
  return getStaticParamSiteSlugsForRoute("product-detail", staticSiteSlugs);
}

export function getStaticProducts(siteSlug: string): Product[] {
  return getStaticSiteBySlug(siteSlug)?.products ?? [];
}

export function getStaticArticles(siteSlug: string): Article[] {
  return getStaticSiteBySlug(siteSlug)?.articles ?? [];
}

/** Admin / tooling — includes draft sites if needed later. */
export async function getSiteCount(): Promise<number> {
  return countSites();
}
