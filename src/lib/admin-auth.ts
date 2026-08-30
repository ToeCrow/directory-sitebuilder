/**
 * Admin session helpers — Web Crypto so proxy (Edge) and Node routes share one impl.
 * Cookie never stores ADMIN_PASSWORD.
 *
 * Access cookie: 15 minutes. Refresh cookie: 4 hours.
 * A valid refresh token can mint a new access token without the password.
 */

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_REFRESH_COOKIE = "admin_refresh";

export type AdminTokenKind = "access" | "refresh";

export const ACCESS_TTL_MS = 15 * 60 * 1000;
export const REFRESH_TTL_MS = 4 * 60 * 60 * 1000;
export const ACCESS_COOKIE_MAX_AGE_SECONDS = 15 * 60;
export const REFRESH_COOKIE_MAX_AGE_SECONDS = 4 * 60 * 60;

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be set to a string of at least 16 characters.",
    );
  }
  return secret;
}

function bytesToBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < view.length; i++) {
    binary += String.fromCharCode(view[i]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    out[i] = binary.charCodeAt(i);
  }
  return out;
}

async function importHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function signPayload(payload: string): Promise<string> {
  const key = await importHmacKey();
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return bytesToBase64Url(sig);
}

function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i]! ^ b[i]!;
  }
  return diff === 0;
}

function ttlForKind(kind: AdminTokenKind): number {
  return kind === "refresh" ? REFRESH_TTL_MS : ACCESS_TTL_MS;
}

export function adminCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: maxAgeSeconds,
  };
}

/** Create a signed session token (never stores ADMIN_PASSWORD). */
export async function createAdminSessionToken(
  kind: AdminTokenKind = "access",
  now: number = Date.now(),
): Promise<string> {
  const nonceBytes = new Uint8Array(16);
  crypto.getRandomValues(nonceBytes);
  const nonce = bytesToBase64Url(nonceBytes);
  const exp = now + ttlForKind(kind);
  const payload = `${nonce}.${exp}.${kind}`;
  const sig = await signPayload(payload);
  return `${payload}.${sig}`;
}

export async function isValidAdminToken(
  token: string | undefined,
  kind: AdminTokenKind,
  now: number = Date.now(),
): Promise<boolean> {
  if (!token) {
    return false;
  }

  // Reject legacy cookies that equal the password.
  if (process.env.ADMIN_PASSWORD && token === process.env.ADMIN_PASSWORD) {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 4) {
    return false;
  }

  const [nonce, expStr, tokenKind, sig] = parts;
  if (!nonce || !expStr || !tokenKind || !sig || tokenKind !== kind) {
    return false;
  }

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || now > exp) {
    return false;
  }

  const payload = `${nonce}.${expStr}.${tokenKind}`;
  let expected: string;
  try {
    expected = await signPayload(payload);
  } catch {
    return false;
  }

  try {
    return timingSafeEqualBytes(
      base64UrlToBytes(sig),
      base64UrlToBytes(expected),
    );
  } catch {
    return false;
  }
}

export async function isValidAdminSession(
  token: string | undefined,
): Promise<boolean> {
  return isValidAdminToken(token, "access");
}

export type AdminAuthResult =
  | { ok: true; newAccess?: string }
  | { ok: false };

export async function resolveAdminAuth(
  access: string | undefined,
  refresh: string | undefined,
  now: number = Date.now(),
): Promise<AdminAuthResult> {
  if (await isValidAdminToken(access, "access", now)) {
    return { ok: true };
  }
  if (await isValidAdminToken(refresh, "refresh", now)) {
    return {
      ok: true,
      newAccess: await createAdminSessionToken("access", now),
    };
  }
  return { ok: false };
}

export function verifyAdminPassword(password: string | undefined): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !password) {
    return false;
  }
  const a = new TextEncoder().encode(password);
  const b = new TextEncoder().encode(expected);
  return timingSafeEqualBytes(a, b);
}

/** For Server Actions — throws if not authenticated. */
export async function assertAdminSession(): Promise<void> {
  const { cookies } = await import("next/headers");
  const jar = await cookies();
  const access = jar.get(ADMIN_SESSION_COOKIE)?.value;
  const refresh = jar.get(ADMIN_REFRESH_COOKIE)?.value;
  const auth = await resolveAdminAuth(access, refresh);
  if (!auth.ok) {
    throw new Error("Unauthorized");
  }
}
