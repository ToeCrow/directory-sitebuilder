// Temporary hardcoded map until domain → Site lives in PostgreSQL.
// Later replace with: const site = await getSiteByDomain(hostname);
export const DOMAIN_SITE_MAP: Record<string, string> = {
  "side-sleepers.com": "side-sleeper",
  "www.side-sleepers.com": "side-sleeper",
  "findworthnow.com": "findworthnow",
  "www.findworthnow.com": "findworthnow",
};

export function getSiteSlugFromHost(host: string): string | undefined {
  const hostname = host.split(":")[0]?.toLowerCase();
  if (!hostname) {
    return undefined;
  }
  return DOMAIN_SITE_MAP[hostname];
}

/** True when the pathname already starts with a known site slug segment. */
export function pathnameHasSiteSlugPrefix(pathname: string): boolean {
  const first = pathname.split("/").filter(Boolean)[0];
  if (!first) return false;
  return Object.values(DOMAIN_SITE_MAP).includes(first);
}
