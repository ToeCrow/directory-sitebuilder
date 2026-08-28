import type { SiteData } from "@/types/site";
import { catalog } from "./catalog";
import { posts } from "./blog";
import {
  directoryBlogPostToArticle,
  directoryProductToSiteProduct,
} from "@/lib/directory-to-site-data";

export const siteData: SiteData = {
  slug: "findworthnow",
  title: "FindWorthNow",
  metaTitle: "FindWorthNow – Discover What's Worth It",
  metaDescription:
    "FindWorthNow explores products, tools, programs, and ideas worth considering — sleep, supplements, and more.",
  niche: "affiliate-directory",
  siteUrl: "https://findworthnow.com",
  favicon: "/sites/findworthnow/favicon.png",

  hero: {
    eyebrow: "Discover what's worth it.",
    headline: "FindWorthNow",
    subheadline:
      "FindWorthNow explores products, tools, programs, and ideas worth considering. We start small, stay specific, and only publish categories we actually cover.",
    primaryCta: "Browse products",
    secondaryCtaHref: "/products",
  },

  topPicks: {
    title: "Categories",
  },

  productDirectory: {
    title: "Product reviews",
    description:
      "Short reviews of products people are comparing. Filter by category, then open one and decide.",
  },

  products: catalog.products.map((product, index) =>
    directoryProductToSiteProduct(product, index),
  ),

  comparisonTable: {
    title: "Comparisons",
    rows: [],
  },

  buyingGuide: {
    title: "Guides",
    sections: [],
  },

  faqs: [],
  articles: posts.map(directoryBlogPostToArticle),

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
      { label: "Products", href: "/products" },
      { label: "Blog", href: "/blog" },
      { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
    ],
  },
};
