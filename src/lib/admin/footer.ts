import { and, asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { footerLinks, siteSections } from "@/lib/db/schema";

export type AdminFooterLink = {
  id: string;
  label: string;
  href: string;
  sortOrder: number;
};

export async function listFooterLinks(
  siteId: string,
): Promise<AdminFooterLink[]> {
  const db = getDb();
  return db
    .select({
      id: footerLinks.id,
      label: footerLinks.label,
      href: footerLinks.href,
      sortOrder: footerLinks.sortOrder,
    })
    .from(footerLinks)
    .where(eq(footerLinks.siteId, siteId))
    .orderBy(asc(footerLinks.sortOrder));
}

export async function getFooterTagline(siteId: string): Promise<string> {
  const db = getDb();
  const [section] = await db
    .select({ title: siteSections.title })
    .from(siteSections)
    .where(
      and(
        eq(siteSections.siteId, siteId),
        eq(siteSections.sectionKey, "footer"),
      ),
    )
    .limit(1);
  return section?.title ?? "";
}

export async function getNextFooterLinkSortOrder(
  siteId: string,
): Promise<number> {
  const db = getDb();
  const rows = await db
    .select({ sortOrder: footerLinks.sortOrder })
    .from(footerLinks)
    .where(eq(footerLinks.siteId, siteId));
  return rows.reduce((max, row) => Math.max(max, row.sortOrder), 0) + 1;
}
