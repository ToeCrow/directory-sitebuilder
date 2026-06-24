import { constructionManagementSite } from "./construction-management";
import type { SiteConfig } from "@/types/site";

export const sites = {
  "construction-management": constructionManagementSite,
} as const satisfies Record<string, SiteConfig>;

export type SiteId = keyof typeof sites;

export const siteIds = Object.keys(sites) as SiteId[];
