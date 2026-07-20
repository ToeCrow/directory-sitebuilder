import {
  getSiteBySlug,
  isValidSiteSlug,
  type SiteSlug,
} from "@/data/sites";
import type { Article, Product } from "@/types/site";

export { getSiteBySlug, isValidSiteSlug, siteSlugs, getAllSites } from "@/data/sites";
export type { SiteSlug } from "@/data/sites";

export function getSiteData(siteSlug: SiteSlug) {
  return getSiteBySlug(siteSlug)!;
}

export function getProducts(siteSlug: SiteSlug): Product[] {
  return getSiteData(siteSlug).products;
}

export function getProductBySlug(
  siteSlug: SiteSlug,
  slug: string,
): Product | undefined {
  return getProducts(siteSlug).find((product) => product.slug === slug);
}

export function getArticles(siteSlug: SiteSlug): Article[] {
  return getSiteData(siteSlug).articles;
}

export function getArticleBySlug(
  siteSlug: SiteSlug,
  slug: string,
): Article | undefined {
  return getArticles(siteSlug).find((article) => article.slug === slug);
}

// TODO: add filtering by category, search query, and price range.
// TODO: add pagination support for large product catalogs.
// TODO: replace static queries with PostgreSQL (see src/lib/db.ts).

export function getFeaturedProducts(siteSlug: SiteSlug): Product[] {
  return getProducts(siteSlug)
    .filter((product) => product.featuredRank !== null)
    .sort((a, b) => a.featuredRank! - b.featuredRank!);
}

export function getComparisonProducts(siteSlug: SiteSlug): Product[] {
  return [...getProducts(siteSlug)].sort(
    (a, b) => a.comparisonRank - b.comparisonRank,
  );
}

export function getDirectoryProducts(siteSlug: SiteSlug): Product[] {
  return [...getProducts(siteSlug)].sort(
    (a, b) => a.directoryOrder - b.directoryOrder,
  );
}

export function getComparisonValue(
  product: Product,
  rowKey: string,
): string | boolean | undefined {
  return product.comparison[rowKey];
}
