import type { DbOrTx } from "@/lib/db";
import { siteSections } from "@/lib/db/schema";
import type { SiteSectionKey } from "./sites";

export type UpsertSectionInput = {
  title?: string | null;
  description?: string | null;
  config?: Record<string, unknown> | null;
};

/**
 * Insert or update a single `site_sections` row for a given site + key.
 * Accepts a database client (or transaction) so callers can batch multiple
 * section writes atomically.
 */
export async function upsertSiteSection(
  db: DbOrTx,
  siteId: string,
  sectionKey: SiteSectionKey,
  data: UpsertSectionInput,
): Promise<void> {
  await db
    .insert(siteSections)
    .values({
      siteId,
      sectionKey,
      title: data.title ?? null,
      description: data.description ?? null,
      config: data.config ?? null,
    })
    .onConflictDoUpdate({
      target: [siteSections.siteId, siteSections.sectionKey],
      set: {
        title: data.title ?? null,
        description: data.description ?? null,
        config: data.config ?? null,
        updatedAt: new Date(),
      },
    });
}
