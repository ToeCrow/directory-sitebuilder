import type { DirectoryBlogPost } from "@/types/directory-blog";
import type { DirectoryProduct } from "@/types/directory-catalog";
import type { EditorialArticle, Product } from "@/types/site";

/**
 * Maps editorial-catalog products into the shared Product seed shape
 * so they can live in Postgres / admin without changing the public catalog routes yet.
 */
export function directoryProductToSiteProduct(
  product: DirectoryProduct,
  index: number,
): Product {
  return {
    name: product.name,
    slug: product.slug,
    category: "software",
    image: product.image,
    shortDescription: product.shortDescription,
    metaTitle: product.metaTitle,
    metaDescription: product.metaDescription,
    bestFor: product.typeLabel,
    priceDisplay: "See offer",
    features: [],
    pros: [],
    cons: [],
    productUrl: product.affiliateUrl,
    affiliateUrl: product.affiliateUrl,
    hasAffiliatePartnership: true,
    featuredRank: null,
    directoryOrder: index + 1,
  };
}

export function directoryBlogPostToArticle(
  post: DirectoryBlogPost,
): EditorialArticle {
  return {
    kind: "editorial",
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    publishedAt: post.publishedAt,
    intro: post.intro,
    relatedSlugs: post.relatedPostSlugs,
    author: post.author,
    sections: post.sections.map((section) => ({
      heading: section.heading,
      paragraphs: section.paragraphs,
      bullets: section.bullets,
    })),
  };
}
