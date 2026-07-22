import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getSiteSlugFromHost } from "@/lib/domain-map";
import {
  buildAllSitesSitemapEntries,
  buildSiteSitemapEntries,
} from "@/lib/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = (await headers()).get("host") ?? "";
  const siteSlug = getSiteSlugFromHost(host);

  if (siteSlug) {
    return buildSiteSitemapEntries(siteSlug);
  }

  return buildAllSitesSitemapEntries();
}
