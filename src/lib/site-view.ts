import { siteHasFeature } from "@/lib/site-config";
import type {
  Article,
  Product,
  ProductCategory,
  ReviewCategory,
  SiteData,
} from "@/types/site";

export function productBySlugFrom(
  siteData: SiteData,
  slug: string,
): Product | undefined {
  return siteData.products.find((product) => product.slug === slug);
}

export function productByIdFrom(
  siteData: SiteData,
  productId: string,
): Product | undefined {
  return siteData.products.find((product) => product.id === productId);
}

export function roundupProductFrom(
  siteData: SiteData,
  section: { productId?: string; productSlug?: string },
): Product | undefined {
  if (section.productId) {
    const byId = productByIdFrom(siteData, section.productId);
    if (byId) return byId;
  }
  if (section.productSlug) {
    return productBySlugFrom(siteData, section.productSlug);
  }
  return undefined;
}

export function articleBySlugFrom(
  siteData: SiteData,
  slug: string,
): Article | undefined {
  return siteData.articles.find((article) => article.slug === slug);
}

export function articlesFeaturingProductFrom(
  siteData: SiteData,
  productSlug: string,
): Article[] {
  const product = productBySlugFrom(siteData, productSlug);
  return siteData.articles.filter(
    (article) =>
      article.kind === "product-roundup" &&
      article.products.some(
        (section) =>
          section.productSlug === productSlug ||
          (product?.id != null && section.productId === product.id),
      ),
  );
}

export function articlesByReviewCategoryFrom(
  siteData: SiteData,
  category?: ReviewCategory,
): Article[] {
  if (!category) return siteData.articles;
  return siteData.articles.filter(
    (article) => article.reviewCategory === category,
  );
}

/**
 * Homepage Featured Reviews: keyword guides + science + latest
 * (if science is latest, use 2nd-latest non-science instead).
 */
export function featuredHomeReviewsFrom(siteData: SiteData): Article[] {
  const bySlug = new Map(
    siteData.articles.map((article) => [article.slug, article]),
  );
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

  const rankedNewestFirst = siteData.articles
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

export function productsByCategoryFrom(
  siteData: SiteData,
  category: ProductCategory,
): Product[] {
  return siteData.products.filter((product) => product.category === category);
}

export function featuredProductsFrom(siteData: SiteData): Product[] {
  return siteData.products
    .filter((product) => product.featuredRank !== null)
    .sort((a, b) => a.featuredRank! - b.featuredRank!);
}

export function comparisonProductsFrom(siteData: SiteData): Product[] {
  return siteData.products
    .filter(
      (product) =>
        product.comparison !== undefined &&
        product.comparisonRank !== undefined &&
        product.category !== "pillow",
    )
    .sort((a, b) => (a.comparisonRank ?? 0) - (b.comparisonRank ?? 0));
}

export function directoryProductsFrom(
  siteData: SiteData,
  category?: ProductCategory,
): Product[] {
  const list = category
    ? productsByCategoryFrom(siteData, category)
    : siteData.products;
  return [...list].sort((a, b) => a.directoryOrder - b.directoryOrder);
}

export function getComparisonValue(
  product: Product,
  rowKey: string,
): string | boolean | undefined {
  return product.comparison?.[rowKey];
}

export function siteHasMattressPillowNav(siteSlug: string): boolean {
  return siteHasFeature(siteSlug, "product-nav");
}
