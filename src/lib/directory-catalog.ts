import { catalog as findworthnowCatalog } from "@/data/sites/findworthnow/catalog";
import type {
  DirectoryCatalog,
  DirectoryCategory,
  DirectoryProduct,
} from "@/types/directory-catalog";

const RESERVED_TOP_LEVEL_PATHS = new Set([
  "products",
  "reviews",
  "buying-guide",
  "comparisons",
  "affiliate",
  "affiliate-disclosure",
  "about",
  "privacy-policy",
  "research-score",
]);

const catalogs: Record<string, DirectoryCatalog> = {
  findworthnow: findworthnowCatalog,
};

export function siteUsesEditorialCatalog(siteSlug: string): boolean {
  return siteSlug in catalogs;
}

export function getDirectoryCatalog(
  siteSlug: string,
): DirectoryCatalog | undefined {
  return catalogs[siteSlug];
}

export function getDirectoryCategories(siteSlug: string): DirectoryCategory[] {
  return getDirectoryCatalog(siteSlug)?.categories ?? [];
}

export function getDirectoryCategory(
  siteSlug: string,
  categorySlug: string,
): DirectoryCategory | undefined {
  return getDirectoryCategories(siteSlug).find(
    (category) => category.slug === categorySlug,
  );
}

export function getDirectoryProducts(
  siteSlug: string,
  categorySlug?: string,
): DirectoryProduct[] {
  const products = getDirectoryCatalog(siteSlug)?.products ?? [];
  if (!categorySlug) return products;
  return products.filter((product) => product.categorySlug === categorySlug);
}

export function getDirectoryProductByReviewSlug(
  siteSlug: string,
  categorySlug: string,
  reviewSlug: string,
): DirectoryProduct | undefined {
  return getDirectoryProducts(siteSlug, categorySlug).find(
    (product) => product.reviewSlug === reviewSlug,
  );
}

export function assertCatalogSlugsAreValid(siteSlug: string): void {
  for (const category of getDirectoryCategories(siteSlug)) {
    if (RESERVED_TOP_LEVEL_PATHS.has(category.slug)) {
      throw new Error(
        `Directory category slug "${category.slug}" on ${siteSlug} conflicts with a reserved site path.`,
      );
    }
  }
}

for (const siteSlug of Object.keys(catalogs)) {
  assertCatalogSlugsAreValid(siteSlug);
}
