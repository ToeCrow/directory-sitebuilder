import {
  getSiteBySlug,
  isValidSiteSlug,
  type SiteSlug,
} from "@/data/sites";
import type { Product } from "@/types/site";

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

export function getTopPickProducts(siteSlug: SiteSlug): Product[] {
  const site = getSiteData(siteSlug);
  return site.topPicks.picks
    .map((pick) => getProductBySlug(siteSlug, pick.productSlug))
    .filter((product): product is Product => product !== undefined);
}

export function getComparisonValue(
  product: Product,
  rowKey: string,
): string | boolean | undefined {
  return product.comparison[rowKey];
}
