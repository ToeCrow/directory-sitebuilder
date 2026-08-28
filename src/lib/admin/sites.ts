import { asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { siteHeroes, siteSections, sites } from "@/lib/db/schema";

export type AdminSiteListItem = {
  id: string;
  slug: string;
  title: string;
  niche: string;
  status: "draft" | "published";
};

export async function listAdminSites(): Promise<AdminSiteListItem[]> {
  const db = getDb();
  const rows = await db
    .select({
      id: sites.id,
      slug: sites.slug,
      title: sites.title,
      niche: sites.niche,
      status: sites.status,
    })
    .from(sites)
    .orderBy(asc(sites.slug));

  return rows;
}

export const SITE_SECTION_KEYS = [
  "top-picks",
  "product-directory",
  "comparison-table",
  "buying-guide",
  "footer",
] as const;

export type SiteSectionKey = (typeof SITE_SECTION_KEYS)[number];

export type SiteRow = typeof sites.$inferSelect;
export type SiteHeroRow = typeof siteHeroes.$inferSelect;
export type SiteSectionRow = typeof siteSections.$inferSelect;

export type AdminSiteDetail = {
  site: SiteRow;
  hero: SiteHeroRow | null;
  sections: Record<SiteSectionKey, SiteSectionRow | null>;
};

export async function getAdminSiteById(
  id: string,
): Promise<AdminSiteDetail | null> {
  const db = getDb();

  const [siteRow] = await db
    .select()
    .from(sites)
    .where(eq(sites.id, id))
    .limit(1);

  if (!siteRow) {
    return null;
  }

  const [heroRow] = await db
    .select()
    .from(siteHeroes)
    .where(eq(siteHeroes.siteId, id))
    .limit(1);

  const sectionRows = await db
    .select()
    .from(siteSections)
    .where(eq(siteSections.siteId, id));

  const sectionsByKey = new Map(
    sectionRows.map((row) => [row.sectionKey, row]),
  );

  const sections = Object.fromEntries(
    SITE_SECTION_KEYS.map((key) => [key, sectionsByKey.get(key) ?? null]),
  ) as Record<SiteSectionKey, SiteSectionRow | null>;

  return {
    site: siteRow,
    hero: heroRow ?? null,
    sections,
  };
}

export async function getAdminSiteSlug(id: string): Promise<string | null> {
  const db = getDb();
  const [row] = await db
    .select({ slug: sites.slug })
    .from(sites)
    .where(eq(sites.id, id))
    .limit(1);
  return row?.slug ?? null;
}
