import { sites, type SiteId } from "@/config/sites";
import { productModules } from "@/data/sites";
import type { Product } from "@/types/product";
import type { SiteConfig } from "@/types/site";

export function isValidSiteSlug(slug: string): slug is SiteId {
  return slug in sites;
}

export function getSiteConfig(siteSlug: SiteId): SiteConfig {
  return sites[siteSlug];
}

export function getSiteConfigOrUndefined(
  siteSlug: string,
): SiteConfig | undefined {
  if (!isValidSiteSlug(siteSlug)) {
    return undefined;
  }

  return sites[siteSlug];
}

function getProductModule(siteSlug: SiteId) {
  return productModules[siteSlug];
}

export function getProducts(siteSlug: SiteId): Product[] {
  return getProductModule(siteSlug).products;
}

export function getProductBySlug(
  siteSlug: SiteId,
  slug: string,
): Product | undefined {
  return getProductModule(siteSlug).getProductBySlug(slug);
}

export function getTopProducts(siteSlug: SiteId, limit = 3): Product[] {
  return getProductModule(siteSlug).getTopProducts(limit);
}

export function productHasFeature(
  siteSlug: SiteId,
  product: Product,
  feature: string,
): boolean {
  return getProductModule(siteSlug).productHasFeature(product, feature);
}
