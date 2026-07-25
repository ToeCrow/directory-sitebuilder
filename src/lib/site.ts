import { cache } from "react";
import { hydrateSiteData } from "@/lib/db/hydrate";
import {
  countSites,
  findSiteBySlug,
  listPublishedSiteSlugs,
} from "@/lib/db/repositories/sites";
import type { Article, Product, SiteData } from "@/types/site";

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

export async function getProducts(siteSlug: string): Promise<Product[]> {
  return (await getSiteData(siteSlug)).products;
}

export async function getProductBySlug(
  siteSlug: string,
  slug: string,
): Promise<Product | undefined> {
  const products = await getProducts(siteSlug);
  return products.find((product) => product.slug === slug);
}

export async function getArticles(siteSlug: string): Promise<Article[]> {
  return (await getSiteData(siteSlug)).articles;
}

export async function getArticleBySlug(
  siteSlug: string,
  slug: string,
): Promise<Article | undefined> {
  const articles = await getArticles(siteSlug);
  return articles.find((article) => article.slug === slug);
}

export async function getFeaturedProducts(siteSlug: string): Promise<Product[]> {
  const products = await getProducts(siteSlug);
  return products
    .filter((product) => product.featuredRank !== null)
    .sort((a, b) => a.featuredRank! - b.featuredRank!);
}

export async function getComparisonProducts(
  siteSlug: string,
): Promise<Product[]> {
  const products = await getProducts(siteSlug);
  return [...products].sort((a, b) => a.comparisonRank - b.comparisonRank);
}

export async function getDirectoryProducts(
  siteSlug: string,
): Promise<Product[]> {
  const products = await getProducts(siteSlug);
  return [...products].sort((a, b) => a.directoryOrder - b.directoryOrder);
}

export function getComparisonValue(
  product: Product,
  rowKey: string,
): string | boolean | undefined {
  return product.comparison[rowKey];
}

/** Admin / tooling — includes draft sites if needed later. */
export async function getSiteCount(): Promise<number> {
  return countSites();
}
