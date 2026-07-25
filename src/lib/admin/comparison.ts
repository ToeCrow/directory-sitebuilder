import { and, asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { comparisonRows, siteSections } from "@/lib/db/schema";

export type AdminComparisonRow = {
  id: string;
  key: string;
  label: string;
  type: "text" | "boolean";
  sortOrder: number;
};

export async function listComparisonRows(
  siteId: string,
): Promise<AdminComparisonRow[]> {
  const db = getDb();
  return db
    .select({
      id: comparisonRows.id,
      key: comparisonRows.key,
      label: comparisonRows.label,
      type: comparisonRows.type,
      sortOrder: comparisonRows.sortOrder,
    })
    .from(comparisonRows)
    .where(eq(comparisonRows.siteId, siteId))
    .orderBy(asc(comparisonRows.sortOrder));
}

export type AdminComparisonSection = {
  title: string;
  description: string;
  rowHeaderLabel: string;
};

export async function getComparisonSection(
  siteId: string,
): Promise<AdminComparisonSection> {
  const db = getDb();
  const [section] = await db
    .select()
    .from(siteSections)
    .where(
      and(
        eq(siteSections.siteId, siteId),
        eq(siteSections.sectionKey, "comparison-table"),
      ),
    )
    .limit(1);

  const config = section?.config as { rowHeaderLabel?: string } | null;

  return {
    title: section?.title ?? "",
    description: section?.description ?? "",
    rowHeaderLabel: config?.rowHeaderLabel ?? "",
  };
}

export async function getNextComparisonRowSortOrder(
  siteId: string,
): Promise<number> {
  const db = getDb();
  const rows = await db
    .select({ sortOrder: comparisonRows.sortOrder })
    .from(comparisonRows)
    .where(eq(comparisonRows.siteId, siteId));
  return rows.reduce((max, row) => Math.max(max, row.sortOrder), 0) + 1;
}
