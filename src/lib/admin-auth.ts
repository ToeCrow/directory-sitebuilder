export const ADMIN_SESSION_COOKIE = "admin_session";

// Future: replace with Auth.js / Clerk session validation.

export function isValidAdminSession(token: string | undefined): boolean {
  const password = process.env.ADMIN_PASSWORD;

  if (!password || !token) {
    return false;
  }

  return token === password;
}
