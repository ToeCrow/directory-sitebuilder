export const TRACKING_SOURCE_TYPES = [
  "page",
  "article",
  "product",
  "nav",
] as const;

export const TRACKING_TARGET_TYPES = [
  "article",
  "product",
  "path",
  "external",
] as const;

export type TrackingSourceType = (typeof TRACKING_SOURCE_TYPES)[number];
export type TrackingTargetType = (typeof TRACKING_TARGET_TYPES)[number];

export type TrackingRef = {
  type: string;
  id?: string;
};

export type LinkIdentityInput = {
  siteId: string;
  sourceType: string;
  sourceId?: string | null;
  sourcePath?: string | null;
  placement: string;
  targetType: string;
  targetId?: string | null;
  targetUrl?: string | null;
};

export type LinkIdentity = {
  siteId: string;
  sourceType: string;
  sourceId: string;
  sourcePath: string;
  placement: string;
  targetType: string;
  targetId: string;
  targetUrl: string;
};

export function normalizeTrackingPart(
  value: string | null | undefined,
): string {
  return (value ?? "").trim();
}

export function normalizeTargetUrl(
  value: string | null | undefined,
): string {
  const trimmed = normalizeTrackingPart(value);
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed, "https://example.invalid");
    url.hash = "";
    return url.href === trimmed || trimmed.startsWith("/")
      ? trimmed.split("#")[0] ?? trimmed
      : url.toString();
  } catch {
    return trimmed.split("#")[0] ?? trimmed;
  }
}

export function normalizeTrackingContext(
  input: LinkIdentityInput,
): LinkIdentity {
  const targetId = normalizeTrackingPart(input.targetId);
  return {
    siteId: normalizeTrackingPart(input.siteId),
    sourceType: normalizeTrackingPart(input.sourceType) || "page",
    sourceId: normalizeTrackingPart(input.sourceId),
    sourcePath: normalizeTrackingPart(input.sourcePath),
    placement: normalizeTrackingPart(input.placement),
    targetType: normalizeTrackingPart(input.targetType) || "path",
    targetId,
    targetUrl: targetId ? "" : normalizeTargetUrl(input.targetUrl),
  };
}

export function createLinkKey(input: LinkIdentityInput): string {
  const identity = normalizeTrackingContext(input);
  return [
    identity.siteId,
    identity.sourceType,
    identity.sourceId,
    identity.sourcePath,
    identity.placement,
    identity.targetType,
    identity.targetId,
    identity.targetUrl,
  ].join("|");
}

export function utcDateString(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function addUtcDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return utcDateString(date);
}

export function isTrackableClick(event: {
  button?: number;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  defaultPrevented?: boolean;
}): boolean {
  if (event.defaultPrevented) return false;
  if ((event.button ?? 0) !== 0) return false;
  return true;
}
