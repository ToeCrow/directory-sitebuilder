"use server";

import { eq } from "drizzle-orm";
import { adminGuard, adminSiteGuard } from "@/lib/admin/session";
import { comparisonSectionSchema } from "@/lib/admin/site-schema";
import { upsertSiteSection } from "@/lib/admin/sections";
import { getAdminSiteSlug } from "@/lib/admin/sites";
import { getNextComparisonRowSortOrder } from "@/lib/admin/comparison";
import { revalidateSitePaths } from "@/lib/admin/revalidate";
import type { ActionResult } from "@/lib/admin/types";
import { getDb } from "@/lib/db";
import { comparisonRows, sites } from "@/lib/db/schema";
import { z } from "zod";

async function revalidateForSite(siteId: string) {
  const siteSlug = await getAdminSiteSlug(siteId);
  if (siteSlug) {
    revalidateSitePaths(siteSlug);
  }
}

export async function updateComparisonSectionAction(
  siteId: string,
  raw: unknown,
): Promise<ActionResult> {
  const guard = await adminSiteGuard(siteId);
  if (!guard.ok) {
    return guard;
  }

  const parsed = comparisonSectionSchema.safeParse(raw);
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

  const data = parsed.data;
  await upsertSiteSection(db, siteId, "comparison-table", {
    title: data.title,
    description: data.description,
    config: data.rowHeaderLabel ? { rowHeaderLabel: data.rowHeaderLabel } : null,
  });

  await revalidateForSite(siteId);
  return { ok: true };
}

const comparisonRowSchema = z.object({
  key: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Key must be lowercase kebab-case"),
  label: z.string().trim().min(1).max(200),
  type: z.enum(["text", "boolean"]),
  sortOrder: z.number().int().min(1),
});

export async function addComparisonRowAction(
  siteId: string,
  raw: unknown,
): Promise<ActionResult> {
  const guard = await adminSiteGuard(siteId);
  if (!guard.ok) {
    return guard;
  }

  const parsed = comparisonRowSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const db = getDb();
  const data = parsed.data;
  const sortOrder = data.sortOrder || (await getNextComparisonRowSortOrder(siteId));

  try {
    await db.insert(comparisonRows).values({
      siteId,
      key: data.key,
      label: data.label,
      type: data.type,
      sortOrder,
    });
  } catch (error) {
    const message =
      error instanceof Error && /unique|duplicate/i.test(error.message)
        ? "A row with this key already exists for the site."
        : "Could not add comparison row.";
    return { ok: false, error: message };
  }

  await revalidateForSite(siteId);
  return { ok: true };
}

export async function updateComparisonRowAction(
  rowId: string,
  raw: unknown,
): Promise<ActionResult> {
  const auth = await adminGuard();
  if (!auth.ok) {
    return auth;
  }

  const parsed = comparisonRowSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const db = getDb();
  const [existing] = await db
    .select({ siteId: comparisonRows.siteId })
    .from(comparisonRows)
    .where(eq(comparisonRows.id, rowId))
    .limit(1);
  if (!existing) {
    return { ok: false, error: "Row not found" };
  }

  const access = await adminSiteGuard(existing.siteId);
  if (!access.ok) {
    return access;
  }

  const data = parsed.data;
  try {
    await db
      .update(comparisonRows)
      .set({
        key: data.key,
        label: data.label,
        type: data.type,
        sortOrder: data.sortOrder,
        updatedAt: new Date(),
      })
      .where(eq(comparisonRows.id, rowId));
  } catch (error) {
    const message =
      error instanceof Error && /unique|duplicate/i.test(error.message)
        ? "A row with this key already exists for the site."
        : "Could not save comparison row.";
    return { ok: false, error: message };
  }

  await revalidateForSite(existing.siteId);
  return { ok: true };
}

export async function deleteComparisonRowAction(
  rowId: string,
): Promise<ActionResult> {
  const auth = await adminGuard();
  if (!auth.ok) {
    return auth;
  }

  const db = getDb();
  const [existing] = await db
    .select({ siteId: comparisonRows.siteId })
    .from(comparisonRows)
    .where(eq(comparisonRows.id, rowId))
    .limit(1);
  if (!existing) {
    return { ok: false, error: "Row not found" };
  }

  const access = await adminSiteGuard(existing.siteId);
  if (!access.ok) {
    return access;
  }

  await db.delete(comparisonRows).where(eq(comparisonRows.id, rowId));

  await revalidateForSite(existing.siteId);
  return { ok: true };
}
