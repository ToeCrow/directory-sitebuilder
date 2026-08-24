import type { Article } from "@/types/site";
import { getArticleBySlug, getArticles, type SiteSlug } from "@/lib/site";

const BOTTOM_RELATED_LIMIT = 4;

function uniqueExistingArticles(
  siteSlug: SiteSlug,
  slugs: string[],
  exclude: Set<string>,
): Article[] {
  const seen = new Set<string>();
  const articles: Article[] = [];

  for (const slug of slugs) {
    if (exclude.has(slug) || seen.has(slug)) continue;
    const article = getArticleBySlug(siteSlug, slug);
    if (!article) continue;
    seen.add(slug);
    articles.push(article);
  }

  return articles;
}

export function getInlineRelatedArticle(
  siteSlug: SiteSlug,
  article: Article,
): Article | undefined {
  if (!article.inlineRelatedSlug || article.inlineRelatedSlug === article.slug) {
    return undefined;
  }

  return getArticleBySlug(siteSlug, article.inlineRelatedSlug);
}

/** Index after which to render the inline related read (~middle of the list). */
export function getInlineRelatedInsertAfterIndex(itemCount: number): number {
  if (itemCount <= 0) return -1;
  return Math.ceil(itemCount / 2) - 1;
}

export function getBottomRelatedArticles(
  siteSlug: SiteSlug,
  article: Article,
): Article[] {
  const exclude = new Set<string>([article.slug]);
  if (article.inlineRelatedSlug) {
    exclude.add(article.inlineRelatedSlug);
  }

  if (article.relatedSlugs && article.relatedSlugs.length > 0) {
    return uniqueExistingArticles(
      siteSlug,
      article.relatedSlugs,
      exclude,
    ).slice(0, BOTTOM_RELATED_LIMIT);
  }

  if (!article.reviewCategory) {
    return [];
  }

  return getArticles(siteSlug)
    .filter(
      (candidate) =>
        !exclude.has(candidate.slug) &&
        candidate.reviewCategory === article.reviewCategory,
    )
    .slice(0, BOTTOM_RELATED_LIMIT);
}
