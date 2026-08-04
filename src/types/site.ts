export type FAQ = { question: string; answer: string };

export type ArticleProductSection = {
  heading: string;
  intro?: string;
  // Static /sites/... paths for now; replace with blob/CDN URLs from admin later.
  image?: { src: string; alt: string };
  whatItIs: string;
  whyItEarnsASpot: string[];
  whereItFallsShort: string[];
  bestFor: string;
  skipIf: string;
  /** Catalog product slug when this section maps to a Product. */
  productSlug?: string;
  /** Variant label when the section describes a specific configuration of the catalog product. */
  productVariant?: string;
};

export type ArticleCitation = {
  label: string;
  href: string;
};

export type EditorialFigure = {
  src: string;
  alt: string;
  caption?: string;
  /** Unsplash (or other) photo page */
  creditHref?: string;
  /** Photographer profile page */
  photographerHref?: string;
};

export type EditorialSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  /** Extra paragraphs after bullets / mid-section image */
  closingParagraphs?: string[];
  image?: EditorialFigure;
  factBox?: {
    title: string;
    items: string[];
  };
  citations?: ArticleCitation[];
};

export type ReviewCategory = "mattress" | "pillow" | "science";

type ArticleBase = {
  title: string;
  slug: string;
  excerpt?: string;
  /** Optional SEO meta description; falls back to excerpt or intro. */
  metaDescription?: string;
  intro: string[];
  /** Filter bucket on /reviews (side-sleeper). */
  reviewCategory?: ReviewCategory;
  /** ISO 8601 date string, e.g. "2026-03-15" */
  publishedAt?: string;
  /** ISO 8601 date string, e.g. "2026-03-15" */
  updatedAt?: string;
  /** Display name only */
  author?: string;
  /** Optional per-article social share image override */
  ogImage?: { src: string; alt: string };
};

export type ArticleClosingGuide = {
  title: string;
  items: string[];
  closing?: string;
  pricingNote?: string;
};

export type ProductRoundupArticle = ArticleBase & {
  kind: "product-roundup";
  researchNote: { title: string; content: string };
  products: ArticleProductSection[];
  /** Optional post-list “How to choose” guide */
  closingGuide?: ArticleClosingGuide;
  /** Optional FAQ block after the product list */
  faqs?: FAQ[];
};

export type EditorialArticle = ArticleBase & {
  kind: "editorial";
  introImage?: EditorialFigure;
  sections: EditorialSection[];
};

export type Article = ProductRoundupArticle | EditorialArticle;

export type BuyingGuideSection = { title: string; content: string };

export type ComparisonRow = {
  key: string;
  label: string;
  type?: "text" | "boolean";
};

export type ProductCategory = "mattress" | "pillow" | "topper" | "software";

// TODO: load products from PostgreSQL via admin/CMS instead of static site data.

export type Product = {
  name: string;
  slug: string;
  category: ProductCategory;
  /** Product photo shown on the product page (and OG when set). */
  image?: { src: string; alt: string };
  shortDescription: string;
  /** Optional SEO meta description; falls back to shortDescription. */
  metaDescription?: string;
  /** Optional SEO document title; falls back to "{name} Review". */
  metaTitle?: string;
  bestFor: string;
  /**
   * Numeric floor for sorting/filtering (USD).
   * Null/undefined when price is unknown (e.g. custom quote).
   */
  priceFrom?: number | null;
  /** Visitor-facing price string; mattress prices should state Queen (or other size). */
  priceDisplay: string;
  /** ISO date when price was last verified against the official product page. */
  priceUpdatedAt?: string;
  features: string[];
  pros: string[];
  cons: string[];
  /** Always the official manufacturer/product page. */
  productUrl: string;
  /** Real affiliate tracking URL only when a partnership exists. */
  affiliateUrl?: string;
  /** Whether we currently have an active affiliate partnership for this product */
  hasAffiliatePartnership: boolean;
  /** Overall score on the site’s ratingScale (Research Score for side-sleeper). */
  rating: number;
  /**
   * Optional future per-criterion Research Score values (e.g. cooling, pressure relief).
   * Not used in UI yet — reserved so the model can grow without reshaping Product.
   */
  researchScoreBreakdown?: Record<string, number>;
  badge?: string;
  featuredRank: number | null;
  directoryOrder: number;
  /** Present only for products included in the comparison table. */
  comparisonRank?: number;
  comparison?: Record<string, string | boolean>;
};

export type SiteData = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  niche: string;
  siteUrl: string;
  ratingScale: 5 | 10;
  /** Optional header logo+wordmark image (e.g. /sites/side-sleeper/header-brand.png) */
  headerBrandImage?: string;
  hero: {
    eyebrow?: string;
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta?: string;
    secondaryCtaHref?: string;
    image?: {
      src: string;
      srcMobile?: string;
      alt: string;
    };
  };
  topPicks: {
    title: string;
    description?: string;
  };
  products: Product[];
  productDirectory: {
    title: string;
    description?: string;
  };
  comparisonTable: {
    title: string;
    description?: string;
    rowHeaderLabel?: string;
    rows: ComparisonRow[];
  };
  buyingGuide: {
    title: string;
    sections: BuyingGuideSection[];
  };
  faqs: FAQ[];
  articles: Article[];
  newsletter: {
    title: string;
    description: string;
    buttonText: string;
    successMessage: string;
  };
  affiliateDisclosure: string;
  footer: {
    tagline?: string;
    links: { label: string; href: string }[];
  };
  ads?: {
    slots: {
      primary: string;
      secondary: string;
    };
  };
};

export type AdSlotId = "primary" | "secondary";
