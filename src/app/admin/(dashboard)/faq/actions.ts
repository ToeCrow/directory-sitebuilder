"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { adminGuard, adminSiteGuard } from "@/lib/admin/session";
import { getNextFaqSortOrder } from "@/lib/admin/faq";
import { revalidateSitePaths } from "@/lib/admin/revalidate";
import { getAdminSiteSlug } from "@/lib/admin/sites";
import type { ActionResult } from "@/lib/admin/types";
import { getDb } from "@/lib/db";
import { faqs } from "@/lib/db/schema";

async function revalidateForSite(siteId: string) {
  const siteSlug = await getAdminSiteSlug(siteId);
  if (siteSlug) {
    revalidateSitePaths(siteSlug);
  }
}

const faqSchema = z.object({
  question: z.string().trim().min(1).max(500),
  answer: z.string().trim().min(1).max(4000),
  sortOrder: z.number().int().min(1),
});

export async function addFaqAction(
  siteId: string,
  raw: unknown,
): Promise<ActionResult> {
  const guard = await adminSiteGuard(siteId);
  if (!guard.ok) {
    return guard;
  }

  const parsed = faqSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const db = getDb();
  const data = parsed.data;
  const sortOrder = data.sortOrder || (await getNextFaqSortOrder(siteId));

  await db.insert(faqs).values({
    siteId,
    question: data.question,
    answer: data.answer,
    sortOrder,
  });

  await revalidateForSite(siteId);
  return { ok: true };
}

export async function updateFaqAction(
  faqId: string,
  raw: unknown,
): Promise<ActionResult> {
  const auth = await adminGuard();
  if (!auth.ok) {
    return auth;
  }

  const parsed = faqSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const db = getDb();
  const [existing] = await db
    .select({ siteId: faqs.siteId })
    .from(faqs)
    .where(eq(faqs.id, faqId))
    .limit(1);
  if (!existing) {
    return { ok: false, error: "FAQ not found" };
  }

  const guard = await adminSiteGuard(existing.siteId);
  if (!guard.ok) {
    return guard;
  }

  const data = parsed.data;
  await db
    .update(faqs)
    .set({
      question: data.question,
      answer: data.answer,
      sortOrder: data.sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(faqs.id, faqId));

  await revalidateForSite(existing.siteId);
  return { ok: true };
}

export async function deleteFaqAction(faqId: string): Promise<ActionResult> {
  const auth = await adminGuard();
  if (!auth.ok) {
    return auth;
  }

  const db = getDb();
  const [existing] = await db
    .select({ siteId: faqs.siteId })
    .from(faqs)
    .where(eq(faqs.id, faqId))
    .limit(1);
  if (!existing) {
    return { ok: false, error: "FAQ not found" };
  }

  const guard = await adminSiteGuard(existing.siteId);
  if (!guard.ok) {
    return guard;
  }

  await db.delete(faqs).where(eq(faqs.id, faqId));

  await revalidateForSite(existing.siteId);
  return { ok: true };
}
