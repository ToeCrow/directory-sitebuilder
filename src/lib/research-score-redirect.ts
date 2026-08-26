import { siteSlugs } from "@/data/sites";

/**
 * Map retired /research-score paths to /about (308).
 * Handles bare paths and /{siteSlug}/research-score prefixes.
 */
export function getResearchScoreRedirectPath(
  pathname: string,
): string | null {
  if (pathname === "/research-score" || pathname.startsWith("/research-score/")) {
    return pathname.replace(/^\/research-score/, "/about");
  }

  for (const slug of siteSlugs) {
    const prefix = `/${slug}/research-score`;
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return pathname.replace(prefix, `/${slug}/about`);
    }
  }

  return null;
}
