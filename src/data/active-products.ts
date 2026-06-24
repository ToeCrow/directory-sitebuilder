import { getActiveSiteId } from "@/config/active-site";
import { productModules } from "@/data/sites";
import type { Product } from "@/types/product";

function getProductModule() {
  return productModules[getActiveSiteId()];
}

export const products: Product[] = getProductModule().products;

export function getProductBySlug(slug: string): Product | undefined {
  return getProductModule().getProductBySlug(slug);
}

export function getTopProducts(limit = 3): Product[] {
  return getProductModule().getTopProducts(limit);
}

export function productHasFeature(product: Product, feature: string): boolean {
  return getProductModule().productHasFeature(product, feature);
}
