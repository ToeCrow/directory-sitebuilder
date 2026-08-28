"use server";

import { eq } from "drizzle-orm";
import { assertAdminSession } from "@/lib/admin-auth";
import { revalidateSitePaths } from "@/lib/admin/revalidate";
import { upsertSiteSection } from "@/lib/admin/sections";
import {
  comparisonSectionSchema,
  siteHeroSchema,
  siteSectionsSchema,
  siteSettingsSchema,
} from "@/lib/admin/site-schema";
import { getAdminSiteSlug } from "@/lib/admin/sites";
import type { ActionResult } from "@/lib/admin/types";
import { getDb } from "@/lib/db";
import { siteHeroes, sites } from "@/lib/db/schema";

export async function updateSiteSettingsAction(
  siteId: string,
  raw: unknown,
): Promise<ActionResult> {
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = siteSettingsSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const db = getDb();
  const [existing] = await db
    .select({ status: sites.status, publishedAt: sites.publishedAt, features: sites.features })
    .from(sites)
    .where(eq(sites.id, siteId))
    .limit(1);

  if (!existing) {
    return { ok: false, error: "Site not found" };
  }

  const data = parsed.data;
  const publishedAt =
    data.status === "published"
      ? (existing.publishedAt ?? new Date())
      : null;

  try {
    await db
      .update(sites)
      .set({
        title: data.title,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        niche: data.niche,
        siteUrl: data.siteUrl,
        headerBrandImage: data.headerBrandImage,
        affiliateDisclosure: data.affiliateDisclosure,
        newsletterTitle: data.newsletterTitle,
        newsletterDescription: data.newsletterDescription,
        newsletterButtonText: data.newsletterButtonText,
        newsletterSuccessMessage: data.newsletterSuccessMessage,
        adsPrimary: data.adsPrimary,
        adsSecondary: data.adsSecondary,
        status: data.status,
        publishedAt,
        features: {
          ...existing.features,
          researchScorePage: data.researchScorePage,
        },
        updatedAt: new Date(),
      })
      .where(eq(sites.id, siteId));
  } catch (error) {
    const message =
      error instanceof Error && /unique|duplicate/i.test(error.message)
        ? "Another site already uses this URL."
        : "Could not save site settings.";
    return { ok: false, error: message };
  }

  const siteSlug = await getAdminSiteSlug(siteId);
  if (siteSlug) {
    revalidateSitePaths(siteSlug);
  }
  return { ok: true };
}

export async function updateSiteHeroAction(
  siteId: string,
  raw: unknown,
): Promise<ActionResult> {
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = siteHeroSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const data = parsed.data;
  const db = getDb();

  const [existingSite] = await db
    .select({ id: sites.id })
    .from(sites)
    .where(eq(sites.id, siteId))
    .limit(1);

  if (!existingSite) {
    return { ok: false, error: "Site not found" };
  }

  try {
    await db
      .insert(siteHeroes)
      .values({
        siteId,
        eyebrow: data.eyebrow,
        headline: data.headline,
        subheadline: data.subheadline,
        primaryCta: data.primaryCta,
        secondaryCta: data.secondaryCta,
        secondaryCtaHref: data.secondaryCtaHref,
        imageSrc: data.imageSrc,
        imageSrcMobile: data.imageSrcMobile,
        imageAlt: data.imageAlt,
      })
      .onConflictDoUpdate({
        target: siteHeroes.siteId,
        set: {
          eyebrow: data.eyebrow,
          headline: data.headline,
          subheadline: data.subheadline,
          primaryCta: data.primaryCta,
          secondaryCta: data.secondaryCta,
          secondaryCtaHref: data.secondaryCtaHref,
          imageSrc: data.imageSrc,
          imageSrcMobile: data.imageSrcMobile,
          imageAlt: data.imageAlt,
          updatedAt: new Date(),
        },
      });
  } catch {
    return { ok: false, error: "Could not save hero content." };
  }

  const siteSlug = await getAdminSiteSlug(siteId);
  if (siteSlug) {
    revalidateSitePaths(siteSlug);
  }
  return { ok: true };
}

export async function updateSiteSectionsAction(
  siteId: string,
  raw: unknown,
): Promise<ActionResult> {
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = siteSectionsSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const data = parsed.data;
  const db = getDb();

  const [existingSite] = await db
    .select({ id: sites.id })
    .from(sites)
    .where(eq(sites.id, siteId))
    .limit(1);

  if (!existingSite) {
    return { ok: false, error: "Site not found" };
  }

  const comparisonParsed = comparisonSectionSchema.safeParse({
    title: data.comparisonTitle,
    description: data.comparisonDescription,
    rowHeaderLabel: data.comparisonRowHeaderLabel,
  });
  if (!comparisonParsed.success) {
    return {
      ok: false,
      error: comparisonParsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  try {
    await db.transaction(async (tx) => {
      await upsertSiteSection(tx, siteId, "top-picks", {
        title: data.topPicksTitle,
        description: data.topPicksDescription,
      });
      await upsertSiteSection(tx, siteId, "product-directory", {
        title: data.productDirectoryTitle,
        description: data.productDirectoryDescription,
      });
      await upsertSiteSection(tx, siteId, "comparison-table", {
        title: data.comparisonTitle,
        description: data.comparisonDescription,
        config: data.comparisonRowHeaderLabel
          ? { rowHeaderLabel: data.comparisonRowHeaderLabel }
          : null,
      });
      await upsertSiteSection(tx, siteId, "buying-guide", {
        title: data.buyingGuideTitle,
      });
      await upsertSiteSection(tx, siteId, "footer", {
        title: data.footerTagline,
      });
    });
  } catch {
    return { ok: false, error: "Could not save section titles." };
  }

  const siteSlug = await getAdminSiteSlug(siteId);
  if (siteSlug) {
    revalidateSitePaths(siteSlug);
  }
  return { ok: true };
}
