import { DOMAIN_SITE_MAP, getSiteSlugFromHost } from "@/lib/domain-map";
import { siteSlugs, type SiteSlug } from "@/data/sites";

/** Sites that publish on a mapped custom domain without an internal slug prefix. */
const PUBLIC_PATH_SITE_SLUGS = new Set(Object.values(DOMAIN_SITE_MAP));

export function siteUsesPublicPaths(siteSlug: string): boolean {
  return PUBLIC_PATH_SITE_SLUGS.has(siteSlug);
}

function normalizePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Join a host-aware public base path with a site-relative path.
 * publicBasePath is "" on a mapped custom domain, or "/{siteSlug}" on the platform.
 */
export function buildInternalUrl(
  publicBasePath: string,
  path: string = "/",
): string {
  const base = publicBasePath.replace(/\/$/, "");
  const normalized = normalizePath(path);
  if (normalized === "/") {
    return base || "/";
  }
  return `${base}${normalized}`;
}

/**
 * Resolve the public base path for in-app links from the current request host.
 * Custom domain for this site → ""; otherwise → "/{siteSlug}".
 */
export function resolvePublicBasePath(siteSlug: string, host: string): string {
  const mappedSlug = getSiteSlugFromHost(host);
  if (mappedSlug === siteSlug) {
    return "";
  }
  return `/${siteSlug}`;
}

/**
 * Public canonical / sitemap path (no internal siteSlug for custom-domain sites).
 * Example side-sleeper: `/products/winkbed`
 */
export function getPublicPath(siteSlug: string, path: string = "/"): string {
  const normalized = normalizePath(path);
  if (normalized === "/") {
    return siteUsesPublicPaths(siteSlug) ? "/" : `/${siteSlug}`;
  }
  if (siteUsesPublicPaths(siteSlug)) {
    return normalized;
  }
  return `/${siteSlug}${normalized}`;
}

/**
 * In-app Link href using the host-aware publicBasePath.
 * Custom domain: "/products". Platform: "/side-sleeper/products".
 */
export function getAppPath(publicBasePath: string, path: string = "/"): string {
  return buildInternalUrl(publicBasePath, path);
}

/** @deprecated Prefer getAppPath for links or getPublicPath for SEO. */
export function getSitePath(publicBasePath: string, path: string = "/"): string {
  return getAppPath(publicBasePath, path);
}

export function getProductPath(
  publicBasePath: string,
  productSlug: string,
): string {
  return getAppPath(publicBasePath, `/products/${productSlug}`);
}

export function getProductsIndexPath(
  publicBasePath: string,
  category?: "mattress" | "pillow" | "topper",
): string {
  const base = getAppPath(publicBasePath, "/products");
  if (!category) return base;
  // Jump to the directory heading/filters (not the featured grid above).
  return `${base}?category=${category}#directory`;
}

export function getComparisonsPath(publicBasePath: string): string {
  return getAppPath(publicBasePath, "/comparisons");
}

export function getBuyingGuidePath(publicBasePath: string): string {
  return getAppPath(publicBasePath, "/buying-guide");
}

export function getArticlePath(
  publicBasePath: string,
  articleSlug: string,
): string {
  return getAppPath(publicBasePath, `/reviews/${articleSlug}`);
}

export function getReviewsIndexPath(
  publicBasePath: string,
  category?: "mattress" | "pillow" | "science",
): string {
  const base = getAppPath(publicBasePath, "/reviews");
  if (!category) return base;
  return `${base}?category=${category}`;
}

/** Whether this host is a mapped custom domain (not the platform host). */
export function isCustomDomainHost(host: string): boolean {
  return getSiteSlugFromHost(host) !== undefined;
}

export function isValidSiteSlugValue(value: string): value is SiteSlug {
  return (siteSlugs as string[]).includes(value);
}

/** Canonical/sitemap absolute helper. */
export function getPublicAbsoluteUrl(
  siteSlug: string,
  siteUrl: string,
  path: string,
): string {
  const base = siteUrl.replace(/\/$/, "");
  const publicPath = getPublicPath(siteSlug, path);
  if (publicPath === "/") return `${base}/`;
  return `${base}${publicPath}`;
}
