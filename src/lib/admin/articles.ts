import { and, asc, eq } from "drizzle-orm";
import type { AdminUser } from "@/lib/admin-access";
import { requestedSiteSlugOrDenied } from "@/lib/admin-access";
import { isTiptapDoc, type TiptapDoc } from "@/lib/article-content";
import { siteAccessCondition } from "@/lib/admin/sites";
import { getDb } from "@/lib/db";
import { articleProductSections, articles, sites } from "@/lib/db/schema";

export type AdminArticleKind = "editorial" | "product-roundup";

export type AdminArticleListItem = {
  id: string;
  siteId: string;
  siteSlug: string;
  siteTitle: string;
  title: string;
  slug: string;
  kind: AdminArticleKind;
  status: "draft" | "published";
  publishedAt: Date | null;
};

function kindFromContent(content: Record<string, unknown> | null): AdminArticleKind {
  return content?.kind === "editorial" ? "editorial" : "product-roundup";
}

export async function listAdminArticles(
  user: AdminUser,
  siteSlug?: string,
): Promise<AdminArticleListItem[]> {
  const db = getDb();
  const allowedSlug = requestedSiteSlugOrDenied(user, siteSlug);
  if (allowedSlug === null) {
    return [];
  }

  const rows = await db
    .select({
      id: articles.id,
      siteId: articles.siteId,
      siteSlug: sites.slug,
      siteTitle: sites.title,
      title: articles.title,
      slug: articles.slug,
      content: articles.content,
      status: articles.status,
      publishedAt: articles.publishedAt,
    })
    .from(articles)
    .innerJoin(sites, eq(articles.siteId, sites.id))
    .where(
      and(
        allowedSlug ? eq(sites.slug, allowedSlug) : undefined,
        siteAccessCondition(user),
      ),
    )
    .orderBy(asc(sites.slug), asc(articles.title));

  return rows.map((row) => ({
    id: row.id,
    siteId: row.siteId,
    siteSlug: row.siteSlug,
    siteTitle: row.siteTitle,
    title: row.title,
    slug: row.slug,
    kind: kindFromContent(row.content),
    status: row.status,
    publishedAt: row.publishedAt,
  }));
}

export type AdminArticlePickerItem = {
  id: string;
  title: string;
  slug: string;
};

export async function listAdminArticlePickerItems(
  siteId: string,
  excludeArticleId?: string,
): Promise<AdminArticlePickerItem[]> {
  const db = getDb();
  const rows = await db
    .select({
      id: articles.id,
      title: articles.title,
      slug: articles.slug,
    })
    .from(articles)
    .where(eq(articles.siteId, siteId))
    .orderBy(asc(articles.title));

  return excludeArticleId
    ? rows.filter((row) => row.id !== excludeArticleId)
    : rows;
}

export type AdminArticleProductSection = {
  id: string;
  heading: string;
  intro: string | null;
  imageSrc: string | null;
  imageAlt: string | null;
  whatItIs: string;
  whyItEarnsASpot: string[];
  whereItFallsShort: string[];
  bestFor: string;
  skipIf: string;
  productId: string | null;
  productSlug: string | null;
  sortOrder: number;
};

export type AdminArticleDetail = {
  id: string;
  siteId: string;
  siteSlug: string;
  siteTitle: string;
  title: string;
  slug: string;
  excerpt: string | null;
  intro: string[];
  kind: AdminArticleKind;
  researchNoteTitle: string;
  researchNoteContent: string;
  author: string | null;
  ogImageSrc: string | null;
  ogImageAlt: string | null;
  relatedArticleIds: string[];
  body: TiptapDoc | null;
  content: Record<string, unknown>;
  status: "draft" | "published";
  publishedAt: Date | null;
  updatedAtContent: Date | null;
  productSections: AdminArticleProductSection[];
};

export async function getAdminArticleById(
  id: string,
): Promise<AdminArticleDetail | null> {
  const db = getDb();
  const [row] = await db
    .select({
      article: articles,
      siteSlug: sites.slug,
      siteTitle: sites.title,
    })
    .from(articles)
    .innerJoin(sites, eq(articles.siteId, sites.id))
    .where(eq(articles.id, id))
    .limit(1);

  if (!row) {
    return null;
  }

  const sectionRows = await db
    .select()
    .from(articleProductSections)
    .where(eq(articleProductSections.articleId, id))
    .orderBy(asc(articleProductSections.sortOrder));

  const content = (row.article.content ?? {}) as Record<string, unknown>;
  const relatedArticleIds = Array.isArray(content.relatedArticleIds)
    ? content.relatedArticleIds.filter(
        (value): value is string => typeof value === "string",
      )
    : [];

  return {
    id: row.article.id,
    siteId: row.article.siteId,
    siteSlug: row.siteSlug,
    siteTitle: row.siteTitle,
    title: row.article.title,
    slug: row.article.slug,
    excerpt: row.article.excerpt,
    intro: row.article.intro,
    kind: kindFromContent(content),
    researchNoteTitle: row.article.researchNoteTitle,
    researchNoteContent: row.article.researchNoteContent,
    author: row.article.author,
    ogImageSrc: row.article.ogImageSrc,
    ogImageAlt: row.article.ogImageAlt,
    relatedArticleIds,
    body: isTiptapDoc(content.body) ? content.body : null,
    content,
    status: row.article.status,
    publishedAt: row.article.publishedAt,
    updatedAtContent: row.article.updatedAtContent,
    productSections: sectionRows.map((section) => ({
      id: section.id,
      heading: section.heading,
      intro: section.intro,
      imageSrc: section.imageSrc,
      imageAlt: section.imageAlt,
      whatItIs: section.whatItIs,
      whyItEarnsASpot: section.whyItEarnsASpot,
      whereItFallsShort: section.whereItFallsShort,
      bestFor: section.bestFor,
      skipIf: section.skipIf,
      productId: section.productId,
      productSlug: section.productSlug,
      sortOrder: section.sortOrder,
    })),
  };
}

export async function getNextArticleProductSectionSortOrder(
  articleId: string,
): Promise<number> {
  const db = getDb();
  const rows = await db
    .select({ sortOrder: articleProductSections.sortOrder })
    .from(articleProductSections)
    .where(eq(articleProductSections.articleId, articleId));
  return rows.reduce((max, row) => Math.max(max, row.sortOrder), 0) + 1;
}
