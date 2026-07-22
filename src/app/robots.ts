import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getSiteSlugFromHost } from "@/lib/domain-map";
import { getSiteBySlug } from "@/lib/site";

const DEFAULT_SITEMAP = "https://side-sleepers.com/sitemap.xml";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host") ?? "";
  const siteSlug = getSiteSlugFromHost(host);
  const siteData = siteSlug ? getSiteBySlug(siteSlug) : undefined;

  const sitemap = siteData
    ? `${siteData.siteUrl.replace(/\/$/, "")}/sitemap.xml`
    : DEFAULT_SITEMAP;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap,
  };
}
