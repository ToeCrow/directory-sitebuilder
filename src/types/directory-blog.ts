export type DirectoryBlogSection = {
  heading: string;
  /** Defaults to 2. Use 3 for FAQ questions and mid-section subheads. */
  headingLevel?: 2 | 3;
  paragraphs: string[];
  bullets?: string[];
  cta?: {
    label: string;
    path: string;
    afterParagraph?: number;
  };
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
  /** Display name on the article. */
  author?: string;
};
