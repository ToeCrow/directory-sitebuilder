/** Data-cache tags for published site hydrates. Keep in sync with getSiteData. */
export const SITES_LIST_CACHE_TAG = "sites:list";

export function siteCacheTag(siteSlug: string): string {
  return `site:${siteSlug}`;
}
