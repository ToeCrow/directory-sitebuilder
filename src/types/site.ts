export type FAQ = { question: string; answer: string };

export type Article = { title: string; slug: string; excerpt?: string };

export type BuyingGuideSection = { title: string; content: string };

export type ComparisonRow = {
  key: string;
  label: string;
  type?: "text" | "boolean";
};

// TODO: add optional category field (mattress | pillow | topper) for multi-category directories.
// TODO: load products from PostgreSQL via admin/CMS instead of static site data.

export type Product = {
  name: string;
  slug: string;
  shortDescription: string;
  bestFor: string;
  priceFrom: string;
  features: string[];
  pros: string[];
  cons: string[];
  affiliateUrl: string;
  rating: number;
  badge?: string;
  featuredRank: number | null;
  comparisonRank: number;
  directoryOrder: number;
  comparison: Record<string, string | boolean>;
};

export type SiteData = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  niche: string;
  siteUrl: string;
  ratingScale: 5 | 10;
  hero: {
    eyebrow?: string;
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta?: string;
    secondaryCtaHref?: string;
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
