import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/admin-auth";
import { getArticlesToReviewsRedirectPath } from "@/lib/articles-redirect";
import { getResearchScoreRedirectPath } from "@/lib/research-score-redirect";
import { getSiteSlugFromHost } from "@/lib/domain-map";
import {
  getCustomDomainRewritePath,
  getCustomDomainStripRedirectPath,
  shouldRewriteCustomDomainPath,
} from "@/lib/custom-domain";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const indexNowKey = process.env.INDEXNOW_KEY?.trim();
  if (indexNowKey && pathname === `/${indexNowKey}.txt`) {
    const url = request.nextUrl.clone();
    url.pathname = "/api/indexnow/key";
    return NextResponse.rewrite(url);
  }

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

    if (!isValidAdminSession(session)) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  const articlesRedirect = getArticlesToReviewsRedirectPath(pathname);
  if (articlesRedirect !== null) {
    const url = request.nextUrl.clone();
    url.pathname = articlesRedirect;
    return NextResponse.redirect(url, 308);
  }

  const researchScoreRedirect = getResearchScoreRedirectPath(pathname);
  if (researchScoreRedirect !== null) {
    const url = request.nextUrl.clone();
    url.pathname = researchScoreRedirect;
    return NextResponse.redirect(url, 308);
  }

  const host = request.headers.get("host") ?? "";
  const siteSlug = getSiteSlugFromHost(host);

  // Only mapped custom-domain hosts are rewritten / stripped.
  if (!siteSlug) {
    return NextResponse.next();
  }

  const stripped = getCustomDomainStripRedirectPath(pathname, siteSlug);
  if (stripped !== null) {
    const url = request.nextUrl.clone();
    url.pathname = stripped;
    return NextResponse.redirect(url, 308);
  }

  if (shouldRewriteCustomDomainPath(pathname, siteSlug)) {
    const url = request.nextUrl.clone();
    url.pathname = getCustomDomainRewritePath(pathname, siteSlug);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
