// Temporary hardcoded map until domain → Site lives in PostgreSQL.
// Later replace with: const site = await getSiteByDomain(hostname);
const DOMAIN_SITE_MAP: Record<string, string> = {
  "side-sleepers.com": "side-sleeper",
  "www.side-sleepers.com": "side-sleeper",
};

export function getSiteSlugFromHost(host: string): string | undefined {
  const hostname = host.split(":")[0]?.toLowerCase();
  if (!hostname) {
    return undefined;
  }
  return DOMAIN_SITE_MAP[hostname];
}
