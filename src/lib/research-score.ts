/** Side Sleeper Guide’s branded scoring system (like IMDb Rating / TrustScore). */
export const RESEARCH_SCORE_LABEL = "Research Score";

export const RESEARCH_SCORE_HOWTO_LABEL =
  "How we calculate our Research Score";

/** Sites that use Research Score instead of a generic Rating label. */
export function siteUsesResearchScore(siteSlug: string): boolean {
  return siteSlug === "side-sleeper";
}

export function getResearchScorePath(siteSlug: string): string {
  return `/${siteSlug}/research-score`;
}

/** Always one decimal, e.g. "4.8 / 5". */
export function formatScoreValue(rating: number, scale: number): string {
  return `${rating.toFixed(1)} / ${scale}`;
}
