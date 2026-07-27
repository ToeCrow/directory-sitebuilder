import type { Product } from "@/types/site";

/** Destination for “Visit site” / buy CTAs. */
export function getBuyUrl(product: Product): string {
  return product.affiliateUrl ?? product.productUrl;
}

export function buyLinkRel(product: Product): string {
  return product.affiliateUrl
    ? "noopener noreferrer sponsored"
    : "noopener noreferrer";
}
