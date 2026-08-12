import type {
  Article,
  Product,
  ProductCategory,
  ReviewCategory,
} from "@/types/site";
import {
  getSiteBySlug,
  type SiteSlug,
} from "@/data/sites";

export { getSiteBySlug, isValidSiteSlug, siteSlugs, getAllSites } from "@/data/sites";
export type { SiteSlug } from "@/data/sites";

export function getSiteData(siteSlug: SiteSlug) {
  return getSiteBySlug(siteSlug)!;
}

export function getProducts(siteSlug: SiteSlug): Product[] {
  return getSiteData(siteSlug).products;
}

export function getProductBySlug(
  siteSlug: SiteSlug,
  slug: string,
): Product | undefined {
  return getProducts(siteSlug).find((product) => product.slug === slug);
}

export function getArticles(siteSlug: SiteSlug): Article[] {
  return getSiteData(siteSlug).articles;
}

export function getArticleBySlug(
  siteSlug: SiteSlug,
  slug: string,
): Article | undefined {
  return getArticles(siteSlug).find((article) => article.slug === slug);
}

/** Roundup guides that reference a catalog product via productSlug. */
export function getArticlesFeaturingProduct(
  siteSlug: SiteSlug,
  productSlug: string,
): Article[] {
  return getArticles(siteSlug).filter(
    (article) =>
      article.kind === "product-roundup" &&
      article.products.some((product) => product.productSlug === productSlug),
  );
}

export function getArticlesByReviewCategory(
  siteSlug: SiteSlug,
  category?: ReviewCategory,
): Article[] {
  const articles = getArticles(siteSlug);
  if (!category) return articles;
  return articles.filter((article) => article.reviewCategory === category);
}

/**
 * Homepage Featured Reviews: keyword guides + science + latest
 * (if science is latest, use 2nd-latest non-science instead).
 */
export function getFeaturedHomeReviews(siteSlug: SiteSlug): Article[] {
  const siteData = getSiteData(siteSlug);
  const articles = getArticles(siteSlug);
  const bySlug = new Map(articles.map((article) => [article.slug, article]));
  const featured: Article[] = [];
  const seen = new Set<string>();

  const push = (article: Article | undefined) => {
    if (!article || seen.has(article.slug)) return;
    seen.add(article.slug);
    featured.push(article);
  };

  for (const slug of siteData.featuredReviewSlugs ?? []) {
    push(bySlug.get(slug));
  }

  const scienceSlug = siteData.scienceArticleSlug;
  if (scienceSlug) {
    push(bySlug.get(scienceSlug));
  }

  const rankedNewestFirst = articles
    .map((article, index) => ({ article, index }))
    .sort((a, b) => {
      const dateA = a.article.publishedAt ?? "";
      const dateB = b.article.publishedAt ?? "";
      if (dateA !== dateB) {
        return dateB.localeCompare(dateA);
      }
      return b.index - a.index;
    })
    .map(({ article }) => article);

  const latest = rankedNewestFirst[0];
  if (!latest) {
    return featured;
  }

  if (scienceSlug && latest.slug === scienceSlug) {
    const secondLatestNonScience = rankedNewestFirst.find(
      (article) => article.slug !== scienceSlug,
    );
    push(secondLatestNonScience);
  } else {
    push(latest);
  }

  return featured;
}

export function getProductsByCategory(
  siteSlug: SiteSlug,
  category: ProductCategory,
): Product[] {
  return getProducts(siteSlug).filter((product) => product.category === category);
}

export function getFeaturedProducts(siteSlug: SiteSlug): Product[] {
  return getProducts(siteSlug)
    .filter((product) => product.featuredRank !== null)
    .sort((a, b) => a.featuredRank! - b.featuredRank!);
}

export function getComparisonProducts(siteSlug: SiteSlug): Product[] {
  return getProducts(siteSlug)
    .filter(
      (product) =>
        product.comparison !== undefined &&
        product.comparisonRank !== undefined &&
        (product.category !== "pillow"),
    )
    .sort((a, b) => (a.comparisonRank ?? 0) - (b.comparisonRank ?? 0));
}

export function getDirectoryProducts(
  siteSlug: SiteSlug,
  category?: ProductCategory,
): Product[] {
  const list = category
    ? getProductsByCategory(siteSlug, category)
    : getProducts(siteSlug);
  return [...list].sort((a, b) => a.directoryOrder - b.directoryOrder);
}

export function getComparisonValue(
  product: Product,
  rowKey: string,
): string | boolean | undefined {
  return product.comparison?.[rowKey];
}

export function siteHasMattressPillowNav(siteSlug: string): boolean {
  return siteSlug === "side-sleeper";
}
