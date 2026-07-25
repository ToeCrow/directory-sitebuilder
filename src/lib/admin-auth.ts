/**
 * Admin session helpers — Web Crypto so proxy (Edge) and Node routes share one impl.
 * Cookie never stores ADMIN_PASSWORD.
 */

export const ADMIN_SESSION_COOKIE = "admin_session";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

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

/** Create a signed session token (never stores ADMIN_PASSWORD). */
export async function createAdminSessionToken(): Promise<string> {
  const nonceBytes = new Uint8Array(16);
  crypto.getRandomValues(nonceBytes);
  const nonce = bytesToBase64Url(nonceBytes);
  const exp = Date.now() + SESSION_TTL_MS;
  const payload = `${nonce}.${exp}`;
  const sig = await signPayload(payload);
  return `${payload}.${sig}`;
}

export async function isValidAdminSession(
  token: string | undefined,
): Promise<boolean> {
  if (!token) {
    return false;
  }

  // Reject legacy cookies that equal the password.
  if (process.env.ADMIN_PASSWORD && token === process.env.ADMIN_PASSWORD) {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }

  const [nonce, expStr, sig] = parts;
  if (!nonce || !expStr || !sig) {
    return false;
  }

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) {
    return false;
  }

  const payload = `${nonce}.${expStr}`;
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
  const token = jar.get(ADMIN_SESSION_COOKIE)?.value;
  if (!(await isValidAdminSession(token))) {
    throw new Error("Unauthorized");
  }
}
