export const SITE_FEATURES = [
  "products",
  "catalog",
  "articles",
  "faq",
  "comparison",
  "buying-guide",
  "about",
  "privacy",
  "affiliate",
  "affiliate-disclosure",
  "ads",
  "product-nav",
] as const;

export type SiteFeature = (typeof SITE_FEATURES)[number];

export const SITE_THEMES = ["default", "paper", "editorial-dark"] as const;
export type SiteTheme = (typeof SITE_THEMES)[number];

export const HOMEPAGE_SECTIONS = [
  "hero",
  "affiliate-disclosure",
  "top-picks",
  "ad-primary",
  "comparison",
  "product-directory",
  "ad-secondary",
  "faq",
  "featured-reviews",
  "category-grid",
  "blog-teasers",
] as const;

export type HomepageSection = (typeof HOMEPAGE_SECTIONS)[number];

export const ARTICLE_ROUTES = ["reviews", "blog"] as const;
export type ArticleRoute = (typeof ARTICLE_ROUTES)[number];

export type ArticleConfig = {
  label: string;
  route: ArticleRoute;
};

export type SiteRef = string | { slug: string };

export type SiteCapabilities = {
  theme: SiteTheme;
  features: readonly SiteFeature[];
  articleConfig?: ArticleConfig;
  homepageSections: readonly HomepageSection[];
};

export const SITE_PRESETS = {
  directory: {
    theme: "default",
    features: [
      "products",
      "articles",
      "faq",
      "comparison",
      "buying-guide",
      "affiliate",
      "ads",
    ],
    articleConfig: { label: "Reviews", route: "reviews" },
    homepageSections: [
      "hero",
      "affiliate-disclosure",
      "top-picks",
      "ad-primary",
      "comparison",
      "product-directory",
      "ad-secondary",
      "faq",
      "featured-reviews",
    ],
  },
  review: {
    theme: "paper",
    features: [
      "products",
      "articles",
      "faq",
      "buying-guide",
      "about",
      "privacy",
      "affiliate",
      "ads",
      "product-nav",
    ],
    articleConfig: { label: "Reviews", route: "reviews" },
    homepageSections: [
      "hero",
      "affiliate-disclosure",
      "featured-reviews",
      "faq",
    ],
  },
  "editorial-catalog": {
    theme: "editorial-dark",
    features: [
      "products",
      "catalog",
      "articles",
      "affiliate-disclosure",
    ],
    articleConfig: { label: "Blog", route: "blog" },
    homepageSections: ["hero", "category-grid", "blog-teasers"],
  },
} as const satisfies Record<string, SiteCapabilities>;

export type SitePresetId = keyof typeof SITE_PRESETS;

const FALLBACK_CAPABILITIES: SiteCapabilities = {
  theme: "default",
  features: [],
  homepageSections: ["hero"],
};

export const SITE_CAPABILITIES: Record<string, SiteCapabilities> = {
  "construction-software": SITE_PRESETS.directory,
  "side-sleeper": SITE_PRESETS.review,
  findworthnow: SITE_PRESETS["editorial-catalog"],
};

export function resolveSiteSlug(site: SiteRef): string {
  return typeof site === "string" ? site : site.slug;
}

export function getSiteCapabilities(site: SiteRef): SiteCapabilities {
  return SITE_CAPABILITIES[resolveSiteSlug(site)] ?? FALLBACK_CAPABILITIES;
}

export function siteHasFeature(site: SiteRef, feature: SiteFeature): boolean {
  return getSiteCapabilities(site).features.includes(feature);
}

export function getSiteTheme(site: SiteRef): SiteTheme {
  return getSiteCapabilities(site).theme;
}

export function getArticleConfig(site: SiteRef): ArticleConfig | undefined {
  const capabilities = getSiteCapabilities(site);
  if (!capabilities.features.includes("articles")) {
    return undefined;
  }
  return capabilities.articleConfig;
}

export function getEnabledHomepageSections(
  site: SiteRef,
): readonly HomepageSection[] {
  return getSiteCapabilities(site).homepageSections;
}

export function siteHasHomepageSection(
  site: SiteRef,
  section: HomepageSection,
): boolean {
  return getEnabledHomepageSections(site).includes(section);
}

export function getConfiguredSiteSlugs(): string[] {
  return Object.keys(SITE_CAPABILITIES);
}
