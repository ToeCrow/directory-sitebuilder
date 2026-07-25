import { and, asc, count, eq, max } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { products, siteTopPicks, sites } from "@/lib/db/schema";

export type AdminProductListItem = {
  id: string;
  siteId: string;
  siteSlug: string;
  siteTitle: string;
  ratingScale: number;
  name: string;
  slug: string;
  rating: number;
  hasAffiliatePartnership: boolean;
  status: "draft" | "published";
  isTopPick: boolean;
  topPickSortOrder: number | null;
};

export async function listAdminProducts(
  siteSlug?: string,
): Promise<AdminProductListItem[]> {
  const db = getDb();

  const rows = await db
    .select({
      id: products.id,
      siteId: products.siteId,
      siteSlug: sites.slug,
      siteTitle: sites.title,
      ratingScale: sites.ratingScale,
      name: products.name,
      slug: products.slug,
      rating: products.rating,
      hasAffiliatePartnership: products.hasAffiliatePartnership,
      status: products.status,
      topPickId: siteTopPicks.id,
      topPickSortOrder: siteTopPicks.sortOrder,
    })
    .from(products)
    .innerJoin(sites, eq(products.siteId, sites.id))
    .leftJoin(
      siteTopPicks,
      and(
        eq(siteTopPicks.productId, products.id),
        eq(siteTopPicks.siteId, products.siteId),
      ),
    )
    .where(siteSlug ? eq(sites.slug, siteSlug) : undefined)
    .orderBy(asc(sites.slug), asc(products.directorySortOrder));

  return rows.map((row) => ({
    id: row.id,
    siteId: row.siteId,
    siteSlug: row.siteSlug,
    siteTitle: row.siteTitle,
    ratingScale: row.ratingScale,
    name: row.name,
    slug: row.slug,
    rating: Number(row.rating),
    hasAffiliatePartnership: row.hasAffiliatePartnership,
    status: row.status,
    isTopPick: row.topPickId != null,
    topPickSortOrder: row.topPickSortOrder,
  }));
}

export async function getAdminProductById(id: string) {
  const db = getDb();
  const [row] = await db
    .select({
      product: products,
      siteSlug: sites.slug,
      siteTitle: sites.title,
      ratingScale: sites.ratingScale,
      topPickId: siteTopPicks.id,
    })
    .from(products)
    .innerJoin(sites, eq(products.siteId, sites.id))
    .leftJoin(
      siteTopPicks,
      and(
        eq(siteTopPicks.productId, products.id),
        eq(siteTopPicks.siteId, products.siteId),
      ),
    )
    .where(eq(products.id, id))
    .limit(1);

  if (!row) {
    return null;
  }

  return {
    ...row.product,
    rating: Number(row.product.rating),
    siteSlug: row.siteSlug,
    siteTitle: row.siteTitle,
    ratingScale: row.ratingScale,
    isTopPick: row.topPickId != null,
  };
}

export async function countTopPicksForProduct(
  productId: string,
): Promise<number> {
  const db = getDb();
  const [result] = await db
    .select({ value: count() })
    .from(siteTopPicks)
    .where(eq(siteTopPicks.productId, productId));
  return Number(result?.value ?? 0);
}

export async function getNextProductSortOrders(siteId: string): Promise<{
  comparisonRank: number;
  directorySortOrder: number;
}> {
  const db = getDb();
  const [row] = await db
    .select({
      maxComparison: max(products.comparisonRank),
      maxDirectory: max(products.directorySortOrder),
    })
    .from(products)
    .where(eq(products.siteId, siteId));

  return {
    comparisonRank: Number(row?.maxComparison ?? 0) + 1,
    directorySortOrder: Number(row?.maxDirectory ?? 0) + 1,
  };
}
