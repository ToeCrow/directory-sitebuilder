/** Side Sleeper Guide is the only site with a dedicated privacy policy page. */
export function siteUsesPrivacyPolicy(siteSlug: string): boolean {
  return siteSlug === "side-sleeper";
}

/** Matches both public `/privacy-policy` and internal `/{siteSlug}/privacy-policy`. */
export function isPrivacyPolicyPath(pathname: string): boolean {
  return (
    pathname === "/privacy-policy" ||
    pathname.endsWith("/privacy-policy")
  );
}
