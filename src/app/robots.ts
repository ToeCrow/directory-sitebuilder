import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getSiteSlugFromHost } from "@/lib/domain-map";
import { getSiteBySlug as getStaticSiteBySlug } from "@/data/sites";

const DEFAULT_SITEMAP = "https://side-sleepers.com/sitemap.xml";

/** robots.txt uses static seed for siteUrl — no DB at build/request for this MVP helper. */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host") ?? "";
  const siteSlug = getSiteSlugFromHost(host);
  const siteData = siteSlug ? getStaticSiteBySlug(siteSlug) : undefined;

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
