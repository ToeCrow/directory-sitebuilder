import { asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { faqs } from "@/lib/db/schema";

export type AdminFaqItem = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
};

export async function listFaqsForSite(siteId: string): Promise<AdminFaqItem[]> {
  const db = getDb();
  return db
    .select({
      id: faqs.id,
      question: faqs.question,
      answer: faqs.answer,
      sortOrder: faqs.sortOrder,
    })
    .from(faqs)
    .where(eq(faqs.siteId, siteId))
    .orderBy(asc(faqs.sortOrder));
}

export async function getNextFaqSortOrder(siteId: string): Promise<number> {
  const db = getDb();
  const rows = await db
    .select({ sortOrder: faqs.sortOrder })
    .from(faqs)
    .where(eq(faqs.siteId, siteId));
  return rows.reduce((max, row) => Math.max(max, row.sortOrder), 0) + 1;
}
