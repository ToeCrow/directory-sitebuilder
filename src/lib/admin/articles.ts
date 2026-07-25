import { asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { articleProductSections, articles, sites } from "@/lib/db/schema";

export type AdminArticleListItem = {
  id: string;
  siteId: string;
  siteSlug: string;
  siteTitle: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  publishedAt: Date | null;
};

export async function listAdminArticles(
  siteSlug?: string,
): Promise<AdminArticleListItem[]> {
  const db = getDb();
  const rows = await db
    .select({
      id: articles.id,
      siteId: articles.siteId,
      siteSlug: sites.slug,
      siteTitle: sites.title,
      title: articles.title,
      slug: articles.slug,
      status: articles.status,
      publishedAt: articles.publishedAt,
    })
    .from(articles)
    .innerJoin(sites, eq(articles.siteId, sites.id))
    .where(siteSlug ? eq(sites.slug, siteSlug) : undefined)
    .orderBy(asc(sites.slug), asc(articles.title));

  return rows;
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
  researchNoteTitle: string;
  researchNoteContent: string;
  author: string | null;
  ogImageSrc: string | null;
  ogImageAlt: string | null;
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

  return {
    id: row.article.id,
    siteId: row.article.siteId,
    siteSlug: row.siteSlug,
    siteTitle: row.siteTitle,
    title: row.article.title,
    slug: row.article.slug,
    excerpt: row.article.excerpt,
    intro: row.article.intro,
    researchNoteTitle: row.article.researchNoteTitle,
    researchNoteContent: row.article.researchNoteContent,
    author: row.article.author,
    ogImageSrc: row.article.ogImageSrc,
    ogImageAlt: row.article.ogImageAlt,
    status: row.article.status,
    publishedAt: row.article.publishedAt,
    updatedAtContent: row.article.updatedAtContent,
    productSections: sectionRows,
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
