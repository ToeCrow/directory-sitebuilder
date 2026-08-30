import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const SALT_BYTES = 16;
const KEY_LEN = 64;

export type PasswordRecord = {
  salt: string;
  hash: string;
  kdf: "scrypt";
};

export async function hashPassword(password: string): Promise<PasswordRecord> {
  const salt = randomBytes(SALT_BYTES);
  const derived = (await scryptAsync(password, salt, KEY_LEN)) as Buffer;
  return {
    salt: salt.toString("base64url"),
    hash: derived.toString("base64url"),
    kdf: "scrypt",
  };
}

export async function verifyPassword(
  password: string,
  salt: string,
  hash: string,
  kdf: string,
): Promise<boolean> {
  if (kdf !== "scrypt" || !password || !salt || !hash) {
    return false;
  }

  let saltBytes: Buffer;
  let expected: Buffer;
  try {
    saltBytes = Buffer.from(salt, "base64url");
    expected = Buffer.from(hash, "base64url");
  } catch {
    return false;
  }

  if (saltBytes.length === 0 || expected.length === 0) {
    return false;
  }

  const derived = (await scryptAsync(password, saltBytes, expected.length)) as Buffer;
  if (derived.length !== expected.length) {
    return false;
  }
  return timingSafeEqual(derived, expected);
}
