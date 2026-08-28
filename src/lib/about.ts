import { siteHasFeature } from "@/lib/site-config";

export function siteUsesAboutPage(siteSlug: string): boolean {
  return siteHasFeature(siteSlug, "about");
}
