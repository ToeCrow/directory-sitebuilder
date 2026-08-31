import { sql } from "drizzle-orm";
import {
  createLinkKey,
  normalizeTrackingContext,
  utcDateString,
  type LinkIdentityInput,
} from "@/lib/click-tracking";
import { withRuntimeDb } from "@/lib/db";
import { dailyLinkClicks, trackedLinks } from "@/lib/db/schema";

export type RecordClickInput = LinkIdentityInput & {
  label?: string | null;
};

export async function incrementClick(input: RecordClickInput): Promise<void> {
  const identity = normalizeTrackingContext(input);
  if (!identity.siteId || !identity.placement) {
    return;
  }

  const linkKey = createLinkKey(identity);
  const now = new Date();
  const today = utcDateString(now);
  const label = input.label?.trim() || null;

  // At-least-once: a connection drop after Postgres commits can retry and
  // increment the same click twice. Acceptable for aggregated analytics only.
  return withRuntimeDb(async (db) => {
    const [link] = await db
      .insert(trackedLinks)
      .values({
        linkKey,
        siteId: identity.siteId,
        sourceType: identity.sourceType,
        sourceId: identity.sourceId || null,
        sourcePath: identity.sourcePath || null,
        placement: identity.placement,
        targetType: identity.targetType,
        targetId: identity.targetId || null,
        targetUrl: identity.targetUrl || input.targetUrl || null,
        label,
        totalClicks: 1,
      })
      .onConflictDoUpdate({
        target: trackedLinks.linkKey,
        set: {
          totalClicks: sql`${trackedLinks.totalClicks} + 1`,
          updatedAt: now,
          label: sql`COALESCE(${sql.raw("excluded.label")}, ${trackedLinks.label})`,
          targetUrl: sql`COALESCE(${sql.raw("excluded.target_url")}, ${trackedLinks.targetUrl})`,
        },
      })
      .returning({ id: trackedLinks.id });

    if (!link) {
      return;
    }

    await db
      .insert(dailyLinkClicks)
      .values({
        linkId: link.id,
        date: today,
        clicks: 1,
      })
      .onConflictDoUpdate({
        target: [dailyLinkClicks.linkId, dailyLinkClicks.date],
        set: {
          clicks: sql`${dailyLinkClicks.clicks} + 1`,
          updatedAt: now,
        },
      });
  });
}
