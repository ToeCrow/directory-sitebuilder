import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/admin-auth";
import { getSiteSlugFromHost } from "@/lib/domain-map";

// Future: replace cookie gate with Auth.js / Clerk proxy.

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

    if (!isValidAdminSession(session)) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Temporary: hardcoded domain → site rewrite until DB mapping exists.
  const host = request.headers.get("host") ?? "";
  const siteSlug = getSiteSlugFromHost(host);

  if (siteSlug && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${siteSlug}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin", "/admin/:path*"],
};
