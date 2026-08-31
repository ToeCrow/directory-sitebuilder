import type { AdminClickedLink } from "@/lib/admin/clicks";

export const CLICK_VIEWS = [
  "commercial",
  "engagement",
  "product-exploration",
  "navigation",
  "all",
] as const;

export type ClickView = (typeof CLICK_VIEWS)[number];

export const CLICK_CATEGORIES = [
  "commercial",
  "engagement",
  "product-exploration",
  "navigation",
  "other",
] as const;

export type ClickCategory = (typeof CLICK_CATEGORIES)[number];

export const CLICK_PERIODS = ["7d", "30d", "total"] as const;

export type ClickPeriod = (typeof CLICK_PERIODS)[number];

type ClickIdentity = Pick<
  AdminClickedLink,
  "placement" | "targetType" | "sourceType"
>;

const COMMERCIAL_PLACEMENTS = new Set([
  "product-card-cta",
  "catalog-hero-cta",
  "catalog-footer-cta",
  "hub-cta",
  "roundup-product-cta",
]);

const ENGAGEMENT_PLACEMENTS = new Set([
  "tiptap-internal-link",
  "related-articles",
  "related-articles-inline",
  "featured-guides",
  "blog-teaser",
  "article-list",
]);

const PRODUCT_EXPLORATION_PLACEMENTS = new Set([
  "product-card",
  "catalog-card",
  "roundup-product-heading",
  "roundup-product-image",
]);

const NAVIGATION_PLACEMENTS = new Set([
  "header-home",
  "header-nav",
  "footer-nav",
  "hero-cta",
  "category-grid",
  "blog-index",
  "home-reviews-index",
]);

export function getClickCategory(row: ClickIdentity): ClickCategory {
  const placement = row.placement.trim();
  if (COMMERCIAL_PLACEMENTS.has(placement)) {
    return "commercial";
  }
  if (ENGAGEMENT_PLACEMENTS.has(placement)) {
    return "engagement";
  }
  if (PRODUCT_EXPLORATION_PLACEMENTS.has(placement)) {
    return "product-exploration";
  }
  if (NAVIGATION_PLACEMENTS.has(placement)) {
    return "navigation";
  }

  if (row.targetType === "external" && row.sourceType !== "nav") {
    return "commercial";
  }
  if (row.targetType === "article") {
    return "engagement";
  }
  if (row.targetType === "product") {
    return "product-exploration";
  }
  if (row.sourceType === "nav") {
    return "navigation";
  }
  return "other";
}

export function getClickCategoryLabel(category: ClickCategory | ClickView): string {
  switch (category) {
    case "commercial":
      return "Commercial";
    case "engagement":
      return "Internal links";
    case "product-exploration":
      return "Product exploration";
    case "navigation":
      return "Navigation";
    case "all":
      return "All";
    case "other":
      return "Other";
  }
}

export function parseClickView(value: string | undefined): ClickView {
  if (value && (CLICK_VIEWS as readonly string[]).includes(value)) {
    return value as ClickView;
  }
  return "commercial";
}

export function parseClickPeriod(value: string | undefined): ClickPeriod {
  if (value && (CLICK_PERIODS as readonly string[]).includes(value)) {
    return value as ClickPeriod;
  }
  return "7d";
}

export function clickCountForPeriod(
  row: Pick<AdminClickedLink, "clicks7d" | "clicks30d" | "totalClicks">,
  period: ClickPeriod,
): number {
  if (period === "7d") {
    return row.clicks7d;
  }
  if (period === "30d") {
    return row.clicks30d;
  }
  return row.totalClicks;
}

export function sortClickedLinks(
  rows: AdminClickedLink[],
  period: ClickPeriod,
): AdminClickedLink[] {
  return [...rows].sort(
    (a, b) => clickCountForPeriod(b, period) - clickCountForPeriod(a, period),
  );
}

export function filterClickedLinks(
  rows: AdminClickedLink[],
  view: ClickView,
): AdminClickedLink[] {
  if (view === "all") {
    return rows;
  }
  return rows.filter((row) => getClickCategory(row) === view);
}

export function clicksAdminHref(options: {
  site?: string;
  view?: ClickView;
  period?: ClickPeriod;
}): string {
  const params = new URLSearchParams();
  if (options.site) {
    params.set("site", options.site);
  }
  if (options.view && options.view !== "commercial") {
    params.set("view", options.view);
  }
  if (options.period && options.period !== "7d") {
    params.set("period", options.period);
  }
  const query = params.toString();
  return query ? `/admin/clicks?${query}` : "/admin/clicks";
}

export function formatClickSource(row: AdminClickedLink): string {
  const path = row.sourcePath?.trim();
  if (path) {
    return path;
  }
  return row.sourceType;
}

export function formatClickTarget(row: AdminClickedLink): string {
  const label = row.label?.trim();
  if (label) {
    return label;
  }
  const url = displayTargetUrl(row.targetUrl);
  if (url) {
    return url;
  }
  return row.targetType;
}

export function formatClickTargetDetail(row: AdminClickedLink): string | null {
  const url = displayTargetUrl(row.targetUrl);
  const label = row.label?.trim();
  if (label && url && url !== label) {
    return url;
  }
  return null;
}

function displayTargetUrl(value: string | null): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    return "";
  }
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
  try {
    const url = new URL(trimmed);
    return url.hostname.replace(/^www\./, "") + (url.pathname === "/" ? "" : url.pathname);
  } catch {
    return trimmed;
  }
}
