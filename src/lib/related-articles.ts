import type { Article, SiteData } from "@/types/site";
import { resolveRelatedArticles } from "@/lib/article-content";
import { articleBySlugFrom } from "@/lib/site-view";

const BOTTOM_RELATED_LIMIT = 4;

export function getInlineRelatedArticle(
  siteData: SiteData,
  article: Article,
): Article | undefined {
  if (!article.inlineRelatedSlug || article.inlineRelatedSlug === article.slug) {
    return undefined;
  }

  return articleBySlugFrom(siteData, article.inlineRelatedSlug);
}

/** Index after which to render the inline related read (~middle of the list). */
export function getInlineRelatedInsertAfterIndex(itemCount: number): number {
  if (itemCount <= 0) return -1;
  return Math.ceil(itemCount / 2) - 1;
}

export function getBottomRelatedArticles(
  siteData: SiteData,
  article: Article,
): Article[] {
  const exclude = new Set<string>([article.slug]);
  if (article.inlineRelatedSlug) {
    exclude.add(article.inlineRelatedSlug);
  }

  if (
    (article.relatedArticleIds && article.relatedArticleIds.length > 0) ||
    (article.relatedSlugs && article.relatedSlugs.length > 0)
  ) {
    return resolveRelatedArticles({
      articles: siteData.articles,
      relatedArticleIds: article.relatedArticleIds,
      relatedSlugs: article.relatedSlugs,
      excludeSlugs: exclude,
      limit: BOTTOM_RELATED_LIMIT,
    });
  }

  if (!article.reviewCategory) {
    return [];
  }

  return siteData.articles
    .filter(
      (candidate) =>
        !exclude.has(candidate.slug) &&
        candidate.reviewCategory === article.reviewCategory,
    )
    .slice(0, BOTTOM_RELATED_LIMIT);
}
