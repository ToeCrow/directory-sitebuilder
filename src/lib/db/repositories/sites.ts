import { count, eq } from "drizzle-orm";
import { getDb } from "../index";
import { sites } from "../schema";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type SiteRow = typeof sites.$inferSelect;

export async function findSiteBySlug(slug: string): Promise<SiteRow | undefined> {
  const db = getDb();
  const [site] = await db
    .select()
    .from(sites)
    .where(eq(sites.slug, slug))
    .limit(1);
  return site;
}

export async function findSiteById(id: string): Promise<SiteRow | undefined> {
  const db = getDb();
  const [site] = await db.select().from(sites).where(eq(sites.id, id)).limit(1);
  return site;
}

export async function findSiteByIdOrSlug(
  idOrSlug: string,
): Promise<SiteRow | undefined> {
  if (UUID_REGEX.test(idOrSlug)) {
    return findSiteById(idOrSlug);
  }
  return findSiteBySlug(idOrSlug);
}

export async function countSites(): Promise<number> {
  const db = getDb();
  const [result] = await db.select({ value: count() }).from(sites);
  return Number(result?.value ?? 0);
}

export async function listPublishedSiteSlugs(): Promise<string[]> {
  const db = getDb();
  const rows = await db
    .select({ slug: sites.slug })
    .from(sites)
    .where(eq(sites.status, "published"));
  return rows.map((row) => row.slug);
}

export async function siteExistsBySlugOrId(idOrSlug: string): Promise<boolean> {
  const db = getDb();
  const condition = UUID_REGEX.test(idOrSlug)
    ? eq(sites.id, idOrSlug)
    : eq(sites.slug, idOrSlug);
  const [row] = await db
    .select({ id: sites.id })
    .from(sites)
    .where(condition)
    .limit(1);
  return Boolean(row);
}
