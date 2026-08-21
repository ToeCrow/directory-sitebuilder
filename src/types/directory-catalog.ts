export type DirectoryReviewSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type DirectoryCategory = {
  slug: string;
  name: string;
  description: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
};

export type DirectoryProduct = {
  slug: string;
  name: string;
  categorySlug: string;
  typeLabel: string;
  shortDescription: string;
  affiliateUrl: string;
  ctaLabel: string;
  image?: { src: string; alt: string };
  reviewSlug: string;
  reviewTitle: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  sections: DirectoryReviewSection[];
};

export type DirectoryCatalog = {
  categories: DirectoryCategory[];
  products: DirectoryProduct[];
};
