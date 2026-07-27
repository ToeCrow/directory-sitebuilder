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
 * In-app Link href. Always includes /{siteSlug} so platform/local routing works.
 * On custom domains, middleware redirects prefixed URLs to the public path.
 */
export function getAppPath(siteSlug: string, path: string = "/"): string {
  const normalized = normalizePath(path);
  if (normalized === "/") {
    return `/${siteSlug}`;
  }
  return `/${siteSlug}${normalized}`;
}

/** @deprecated Prefer getAppPath for links or getPublicPath for SEO. */
export function getSitePath(siteSlug: string, path: string = "/"): string {
  return getAppPath(siteSlug, path);
}

export function getProductPath(siteSlug: string, productSlug: string): string {
  return getAppPath(siteSlug, `/products/${productSlug}`);
}

export function getProductsIndexPath(
  siteSlug: string,
  category?: "mattress" | "pillow",
): string {
  const base = getAppPath(siteSlug, "/products");
  if (!category) return base;
  return `${base}?category=${category}`;
}

export function getComparisonsPath(siteSlug: string): string {
  return getAppPath(siteSlug, "/comparisons");
}

export function getArticlePath(siteSlug: string, articleSlug: string): string {
  return getAppPath(siteSlug, `/articles/${articleSlug}`);
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
