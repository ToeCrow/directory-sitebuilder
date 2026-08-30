"use server";

import { eq } from "drizzle-orm";
import { assertAdminSession } from "@/lib/admin-auth";
import {
  articleCreateSchema,
  articleProductSectionCreateSchema,
  articleProductSectionSchema,
  articleStatusSchema,
  articleUpdateSchema,
} from "@/lib/admin/article-schema";
import {
  getAdminArticleById,
  getNextArticleProductSectionSortOrder,
} from "@/lib/admin/articles";
import { linesToArray } from "@/lib/admin/lines";
import { revalidateForArticle } from "@/lib/admin/revalidate";
import { getAdminSiteById } from "@/lib/admin/sites";
import type { ActionResult } from "@/lib/admin/types";
import { emptyTiptapDoc, isTiptapDoc } from "@/lib/article-content";
import { getDb } from "@/lib/db";
import { articleProductSections, articles } from "@/lib/db/schema";

export type CreateArticleResult =
  | { ok: true; articleId: string }
  | { ok: false; error: string };

function parseDate(value: string | null): Date | null {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function createArticleAction(
  raw: unknown,
): Promise<CreateArticleResult> {
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = articleCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const data = parsed.data;
  const site = await getAdminSiteById(data.siteId);
  if (!site) {
    return { ok: false, error: "Site not found" };
  }

  const db = getDb();
  const isRoundup = data.kind === "product-roundup";

  try {
    const [inserted] = await db
      .insert(articles)
      .values({
        siteId: data.siteId,
        title: data.title,
        slug: data.slug,
        excerpt: null,
        intro: [],
        researchNoteTitle: isRoundup ? "How we chose" : "",
        researchNoteContent: isRoundup
          ? "We compared the products on this list against the criteria in this guide."
          : "",
        content: {
          kind: data.kind,
          relatedArticleIds: [],
          ...(isRoundup ? {} : { body: emptyTiptapDoc() }),
        },
        status: "draft",
        publishedAt: null,
      })
      .returning({ id: articles.id });

    if (!inserted) {
      return { ok: false, error: "Could not create article." };
    }

    revalidateForArticle(site.site.slug, data.slug, inserted.id);
    return { ok: true, articleId: inserted.id };
  } catch (error) {
    const message =
      error instanceof Error && /unique|duplicate/i.test(error.message)
        ? "An article with this slug already exists for the site."
        : "Could not create article.";
    return { ok: false, error: message };
  }
}

export async function updateArticleAction(
  articleId: string,
  raw: unknown,
): Promise<ActionResult> {
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const existing = await getAdminArticleById(articleId);
  if (!existing) {
    return { ok: false, error: "Article not found" };
  }

  const parsed = articleUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const data = parsed.data;
  if (data.body !== undefined && !isTiptapDoc(data.body)) {
    return { ok: false, error: "Article body is not valid editor JSON." };
  }

  const publishedAt =
    data.status === "published"
      ? (parseDate(data.publishedAt) ?? existing.publishedAt ?? new Date())
      : null;
  const updatedAtContent = parseDate(data.updatedAtContent);

  const db = getDb();
  const previousSlug = existing.slug;

  try {
    await db
      .update(articles)
      .set({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        intro: linesToArray(data.introText),
        researchNoteTitle: data.researchNoteTitle,
        researchNoteContent: data.researchNoteContent,
        author: data.author,
        ogImageSrc: data.ogImageSrc,
        ogImageAlt: data.ogImageAlt,
        content: {
          ...existing.content,
          kind: existing.kind,
          relatedArticleIds: data.relatedArticleIds,
          ...(data.body !== undefined ? { body: data.body } : {}),
        },
        status: data.status,
        publishedAt,
        updatedAtContent,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, articleId));
  } catch (error) {
    const message =
      error instanceof Error && /unique|duplicate/i.test(error.message)
        ? "An article with this slug already exists for the site."
        : "Could not save article.";
    return { ok: false, error: message };
  }

  revalidateForArticle(existing.siteSlug, data.slug, articleId);
  if (previousSlug !== data.slug) {
    revalidateForArticle(existing.siteSlug, previousSlug, articleId);
  }

  return { ok: true };
}

export async function setArticleStatusAction(
  articleId: string,
  status: "draft" | "published",
): Promise<ActionResult> {
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const parsedStatus = articleStatusSchema.safeParse(status);
  if (!parsedStatus.success) {
    return { ok: false, error: "Invalid status" };
  }

  const existing = await getAdminArticleById(articleId);
  if (!existing) {
    return { ok: false, error: "Article not found" };
  }

  const db = getDb();
  await db
    .update(articles)
    .set({
      status: parsedStatus.data,
      publishedAt:
        parsedStatus.data === "published"
          ? (existing.publishedAt ?? new Date())
          : null,
      updatedAt: new Date(),
    })
    .where(eq(articles.id, articleId));

  revalidateForArticle(existing.siteSlug, existing.slug, articleId);
  return { ok: true };
}

export async function deleteArticleAction(
  articleId: string,
): Promise<ActionResult> {
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const existing = await getAdminArticleById(articleId);
  if (!existing) {
    return { ok: false, error: "Article not found" };
  }

  const db = getDb();
  try {
    await db.delete(articles).where(eq(articles.id, articleId));
  } catch {
    return { ok: false, error: "Could not delete article." };
  }

  revalidateForArticle(existing.siteSlug, existing.slug, articleId);
  return { ok: true };
}

export async function addArticleProductSectionAction(
  articleId: string,
  raw: unknown,
): Promise<ActionResult> {
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const existing = await getAdminArticleById(articleId);
  if (!existing) {
    return { ok: false, error: "Article not found" };
  }

  const parsed = articleProductSectionCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const data = parsed.data;
  const sortOrder =
    data.sortOrder || (await getNextArticleProductSectionSortOrder(articleId));

  const db = getDb();
  await db.insert(articleProductSections).values({
    articleId,
    heading: data.heading,
    intro: data.intro,
    imageSrc: data.imageSrc,
    imageAlt: data.imageAlt,
    whatItIs: data.whatItIs,
    whyItEarnsASpot: linesToArray(data.whyItEarnsASpotText),
    whereItFallsShort: linesToArray(data.whereItFallsShortText),
    bestFor: data.bestFor,
    skipIf: data.skipIf,
    productId: data.productId,
    sortOrder,
  });

  revalidateForArticle(existing.siteSlug, existing.slug, articleId);
  return { ok: true };
}

export async function updateArticleProductSectionAction(
  sectionId: string,
  raw: unknown,
): Promise<ActionResult> {
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const db = getDb();
  const [existingSection] = await db
    .select({ articleId: articleProductSections.articleId })
    .from(articleProductSections)
    .where(eq(articleProductSections.id, sectionId))
    .limit(1);
  if (!existingSection) {
    return { ok: false, error: "Section not found" };
  }

  const existing = await getAdminArticleById(existingSection.articleId);
  if (!existing) {
    return { ok: false, error: "Article not found" };
  }

  const parsed = articleProductSectionSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const data = parsed.data;
  await db
    .update(articleProductSections)
    .set({
      heading: data.heading,
      intro: data.intro,
      imageSrc: data.imageSrc,
      imageAlt: data.imageAlt,
      whatItIs: data.whatItIs,
      whyItEarnsASpot: linesToArray(data.whyItEarnsASpotText),
      whereItFallsShort: linesToArray(data.whereItFallsShortText),
      bestFor: data.bestFor,
      skipIf: data.skipIf,
      productId: data.productId ?? null,
      sortOrder: data.sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(articleProductSections.id, sectionId));

  revalidateForArticle(existing.siteSlug, existing.slug, existing.id);
  return { ok: true };
}

export async function deleteArticleProductSectionAction(
  sectionId: string,
): Promise<ActionResult> {
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const db = getDb();
  const [existingSection] = await db
    .select({ articleId: articleProductSections.articleId })
    .from(articleProductSections)
    .where(eq(articleProductSections.id, sectionId))
    .limit(1);
  if (!existingSection) {
    return { ok: false, error: "Section not found" };
  }

  const existing = await getAdminArticleById(existingSection.articleId);

  await db
    .delete(articleProductSections)
    .where(eq(articleProductSections.id, sectionId));

  if (existing) {
    revalidateForArticle(existing.siteSlug, existing.slug, existing.id);
  }
  return { ok: true };
}
