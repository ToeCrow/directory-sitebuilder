import { constructionSoftwareSite } from "./construction-software";
import type { SiteConfig } from "@/types/site";

export const sites = {
  "construction-software": constructionSoftwareSite,
} as const satisfies Record<string, SiteConfig>;

export type SiteId = keyof typeof sites;

export const siteIds = Object.keys(sites) as SiteId[];
