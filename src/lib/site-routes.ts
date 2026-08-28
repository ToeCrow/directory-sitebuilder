import {
  getArticleConfig,
  getConfiguredSiteSlugs,
  siteHasFeature,
  type SiteRef,
} from "@/lib/site-config";

export const SITE_ROUTE_KEYS = [
  "reviews",
  "blog",
  "catalog",
  "affiliate-disclosure",
  "product-detail",
  "buying-guide",
  "affiliate",
  "comparisons",
  "about",
  "privacy",
  "products",
] as const;

export type SiteRouteKey = (typeof SITE_ROUTE_KEYS)[number];

export type RouteAccess = "allow" | "not-found" | { redirect: "products" };

export function getRouteAccess(site: SiteRef, route: SiteRouteKey): RouteAccess {
  switch (route) {
    case "reviews":
      return getArticleConfig(site)?.route === "reviews" ? "allow" : "not-found";
    case "blog":
      return getArticleConfig(site)?.route === "blog" ? "allow" : "not-found";
    case "catalog":
      return siteHasFeature(site, "catalog") ? "allow" : "not-found";
    case "affiliate-disclosure":
      return siteHasFeature(site, "affiliate-disclosure") ? "allow" : "not-found";
    case "product-detail":
      return siteHasFeature(site, "products") && !siteHasFeature(site, "catalog")
        ? "allow"
        : "not-found";
    case "buying-guide":
      return siteHasFeature(site, "buying-guide") ? "allow" : "not-found";
    case "affiliate":
      return siteHasFeature(site, "affiliate") ? "allow" : "not-found";
    case "about":
      return siteHasFeature(site, "about") ? "allow" : "not-found";
    case "privacy":
      return siteHasFeature(site, "privacy") ? "allow" : "not-found";
    case "products":
      return siteHasFeature(site, "products") ? "allow" : "not-found";
    case "comparisons":
      if (siteHasFeature(site, "comparison")) {
        return "allow";
      }
      if (
        siteHasFeature(site, "products") &&
        !siteHasFeature(site, "catalog")
      ) {
        return { redirect: "products" };
      }
      return "not-found";
  }
}

export function canAccessRoute(site: SiteRef, route: SiteRouteKey): boolean {
  return getRouteAccess(site, route) === "allow";
}

export function getStaticParamSiteSlugsForRoute(
  route: SiteRouteKey,
  slugs: string[] = getConfiguredSiteSlugs(),
): string[] {
  return slugs.filter((slug) => {
    const access = getRouteAccess(slug, route);
    return access === "allow" || typeof access === "object";
  });
}
