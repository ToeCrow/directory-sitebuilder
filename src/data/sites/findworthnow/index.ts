import type { SiteData } from "@/types/site";

export const siteData: SiteData = {
  slug: "findworthnow",
  title: "FindWorthNow",
  metaTitle: "FindWorthNow – Discover What's Worth It",
  metaDescription:
    "FindWorthNow explores products, tools, programs, and ideas worth considering — starting with sleep.",
  niche: "affiliate-directory",
  siteUrl: "https://findworthnow.com",
  ratingScale: 5,

  hero: {
    eyebrow: "Discover what's worth it.",
    headline: "FindWorthNow",
    subheadline:
      "FindWorthNow explores products, tools, programs, and ideas worth considering. We start small, stay specific, and only publish categories we actually cover.",
    primaryCta: "Explore Sleep",
    secondaryCtaHref: "/sleep",
  },

  topPicks: {
    title: "Categories",
  },

  productDirectory: {
    title: "Browse FindWorthNow",
  },

  products: [],

  comparisonTable: {
    title: "Comparisons",
    rows: [],
  },

  buyingGuide: {
    title: "Guides",
    sections: [],
  },

  faqs: [],
  articles: [],

  newsletter: {
    title: "",
    description: "",
    buttonText: "",
    successMessage: "",
  },

  affiliateDisclosure:
    "We may earn a commission if you purchase through links on this site, at no additional cost to you.",

  footer: {
    tagline: "Discover what's worth it.",
    links: [
      { label: "Sleep", href: "/sleep" },
      { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
    ],
  },
};
