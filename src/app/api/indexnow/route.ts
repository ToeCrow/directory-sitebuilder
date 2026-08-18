import { NextResponse } from "next/server";
import {
  INDEXNOW_DEFAULT_SITE_SLUG,
  isAuthorizedIndexNowSubmit,
  submitSiteToIndexNow,
} from "@/lib/indexnow";

type SubmitBody = {
  urls?: string[];
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

  let urls: string[] | undefined;
  if (request.method === "POST") {
    try {
      const body = (await request.json()) as SubmitBody;
      if (Array.isArray(body.urls)) {
        urls = body.urls.filter(
          (url): url is string => typeof url === "string" && url.length > 0,
        );
      }
    } catch {
      // Empty / non-JSON body → submit full sitemap list
    }
  }

  try {
    const result = await submitSiteToIndexNow(INDEXNOW_DEFAULT_SITE_SLUG, {
      urlList: urls,
    });
    return NextResponse.json(
      {
        ok: result.ok,
        status: result.status,
        host: result.host,
        urlCount: result.urlCount,
        body: result.body || undefined,
      },
      { status: result.ok ? 200 : 502 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Submit failed";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

/** Manual re-run: submit full sitemap URL list. */
export async function GET(request: Request) {
  return handleSubmit(request);
}

/** Optional body `{ urls: string[] }` to submit only new pages. */
export async function POST(request: Request) {
  return handleSubmit(request);
}
