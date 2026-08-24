export type DirectoryBlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type DirectoryBlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  publishedAt: string;
  intro: string[];
  sections: DirectoryBlogSection[];
  relatedProductSlugs: string[];
  relatedPostSlugs: string[];
};
