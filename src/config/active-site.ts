import { sites, type SiteId } from "@/config/sites";

const DEFAULT_SITE_ID: SiteId = "construction-management";

/**
 * Which site to build is controlled by the SITE env var at build/dev time.
 * Add a new entry in src/config/sites/ and set SITE=<id> to build that directory.
 *
 * Example: SITE=construction-management npm run dev
 */
export function getActiveSiteId(): SiteId {
  const siteId = process.env.SITE as SiteId | undefined;

  if (siteId && siteId in sites) {
    return siteId;
  }

  return DEFAULT_SITE_ID;
}

export function getSiteConfig() {
  return sites[getActiveSiteId()];
}

/** Active site config for the current build. */
export const siteConfig = getSiteConfig();
