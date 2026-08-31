import { and, desc, eq, sql } from "drizzle-orm";
import type { AdminUser } from "@/lib/admin-access";
import { requestedSiteSlugOrDenied } from "@/lib/admin-access";
import { siteAccessCondition } from "@/lib/admin/sites";
import { addUtcDays, utcDateString } from "@/lib/click-tracking";
import { getDb } from "@/lib/db";
import { dailyLinkClicks, sites, trackedLinks } from "@/lib/db/schema";

export type AdminClickedLink = {
  id: string;
  label: string | null;
  placement: string;
  sourceType: string;
  sourcePath: string | null;
  targetType: string;
  targetId: string | null;
  targetUrl: string | null;
  totalClicks: number;
  clicks7d: number;
  clicks30d: number;
  siteSlug: string;
  siteTitle: string;
};

/** Admin UI groups this result set; it is not a full export of tracked_links. */
export const TOP_CLICKED_LINKS_LIMIT = 50;

export async function listTopClickedLinks(
  user: AdminUser,
  siteSlug?: string,
  limit = TOP_CLICKED_LINKS_LIMIT,
): Promise<AdminClickedLink[]> {
  const db = getDb();
  const allowedSlug = requestedSiteSlugOrDenied(user, siteSlug);
  if (allowedSlug === null) {
    return [];
  }

  const today = utcDateString();
  const since7 = addUtcDays(today, -6);
  const since30 = addUtcDays(today, -29);

  const rows = await db
    .select({
      id: trackedLinks.id,
      label: trackedLinks.label,
      placement: trackedLinks.placement,
      sourceType: trackedLinks.sourceType,
      sourcePath: trackedLinks.sourcePath,
      targetType: trackedLinks.targetType,
      targetId: trackedLinks.targetId,
      targetUrl: trackedLinks.targetUrl,
      totalClicks: trackedLinks.totalClicks,
      siteSlug: sites.slug,
      siteTitle: sites.title,
      clicks7d: sql<number>`coalesce(sum(case when ${dailyLinkClicks.date} >= ${since7} then ${dailyLinkClicks.clicks} else 0 end), 0)`,
      clicks30d: sql<number>`coalesce(sum(case when ${dailyLinkClicks.date} >= ${since30} then ${dailyLinkClicks.clicks} else 0 end), 0)`,
    })
    .from(trackedLinks)
    .innerJoin(sites, eq(trackedLinks.siteId, sites.id))
    .leftJoin(dailyLinkClicks, eq(dailyLinkClicks.linkId, trackedLinks.id))
    .where(
      and(
        allowedSlug ? eq(sites.slug, allowedSlug) : undefined,
        siteAccessCondition(user),
      ),
    )
    .groupBy(
      trackedLinks.id,
      sites.id,
      sites.slug,
      sites.title,
    )
    .orderBy(desc(trackedLinks.totalClicks))
    .limit(limit);

  return rows.map((row) => ({
    ...row,
    clicks7d: Number(row.clicks7d),
    clicks30d: Number(row.clicks30d),
  }));
}

export function formatClickedLinkLabel(link: AdminClickedLink): string {
  const label = link.label?.trim();
  if (label) {
    return `${label} / ${link.placement}`;
  }
  return `${link.placement} → ${link.targetType}`;
}
