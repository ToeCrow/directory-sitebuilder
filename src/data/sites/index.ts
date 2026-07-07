// Future: replace static imports with PostgreSQL query via pg + Flyway migrations.

import { siteData as constructionSoftware } from "./construction-software";
import { siteData as sideSleeper } from "./side-sleeper";
import type { SiteData } from "@/types/site";

const sites = {
  "construction-software": constructionSoftware,
  "side-sleeper": sideSleeper,
} as const;

export type SiteSlug = keyof typeof sites;

export const siteSlugs = Object.keys(sites) as SiteSlug[];

export function getSiteBySlug(slug: string): SiteData | undefined {
  if (slug in sites) {
    return sites[slug as SiteSlug];
  }
  return undefined;
}

export function getAllSites(): SiteData[] {
  return siteSlugs.map((slug) => sites[slug]);
}

export function isValidSiteSlug(slug: string): slug is SiteSlug {
  return slug in sites;
}
