import type { Product, ProductCategory } from "@/types/site";
import {
  getSiteBySlug,
  type SiteSlug,
} from "@/data/sites";
import type { Article } from "@/types/site";

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

export function getProductsByCategory(
  siteSlug: SiteSlug,
  category: ProductCategory,
): Product[] {
  return getProducts(siteSlug).filter((product) => product.category === category);
}

export function getFeaturedProducts(siteSlug: SiteSlug): Product[] {
  return getProducts(siteSlug)
    .filter((product) => product.featuredRank !== null)
    .sort((a, b) => a.featuredRank! - b.featuredRank!);
}

export function getComparisonProducts(siteSlug: SiteSlug): Product[] {
  return getProducts(siteSlug)
    .filter(
      (product) =>
        product.comparison !== undefined &&
        product.comparisonRank !== undefined &&
        (product.category !== "pillow"),
    )
    .sort((a, b) => (a.comparisonRank ?? 0) - (b.comparisonRank ?? 0));
}

export function getDirectoryProducts(
  siteSlug: SiteSlug,
  category?: ProductCategory,
): Product[] {
  const list = category
    ? getProductsByCategory(siteSlug, category)
    : getProducts(siteSlug);
  return [...list].sort((a, b) => a.directoryOrder - b.directoryOrder);
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
