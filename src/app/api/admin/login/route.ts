import { NextResponse } from "next/server";
import {
  ACCESS_COOKIE_MAX_AGE_SECONDS,
  ADMIN_REFRESH_COOKIE,
  ADMIN_SESSION_COOKIE,
  REFRESH_COOKIE_MAX_AGE_SECONDS,
  adminCookieOptions,
  createAdminSessionToken,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  let password: string | undefined;
  try {
    const body = (await request.json()) as { password?: string };
    password = body.password;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  let access: string;
  let refresh: string;
  try {
    access = await createAdminSessionToken("access");
    refresh = await createAdminSessionToken("refresh");
  } catch (error) {
    const missingSecret =
      error instanceof Error && error.message.includes("ADMIN_SESSION_SECRET");
    return NextResponse.json(
      {
        error: missingSecret
          ? "ADMIN_SESSION_SECRET must be set (at least 16 characters) for this Vercel environment"
          : "Server misconfigured",
      },
      { status: 500 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    access,
    adminCookieOptions(ACCESS_COOKIE_MAX_AGE_SECONDS),
  );
  response.cookies.set(
    ADMIN_REFRESH_COOKIE,
    refresh,
    adminCookieOptions(REFRESH_COOKIE_MAX_AGE_SECONDS),
  );

  return response;
}
