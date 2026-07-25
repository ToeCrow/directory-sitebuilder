"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { assertAdminSession } from "@/lib/admin-auth";
import { footerTaglineSchema } from "@/lib/admin/site-schema";
import { upsertSiteSection } from "@/lib/admin/sections";
import { getNextFooterLinkSortOrder } from "@/lib/admin/footer";
import { revalidateSitePaths } from "@/lib/admin/revalidate";
import { getAdminSiteSlug } from "@/lib/admin/sites";
import type { ActionResult } from "@/lib/admin/types";
import { getDb } from "@/lib/db";
import { footerLinks, sites } from "@/lib/db/schema";

async function revalidateForSite(siteId: string) {
  const siteSlug = await getAdminSiteSlug(siteId);
  if (siteSlug) {
    revalidateSitePaths(siteSlug);
  }
}

export async function updateFooterTaglineAction(
  siteId: string,
  raw: unknown,
): Promise<ActionResult> {
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = footerTaglineSchema.safeParse(raw);
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

  await upsertSiteSection(db, siteId, "footer", {
    title: parsed.data.tagline,
  });

  await revalidateForSite(siteId);
  return { ok: true };
}

const footerLinkSchema = z.object({
  label: z.string().trim().min(1).max(200),
  href: z.string().trim().min(1).max(500),
  sortOrder: z.number().int().min(1),
});

export async function addFooterLinkAction(
  siteId: string,
  raw: unknown,
): Promise<ActionResult> {
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = footerLinkSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const db = getDb();
  const data = parsed.data;
  const sortOrder =
    data.sortOrder || (await getNextFooterLinkSortOrder(siteId));

  await db.insert(footerLinks).values({
    siteId,
    label: data.label,
    href: data.href,
    sortOrder,
  });

  await revalidateForSite(siteId);
  return { ok: true };
}

export async function updateFooterLinkAction(
  linkId: string,
  raw: unknown,
): Promise<ActionResult> {
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = footerLinkSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const db = getDb();
  const [existing] = await db
    .select({ siteId: footerLinks.siteId })
    .from(footerLinks)
    .where(eq(footerLinks.id, linkId))
    .limit(1);
  if (!existing) {
    return { ok: false, error: "Link not found" };
  }

  const data = parsed.data;
  await db
    .update(footerLinks)
    .set({
      label: data.label,
      href: data.href,
      sortOrder: data.sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(footerLinks.id, linkId));

  await revalidateForSite(existing.siteId);
  return { ok: true };
}

export async function deleteFooterLinkAction(
  linkId: string,
): Promise<ActionResult> {
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const db = getDb();
  const [existing] = await db
    .select({ siteId: footerLinks.siteId })
    .from(footerLinks)
    .where(eq(footerLinks.id, linkId))
    .limit(1);
  if (!existing) {
    return { ok: false, error: "Link not found" };
  }

  await db.delete(footerLinks).where(eq(footerLinks.id, linkId));

  await revalidateForSite(existing.siteId);
  return { ok: true };
}
