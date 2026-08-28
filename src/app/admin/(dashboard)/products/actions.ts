"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { assertAdminSession } from "@/lib/admin-auth";
import {
  buildProductCreateSchema,
  buildProductUpdateSchema,
  linesToArray,
} from "@/lib/admin/product-schema";
import {
  countTopPicksForProduct,
  getAdminProductById,
} from "@/lib/admin/products";
import { getAdminSiteById } from "@/lib/admin/sites";
import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";

export type ActionResult =
  | { ok: true; productId?: string }
  | { ok: false; error: string };

function revalidateForProduct(
  siteSlug: string,
  productSlug: string,
  productId: string,
) {
  revalidatePath(`/${siteSlug}`);
  revalidatePath(`/${siteSlug}/products/${productSlug}`);
  revalidatePath(`/${siteSlug}/affiliate`);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/admin/products/new");
}

export async function createProductAction(
  raw: unknown,
): Promise<ActionResult> {
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const siteId =
    typeof raw === "object" &&
    raw !== null &&
    "siteId" in raw &&
    typeof (raw as { siteId: unknown }).siteId === "string"
      ? (raw as { siteId: string }).siteId
      : null;

  if (!siteId) {
    return { ok: false, error: "Site is required" };
  }

  const site = await getAdminSiteById(siteId);
  if (!site) {
    return { ok: false, error: "Site not found" };
  }

  const parsed = buildProductCreateSchema().safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const data = parsed.data;
  const db = getDb();
  const publishedAt = data.status === "published" ? new Date() : null;

  try {
    const [inserted] = await db
      .insert(products)
      .values({
        siteId: data.siteId,
        name: data.name,
        slug: data.slug,
        shortDescription: data.shortDescription,
        bestFor: data.bestFor,
        priceFrom: data.priceFrom,
        features: linesToArray(data.featuresText),
        pros: linesToArray(data.prosText),
        cons: linesToArray(data.consText),
        affiliateUrl: data.affiliateUrl,
        hasAffiliatePartnership: data.hasAffiliatePartnership,
        badge: data.badge?.trim() ? data.badge.trim() : null,
        comparisonRank: data.comparisonRank,
        directorySortOrder: data.directorySortOrder,
        comparison: {},
        status: data.status,
        publishedAt,
      })
      .returning({ id: products.id });

    if (!inserted) {
      return { ok: false, error: "Could not create product." };
    }

    revalidateForProduct(site.site.slug, data.slug, inserted.id);
    return { ok: true, productId: inserted.id };
  } catch (error) {
    const message =
      error instanceof Error && /unique|duplicate/i.test(error.message)
        ? "A product with this slug already exists for the site."
        : "Could not create product.";
    return { ok: false, error: message };
  }
}

export async function updateProductAction(
  productId: string,
  raw: unknown,
): Promise<ActionResult> {
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const existing = await getAdminProductById(productId);
  if (!existing) {
    return { ok: false, error: "Product not found" };
  }

  const parsed = buildProductUpdateSchema().safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const data = parsed.data;

  if (data.status === "draft" && existing.status === "published") {
    const topPickCount = await countTopPicksForProduct(productId);
    if (topPickCount > 0) {
      return {
        ok: false,
        error:
          "This product is a top pick. Remove it from top picks before unpublishing.",
      };
    }
  }

  const db = getDb();
  const previousSlug = existing.slug;
  const publishedAt =
    data.status === "published"
      ? (existing.publishedAt ?? new Date())
      : null;

  try {
    await db
      .update(products)
      .set({
        name: data.name,
        slug: data.slug,
        shortDescription: data.shortDescription,
        bestFor: data.bestFor,
        priceFrom: data.priceFrom,
        features: linesToArray(data.featuresText),
        pros: linesToArray(data.prosText),
        cons: linesToArray(data.consText),
        affiliateUrl: data.affiliateUrl,
        hasAffiliatePartnership: data.hasAffiliatePartnership,
        badge: data.badge?.trim() ? data.badge.trim() : null,
        comparisonRank: data.comparisonRank,
        directorySortOrder: data.directorySortOrder,
        status: data.status,
        publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));
  } catch (error) {
    const message =
      error instanceof Error && /unique|duplicate/i.test(error.message)
        ? "A product with this slug already exists for the site."
        : "Could not save product.";
    return { ok: false, error: message };
  }

  revalidateForProduct(existing.siteSlug, data.slug, productId);
  if (previousSlug !== data.slug) {
    revalidatePath(`/${existing.siteSlug}/products/${previousSlug}`);
  }

  return { ok: true };
}

export async function setProductAffiliateAction(
  productId: string,
  hasAffiliatePartnership: boolean,
): Promise<ActionResult> {
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const existing = await getAdminProductById(productId);
  if (!existing) {
    return { ok: false, error: "Product not found" };
  }

  const db = getDb();
  await db
    .update(products)
    .set({
      hasAffiliatePartnership,
      updatedAt: new Date(),
    })
    .where(eq(products.id, productId));

  revalidateForProduct(existing.siteSlug, existing.slug, productId);
  return { ok: true };
}

export async function setProductStatusAction(
  productId: string,
  status: "draft" | "published",
): Promise<ActionResult> {
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const existing = await getAdminProductById(productId);
  if (!existing) {
    return { ok: false, error: "Product not found" };
  }

  if (status === "draft") {
    const topPickCount = await countTopPicksForProduct(productId);
    if (topPickCount > 0) {
      return {
        ok: false,
        error:
          "This product is a top pick. Remove it from top picks before unpublishing.",
      };
    }
  }

  const db = getDb();
  await db
    .update(products)
    .set({
      status,
      publishedAt:
        status === "published" ? (existing.publishedAt ?? new Date()) : null,
      updatedAt: new Date(),
    })
    .where(eq(products.id, productId));

  revalidateForProduct(existing.siteSlug, existing.slug, productId);
  return { ok: true };
}

export async function deleteProductAction(
  productId: string,
): Promise<ActionResult> {
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const existing = await getAdminProductById(productId);
  if (!existing) {
    return { ok: false, error: "Product not found" };
  }

  const topPickCount = await countTopPicksForProduct(productId);
  if (topPickCount > 0) {
    return {
      ok: false,
      error:
        "This product is a top pick. Remove it from top picks before deleting.",
    };
  }

  const db = getDb();
  try {
    await db.delete(products).where(eq(products.id, productId));
  } catch {
    return { ok: false, error: "Could not delete product." };
  }

  revalidateForProduct(existing.siteSlug, existing.slug, productId);
  return { ok: true };
}
