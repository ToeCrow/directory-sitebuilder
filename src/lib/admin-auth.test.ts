import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import {
  createAdminSessionToken,
  isValidAdminToken,
  resolveAdminAuth,
} from "./admin-auth";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

describe("admin access and refresh tokens", () => {
  const previousSecret = process.env.ADMIN_SESSION_SECRET;

  before(() => {
    process.env.ADMIN_SESSION_SECRET = "test-admin-session-secret";
  });

  after(() => {
    if (previousSecret === undefined) {
      delete process.env.ADMIN_SESSION_SECRET;
    } else {
      process.env.ADMIN_SESSION_SECRET = previousSecret;
    }
  });

  it("accepts an access token for 15 minutes and rejects it afterwards", async () => {
    const now = 1_700_000_000_000;
    const token = await createAdminSessionToken("access", now);
    assert.equal(await isValidAdminToken(token, "access", now), true);
    assert.equal(
      await isValidAdminToken(token, "access", now + 15 * MINUTE - 1),
      true,
    );
    assert.equal(
      await isValidAdminToken(token, "access", now + 15 * MINUTE + 1),
      false,
    );
  });

  it("accepts a refresh token for 4 hours and rejects it afterwards", async () => {
    const now = 1_700_000_000_000;
    const token = await createAdminSessionToken("refresh", now);
    assert.equal(await isValidAdminToken(token, "refresh", now + 4 * HOUR - 1), true);
    assert.equal(
      await isValidAdminToken(token, "refresh", now + 4 * HOUR + 1),
      false,
    );
  });

  it("does not treat an access token as a refresh token or vice versa", async () => {
    const now = 1_700_000_000_000;
    const access = await createAdminSessionToken("access", now);
    const refresh = await createAdminSessionToken("refresh", now);
    assert.equal(await isValidAdminToken(access, "refresh", now), false);
    assert.equal(await isValidAdminToken(refresh, "access", now), false);
  });

  it("rejects legacy 7-day session cookies", async () => {
    const now = 1_700_000_000_000;
    const legacy = await createAdminSessionToken("access", now);
    const parts = legacy.split(".");
    const withoutKind = `${parts[0]}.${parts[1]}.${parts[3]}`;
    assert.equal(await isValidAdminToken(withoutKind, "access", now), false);
  });

  it("mints a new access token from a valid refresh token", async () => {
    const now = 1_700_000_000_000;
    const refresh = await createAdminSessionToken("refresh", now);
    const afterAccessExpiry = now + 15 * MINUTE + 1;
    const result = await resolveAdminAuth(undefined, refresh, afterAccessExpiry);
    assert.equal(result.ok, true);
    assert.equal("newAccess" in result && Boolean(result.newAccess), true);
    if (result.ok && result.newAccess) {
      assert.equal(
        await isValidAdminToken(result.newAccess, "access", afterAccessExpiry),
        true,
      );
    }
  });
});
