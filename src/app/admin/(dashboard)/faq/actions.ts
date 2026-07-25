"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { assertAdminSession } from "@/lib/admin-auth";
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
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized" };
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
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized" };
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
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized" };
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

  await db.delete(faqs).where(eq(faqs.id, faqId));

  await revalidateForSite(existing.siteId);
  return { ok: true };
}
