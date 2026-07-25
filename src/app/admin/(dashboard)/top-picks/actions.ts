"use server";

import { eq } from "drizzle-orm";
import { assertAdminSession } from "@/lib/admin-auth";
import { revalidateSitePaths } from "@/lib/admin/revalidate";
import { getAdminSiteSlug } from "@/lib/admin/sites";
import { getNextTopPickSortOrder } from "@/lib/admin/top-picks";
import type { ActionResult } from "@/lib/admin/types";
import { getDb } from "@/lib/db";
import { products, siteTopPicks } from "@/lib/db/schema";

async function revalidateForSite(siteId: string) {
  const siteSlug = await getAdminSiteSlug(siteId);
  if (siteSlug) {
    revalidateSitePaths(siteSlug);
  }
}

export async function addTopPickAction(
  siteId: string,
  productId: string,
): Promise<ActionResult> {
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const db = getDb();
  const [product] = await db
    .select({ status: products.status, siteId: products.siteId })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (!product || product.siteId !== siteId) {
    return { ok: false, error: "Product not found" };
  }

  if (product.status !== "published") {
    return {
      ok: false,
      error: "Only published products can be added as top picks.",
    };
  }

  const sortOrder = await getNextTopPickSortOrder(siteId);

  try {
    await db.insert(siteTopPicks).values({
      siteId,
      productId,
      sortOrder,
    });
  } catch (error) {
    const message =
      error instanceof Error && /unique|duplicate/i.test(error.message)
        ? "This product is already a top pick."
        : "Could not add top pick.";
    return { ok: false, error: message };
  }

  await revalidateForSite(siteId);
  return { ok: true };
}

export async function updateTopPickAction(
  topPickId: string,
  data: { sortOrder: number; badgeOverride: string | null },
): Promise<ActionResult> {
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const db = getDb();
  const [existing] = await db
    .select({ siteId: siteTopPicks.siteId })
    .from(siteTopPicks)
    .where(eq(siteTopPicks.id, topPickId))
    .limit(1);

  if (!existing) {
    return { ok: false, error: "Top pick not found" };
  }

  await db
    .update(siteTopPicks)
    .set({
      sortOrder: data.sortOrder,
      badgeOverride: data.badgeOverride?.trim() ? data.badgeOverride.trim() : null,
      updatedAt: new Date(),
    })
    .where(eq(siteTopPicks.id, topPickId));

  await revalidateForSite(existing.siteId);
  return { ok: true };
}

export async function removeTopPickAction(
  topPickId: string,
): Promise<ActionResult> {
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const db = getDb();
  const [existing] = await db
    .select({ siteId: siteTopPicks.siteId })
    .from(siteTopPicks)
    .where(eq(siteTopPicks.id, topPickId))
    .limit(1);

  if (!existing) {
    return { ok: false, error: "Top pick not found" };
  }

  await db.delete(siteTopPicks).where(eq(siteTopPicks.id, topPickId));

  await revalidateForSite(existing.siteId);
  return { ok: true };
}
