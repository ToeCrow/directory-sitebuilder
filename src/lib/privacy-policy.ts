import { siteHasFeature } from "@/lib/site-config";

export function siteUsesPrivacyPolicy(siteSlug: string): boolean {
  return siteHasFeature(siteSlug, "privacy");
}

/** Matches both public `/privacy-policy` and internal `/{siteSlug}/privacy-policy`. */
export function isPrivacyPolicyPath(pathname: string): boolean {
  return (
    pathname === "/privacy-policy" ||
    pathname.endsWith("/privacy-policy")
  );
}
