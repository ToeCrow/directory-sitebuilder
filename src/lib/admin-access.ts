export type AdminRole = "superadmin" | "admin";

export type AdminUser = {
  id: string;
  username: string;
  displayName: string;
  role: AdminRole;
  siteSlugs: string[];
  profile: Record<string, unknown>;
};

export function userCanAccessSite(
  user: Pick<AdminUser, "role" | "siteSlugs">,
  slug: string | null | undefined,
): boolean {
  if (!slug) {
    return false;
  }
  if (user.role === "superadmin") {
    return true;
  }
  return user.siteSlugs.includes(slug);
}

export function requestedSiteSlugOrDenied(
  user: Pick<AdminUser, "role" | "siteSlugs">,
  requested?: string,
): string | undefined | null {
  if (!requested) {
    return undefined;
  }
  return userCanAccessSite(user, requested) ? requested : null;
}
