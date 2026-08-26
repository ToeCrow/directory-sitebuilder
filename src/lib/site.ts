import { cache } from "react";
import {
  getSiteBySlug as getStaticSiteBySlug,
  siteSlugs as staticSiteSlugs,
} from "@/data/sites";
import { siteUsesEditorialCatalog } from "@/lib/directory-catalog";
import { hydrateSiteData } from "@/lib/db/hydrate";
import {
  countSites,
  findSiteBySlug,
  listPublishedSiteSlugs,
} from "@/lib/db/repositories/sites";
import type {
  Article,
  Product,
  ProductCategory,
  ReviewCategory,
  SiteData,
} from "@/types/site";

/** Site slug validated against the database (published sites for public). */
export type SiteSlug = string;

export const getSiteData = cache(async (siteSlug: string): Promise<SiteData> => {
  return hydrateSiteData(siteSlug, { publishedOnly: true });
});

export async function getSiteBySlug(
  slug: string,
): Promise<SiteData | undefined> {
  try {
    return await getSiteData(slug);
  } catch {
    return undefined;
  }
}

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

export async function siteSlugs(): Promise<string[]> {
  return listPublishedSiteSlugs();
}

export async function isValidSiteSlug(slug: string): Promise<boolean> {
  const site = await findSiteBySlug(slug);
  return site != null && site.status === "published";
}

export function productBySlugFrom(
  siteData: SiteData,
  slug: string,
): Product | undefined {
  return siteData.products.find((product) => product.slug === slug);
}

export function articleBySlugFrom(
  siteData: SiteData,
  slug: string,
): Article | undefined {
  return siteData.articles.find((article) => article.slug === slug);
}

export function articlesFeaturingProductFrom(
  siteData: SiteData,
  productSlug: string,
): Article[] {
  return siteData.articles.filter(
    (article) =>
      article.kind === "product-roundup" &&
      article.products.some((product) => product.productSlug === productSlug),
  );
}

export function articlesByReviewCategoryFrom(
  siteData: SiteData,
  category?: ReviewCategory,
): Article[] {
  if (!category) return siteData.articles;
  return siteData.articles.filter(
    (article) => article.reviewCategory === category,
  );
}

/**
 * Homepage Featured Reviews: keyword guides + science + latest
 * (if science is latest, use 2nd-latest non-science instead).
 */
export function featuredHomeReviewsFrom(siteData: SiteData): Article[] {
  const bySlug = new Map(
    siteData.articles.map((article) => [article.slug, article]),
  );
  const featured: Article[] = [];
  const seen = new Set<string>();

  const push = (article: Article | undefined) => {
    if (!article || seen.has(article.slug)) return;
    seen.add(article.slug);
    featured.push(article);
  };

  for (const slug of siteData.featuredReviewSlugs ?? []) {
    push(bySlug.get(slug));
  }

  const scienceSlug = siteData.scienceArticleSlug;
  if (scienceSlug) {
    push(bySlug.get(scienceSlug));
  }

  const rankedNewestFirst = siteData.articles
    .map((article, index) => ({ article, index }))
    .sort((a, b) => {
      const dateA = a.article.publishedAt ?? "";
      const dateB = b.article.publishedAt ?? "";
      if (dateA !== dateB) {
        return dateB.localeCompare(dateA);
      }
      return b.index - a.index;
    })
    .map(({ article }) => article);

  const latest = rankedNewestFirst[0];
  if (!latest) {
    return featured;
  }

  if (scienceSlug && latest.slug === scienceSlug) {
    const secondLatestNonScience = rankedNewestFirst.find(
      (article) => article.slug !== scienceSlug,
    );
    push(secondLatestNonScience);
  } else {
    push(latest);
  }

  return featured;
}

export function productsByCategoryFrom(
  siteData: SiteData,
  category: ProductCategory,
): Product[] {
  return siteData.products.filter((product) => product.category === category);
}

export function featuredProductsFrom(siteData: SiteData): Product[] {
  return siteData.products
    .filter((product) => product.featuredRank !== null)
    .sort((a, b) => a.featuredRank! - b.featuredRank!);
}

export function comparisonProductsFrom(siteData: SiteData): Product[] {
  return siteData.products
    .filter(
      (product) =>
        product.comparison !== undefined &&
        product.comparisonRank !== undefined &&
        product.category !== "pillow",
    )
    .sort((a, b) => (a.comparisonRank ?? 0) - (b.comparisonRank ?? 0));
}

export function directoryProductsFrom(
  siteData: SiteData,
  category?: ProductCategory,
): Product[] {
  const list = category
    ? productsByCategoryFrom(siteData, category)
    : siteData.products;
  return [...list].sort((a, b) => a.directoryOrder - b.directoryOrder);
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

export function getComparisonValue(
  product: Product,
  rowKey: string,
): string | boolean | undefined {
  return product.comparison?.[rowKey];
}

export function siteHasMattressPillowNav(siteSlug: string): boolean {
  return siteSlug === "side-sleeper";
}

/** Editorial star ratings on product cards and product pages (not used on Side Sleeper). */
export function siteShowsProductRatings(siteSlug: string): boolean {
  return !siteHasMattressPillowNav(siteSlug);
}

export function getLegacyDirectorySiteSlugs(): string[] {
  return staticSiteSlugs.filter((slug) => !siteUsesEditorialCatalog(slug));
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
