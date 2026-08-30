import { NextResponse } from "next/server";
import {
  ACCESS_COOKIE_MAX_AGE_SECONDS,
  ADMIN_REFRESH_COOKIE,
  ADMIN_SESSION_COOKIE,
  REFRESH_COOKIE_MAX_AGE_SECONDS,
  adminCookieOptions,
  createAdminSessionToken,
} from "@/lib/admin-auth";
import { authenticateAdmin } from "@/lib/admin/session";

export async function POST(request: Request) {
  let username: string | undefined;
  let password: string | undefined;
  try {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
    };
    username = body.username;
    password = body.password;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!username?.trim() || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 },
    );
  }

  let user;
  try {
    user = await authenticateAdmin(username, password);
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

  if (!user) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 },
    );
  }

  let access: string;
  let refresh: string;
  try {
    access = await createAdminSessionToken("access", user.id);
    refresh = await createAdminSessionToken("refresh", user.id);
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
