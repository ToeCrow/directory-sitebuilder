import { and, asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { buyingGuideSections, siteSections } from "@/lib/db/schema";

export type AdminBuyingGuideSection = {
  id: string;
  title: string;
  content: string;
  sortOrder: number;
};

export async function listBuyingGuideSections(
  siteId: string,
): Promise<AdminBuyingGuideSection[]> {
  const db = getDb();
  return db
    .select({
      id: buyingGuideSections.id,
      title: buyingGuideSections.title,
      content: buyingGuideSections.content,
      sortOrder: buyingGuideSections.sortOrder,
    })
    .from(buyingGuideSections)
    .where(eq(buyingGuideSections.siteId, siteId))
    .orderBy(asc(buyingGuideSections.sortOrder));
}

export async function getBuyingGuideTitle(siteId: string): Promise<string> {
  const db = getDb();
  const [section] = await db
    .select({ title: siteSections.title })
    .from(siteSections)
    .where(
      and(
        eq(siteSections.siteId, siteId),
        eq(siteSections.sectionKey, "buying-guide"),
      ),
    )
    .limit(1);
  return section?.title ?? "";
}

export async function getNextBuyingGuideSortOrder(
  siteId: string,
): Promise<number> {
  const db = getDb();
  const rows = await db
    .select({ sortOrder: buyingGuideSections.sortOrder })
    .from(buyingGuideSections)
    .where(eq(buyingGuideSections.siteId, siteId));
  return rows.reduce((max, row) => Math.max(max, row.sortOrder), 0) + 1;
}
