import { buildSiteSitemapEntries } from "@/lib/sitemap";
import { getSiteBySlug } from "@/lib/site";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const KEY_PATTERN = /^[a-zA-Z0-9-]{8,128}$/;

/** Default live site for IndexNow submissions. */
export const INDEXNOW_DEFAULT_SITE_SLUG = "side-sleeper";

export type IndexNowSubmitResult = {
  ok: boolean;
  status: number;
  urlCount: number;
  host: string;
  body: string;
};

export function getIndexNowKey(): string | undefined {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) return undefined;
  if (!KEY_PATTERN.test(key)) {
    throw new Error(
      "INDEXNOW_KEY must be 8–128 characters (a-z, A-Z, 0-9, hyphen).",
    );
  }
  return key;
}

export function getIndexNowKeyLocation(siteUrl: string, key: string): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}/${key}.txt`;
}

export function getIndexNowUrlList(siteSlug: string): string[] {
  return buildSiteSitemapEntries(siteSlug).map((entry) => entry.url);
}

export function isAuthorizedIndexNowSubmit(authHeader: string | null): boolean {
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) return false;

  const allowed = [
    process.env.INDEXNOW_SUBMIT_SECRET?.trim(),
    process.env.CRON_SECRET?.trim(),
  ].filter((value): value is string => Boolean(value));

  return allowed.includes(token);
}

export type IndexNowSubmitOptions = {
  /** When set, only these URLs are submitted (e.g. newly added pages). */
  urlList?: string[];
};

export async function submitSiteToIndexNow(
  siteSlug: string = INDEXNOW_DEFAULT_SITE_SLUG,
  options: IndexNowSubmitOptions = {},
): Promise<IndexNowSubmitResult> {
  const key = getIndexNowKey();
  if (!key) {
    throw new Error("INDEXNOW_KEY is not configured");
  }

  const siteData = getSiteBySlug(siteSlug);
  if (!siteData) {
    throw new Error(`Unknown site slug: ${siteSlug}`);
  }

  const host = new URL(siteData.siteUrl).host;
  const urlList = options.urlList ?? getIndexNowUrlList(siteSlug);
  if (urlList.length === 0) {
    return {
      ok: true,
      status: 200,
      urlCount: 0,
      host,
      body: "No URLs to submit",
    };
  }

  const keyLocation = getIndexNowKeyLocation(siteData.siteUrl, key);

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key,
      keyLocation,
      urlList,
    }),
  });

  const body = await response.text();

  return {
    ok: response.ok || response.status === 202,
    status: response.status,
    urlCount: urlList.length,
    host,
    body,
  };
}

/** URLs present in `current` but not in `previous`. */
export function diffNewIndexNowUrls(
  current: string[],
  previous: string[],
): string[] {
  const prev = new Set(previous);
  return current.filter((url) => !prev.has(url));
}
