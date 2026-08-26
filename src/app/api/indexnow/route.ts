import { NextResponse } from "next/server";
import {
  INDEXNOW_SITE_SLUGS,
  indexNowSiteSlugForUrl,
  isAuthorizedIndexNowSubmit,
  isIndexNowSiteSlug,
  submitSiteToIndexNow,
} from "@/lib/indexnow";

type SubmitBody = {
  urls?: string[];
  site?: string;
};

async function handleSubmit(request: Request) {
  if (!isAuthorizedIndexNowSubmit(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.INDEXNOW_KEY?.trim()) {
    return NextResponse.json(
      { error: "INDEXNOW_KEY is not configured" },
      { status: 503 },
    );
  }

  const requestedSite = new URL(request.url).searchParams.get("site");
  let urls: string[] | undefined;
  let bodySite: string | undefined;

  if (request.method === "POST") {
    try {
      const body = (await request.json()) as SubmitBody;
      if (Array.isArray(body.urls)) {
        urls = body.urls.filter(
          (url): url is string => typeof url === "string" && url.length > 0,
        );
      }
      if (typeof body.site === "string") {
        bodySite = body.site;
      }
    } catch {
      // Empty / non-JSON body → submit full sitemap list
    }
  }

  const siteFilter = requestedSite || bodySite;
  if (siteFilter && !isIndexNowSiteSlug(siteFilter)) {
    return NextResponse.json({ error: "Unknown IndexNow site" }, { status: 400 });
  }

  const siteSlugs = siteFilter
    ? INDEXNOW_SITE_SLUGS.filter((slug) => slug === siteFilter)
    : [...INDEXNOW_SITE_SLUGS];

  try {
    const results = [];

    if (urls?.length) {
      const urlsBySite = new Map<string, string[]>();
      for (const url of urls) {
        const siteSlug = indexNowSiteSlugForUrl(url);
        if (!siteSlug || !siteSlugs.includes(siteSlug)) continue;
        const list = urlsBySite.get(siteSlug) ?? [];
        list.push(url);
        urlsBySite.set(siteSlug, list);
      }

      for (const siteSlug of siteSlugs) {
        const siteUrls = urlsBySite.get(siteSlug);
        if (!siteUrls?.length) continue;
        results.push(await submitSiteToIndexNow(siteSlug, { urlList: siteUrls }));
      }
    } else {
      for (const siteSlug of siteSlugs) {
        results.push(await submitSiteToIndexNow(siteSlug));
      }
    }

    const ok = results.length === 0 || results.every((result) => result.ok);
    return NextResponse.json(
      {
        ok,
        results: results.map((result) => ({
          ok: result.ok,
          status: result.status,
          host: result.host,
          urlCount: result.urlCount,
          body: result.body || undefined,
        })),
      },
      { status: ok ? 200 : 502 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Submit failed";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

/** Manual re-run: submit full sitemap URL list for IndexNow sites. */
export async function GET(request: Request) {
  return handleSubmit(request);
}

/** Optional body `{ urls: string[], site?: string }` to submit specific pages. */
export async function POST(request: Request) {
  return handleSubmit(request);
}
