/** Side Sleeper Guide’s branded scoring system (like IMDb Rating / TrustScore). */
export const RESEARCH_SCORE_LABEL = "Research Score";

export const RESEARCH_SCORE_HOWTO_LABEL =
  "How we calculate our Research Score";

type ResearchScoreSite = {
  slug: string;
  features?: { researchScorePage?: boolean };
};

/**
 * Prefer `features.researchScorePage` from hydrated SiteData when present;
 * fall back to the side-sleeper slug for static seed / legacy callers.
 */
export function siteUsesResearchScore(
  siteOrSlug: string | ResearchScoreSite,
): boolean {
  if (typeof siteOrSlug === "string") {
    return siteOrSlug === "side-sleeper";
  }

  if (siteOrSlug.features?.researchScorePage != null) {
    return siteOrSlug.features.researchScorePage;
  }

  return siteOrSlug.slug === "side-sleeper";
}

export function getResearchScorePath(siteSlug: string): string {
  return `/${siteSlug}/research-score`;
}

/** Always one decimal, e.g. "4.8 / 5". */
export function formatScoreValue(rating: number, scale: number): string {
  return `${rating.toFixed(1)} / ${scale}`;
}
