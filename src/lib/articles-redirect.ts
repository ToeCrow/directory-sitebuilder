import { siteSlugs } from "@/data/sites";

/**
 * Map legacy /articles paths to /reviews (308).
 * Handles bare paths and /{siteSlug}/articles prefixes.
 */
export function getArticlesToReviewsRedirectPath(
  pathname: string,
): string | null {
  if (pathname === "/articles" || pathname.startsWith("/articles/")) {
    return pathname.replace(/^\/articles/, "/reviews");
  }

  for (const slug of siteSlugs) {
    const prefix = `/${slug}/articles`;
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return pathname.replace(prefix, `/${slug}/reviews`);
    }
  }

  return null;
}
