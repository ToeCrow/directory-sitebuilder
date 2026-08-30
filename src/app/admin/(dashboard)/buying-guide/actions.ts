"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { adminGuard, adminSiteGuard } from "@/lib/admin/session";
import { buyingGuideTitleSchema } from "@/lib/admin/site-schema";
import { upsertSiteSection } from "@/lib/admin/sections";
import { getNextBuyingGuideSortOrder } from "@/lib/admin/buying-guide";
import { revalidateSitePaths } from "@/lib/admin/revalidate";
import { getAdminSiteSlug } from "@/lib/admin/sites";
import type { ActionResult } from "@/lib/admin/types";
import { getDb } from "@/lib/db";
import { buyingGuideSections, sites } from "@/lib/db/schema";

async function revalidateForSite(siteId: string) {
  const siteSlug = await getAdminSiteSlug(siteId);
  if (siteSlug) {
    revalidateSitePaths(siteSlug);
  }
}

export async function updateBuyingGuideTitleAction(
  siteId: string,
  raw: unknown,
): Promise<ActionResult> {
  const guard = await adminSiteGuard(siteId);
  if (!guard.ok) {
    return guard;
  }

  const parsed = buyingGuideTitleSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const db = getDb();
  const [existingSite] = await db
    .select({ id: sites.id })
    .from(sites)
    .where(eq(sites.id, siteId))
    .limit(1);
  if (!existingSite) {
    return { ok: false, error: "Site not found" };
  }

  await upsertSiteSection(db, siteId, "buying-guide", {
    title: parsed.data.title,
  });

  await revalidateForSite(siteId);
  return { ok: true };
}

const buyingGuideSectionSchema = z.object({
  title: z.string().trim().min(1).max(300),
  content: z.string().trim().min(1).max(8000),
  sortOrder: z.number().int().min(1),
});

export async function addBuyingGuideSectionAction(
  siteId: string,
  raw: unknown,
): Promise<ActionResult> {
  const guard = await adminSiteGuard(siteId);
  if (!guard.ok) {
    return guard;
  }

  const parsed = buyingGuideSectionSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const db = getDb();
  const data = parsed.data;
  const sortOrder =
    data.sortOrder || (await getNextBuyingGuideSortOrder(siteId));

  await db.insert(buyingGuideSections).values({
    siteId,
    title: data.title,
    content: data.content,
    sortOrder,
  });

  await revalidateForSite(siteId);
  return { ok: true };
}

export async function updateBuyingGuideSectionAction(
  sectionId: string,
  raw: unknown,
): Promise<ActionResult> {
  const auth = await adminGuard();
  if (!auth.ok) {
    return auth;
  }

  const parsed = buyingGuideSectionSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const db = getDb();
  const [existing] = await db
    .select({ siteId: buyingGuideSections.siteId })
    .from(buyingGuideSections)
    .where(eq(buyingGuideSections.id, sectionId))
    .limit(1);
  if (!existing) {
    return { ok: false, error: "Section not found" };
  }

  const access = await adminSiteGuard(existing.siteId);
  if (!access.ok) {
    return access;
  }

  const data = parsed.data;
  await db
    .update(buyingGuideSections)
    .set({
      title: data.title,
      content: data.content,
      sortOrder: data.sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(buyingGuideSections.id, sectionId));

  await revalidateForSite(existing.siteId);
  return { ok: true };
}

export async function deleteBuyingGuideSectionAction(
  sectionId: string,
): Promise<ActionResult> {
  const auth = await adminGuard();
  if (!auth.ok) {
    return auth;
  }

  const db = getDb();
  const [existing] = await db
    .select({ siteId: buyingGuideSections.siteId })
    .from(buyingGuideSections)
    .where(eq(buyingGuideSections.id, sectionId))
    .limit(1);
  if (!existing) {
    return { ok: false, error: "Section not found" };
  }

  const access = await adminSiteGuard(existing.siteId);
  if (!access.ok) {
    return access;
  }

  await db
    .delete(buyingGuideSections)
    .where(eq(buyingGuideSections.id, sectionId));

  await revalidateForSite(existing.siteId);
  return { ok: true };
}
