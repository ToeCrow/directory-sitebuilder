import { pathnameHasSiteSlugPrefix } from "@/lib/domain-map";

const PASSTHROUGH_PREFIXES = ["/_next", "/api", "/admin"];
const PASSTHROUGH_FILES = new Set([
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/BingSiteAuth.xml",
]);

/**
 * Whether a custom-domain request should be rewritten to /{siteSlug}{pathname}.
 */
export function shouldRewriteCustomDomainPath(
  pathname: string,
  siteSlug: string,
): boolean {
  if (PASSTHROUGH_FILES.has(pathname)) return false;
  if (PASSTHROUGH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return false;
  }
  if (pathname === `/${siteSlug}` || pathname.startsWith(`/${siteSlug}/`)) {
    return false;
  }
  if (pathnameHasSiteSlugPrefix(pathname)) {
    return false;
  }
  if (
    pathname.includes(".") &&
    !pathname.startsWith("/reviews") &&
    !pathname.startsWith("/articles") &&
    !pathname.startsWith("/products") &&
    !pathname.startsWith("/comparisons") &&
    !pathname.startsWith("/affiliate") &&
    !pathname.startsWith("/research-score") &&
    !pathname.startsWith("/buying-guide") &&
    !pathname.startsWith("/about") &&
    !pathname.startsWith("/privacy-policy")
  ) {
    if (
      pathname.startsWith("/sites/") ||
      pathname.startsWith("/images/") ||
      /\.(ico|png|jpg|jpeg|gif|webp|svg|txt|xml|json|webmanifest)$/i.test(
        pathname,
      )
    ) {
      return false;
    }
  }
  return true;
}

export function getCustomDomainRewritePath(
  pathname: string,
  siteSlug: string,
): string {
  if (pathname === "/") return `/${siteSlug}`;
  return `/${siteSlug}${pathname}`;
}

/** Strip internal /{siteSlug} prefix on custom domains so the URL bar stays clean. */
export function getCustomDomainStripRedirectPath(
  pathname: string,
  siteSlug: string,
): string | null {
  if (pathname === `/${siteSlug}`) return "/";
  const prefix = `/${siteSlug}/`;
  if (pathname.startsWith(prefix)) {
    return pathname.slice(siteSlug.length + 1) || "/";
  }
  return null;
}
