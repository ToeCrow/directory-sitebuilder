import { asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { products, siteTopPicks } from "@/lib/db/schema";

export type AdminTopPickItem = {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productStatus: "draft" | "published";
  rating: number;
  sortOrder: number;
  badgeOverride: string | null;
};

export async function listTopPicksForSite(
  siteId: string,
): Promise<AdminTopPickItem[]> {
  const db = getDb();
  const rows = await db
    .select({
      id: siteTopPicks.id,
      productId: siteTopPicks.productId,
      productName: products.name,
      productSlug: products.slug,
      productStatus: products.status,
      rating: products.rating,
      sortOrder: siteTopPicks.sortOrder,
      badgeOverride: siteTopPicks.badgeOverride,
    })
    .from(siteTopPicks)
    .innerJoin(products, eq(siteTopPicks.productId, products.id))
    .where(eq(siteTopPicks.siteId, siteId))
    .orderBy(asc(siteTopPicks.sortOrder));

  return rows.map((row) => ({
    ...row,
    rating: Number(row.rating),
  }));
}

export type AvailableProduct = {
  id: string;
  name: string;
  slug: string;
};

/** Published products for a site that are not already a top pick. */
export async function listAvailableProductsForTopPicks(
  siteId: string,
): Promise<AvailableProduct[]> {
  const db = getDb();
  const topPicks = await db
    .select({ productId: siteTopPicks.productId })
    .from(siteTopPicks)
    .where(eq(siteTopPicks.siteId, siteId));
  const topPickIds = new Set(topPicks.map((row) => row.productId));

  const allProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      status: products.status,
    })
    .from(products)
    .where(eq(products.siteId, siteId))
    .orderBy(asc(products.name));

  return allProducts
    .filter((p) => p.status === "published" && !topPickIds.has(p.id))
    .map(({ id, name, slug }) => ({ id, name, slug }));
}

export async function getNextTopPickSortOrder(siteId: string): Promise<number> {
  const db = getDb();
  const rows = await db
    .select({ sortOrder: siteTopPicks.sortOrder })
    .from(siteTopPicks)
    .where(eq(siteTopPicks.siteId, siteId));
  return rows.reduce((max, row) => Math.max(max, row.sortOrder), 0) + 1;
}
