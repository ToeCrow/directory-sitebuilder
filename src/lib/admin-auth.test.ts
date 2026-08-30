import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import {
  createAdminSessionToken,
  isValidAdminToken,
  parseAdminTokenUserId,
  resolveAdminAuth,
} from "./admin-auth";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const USER_ID = "11111111-1111-4111-8111-111111111111";

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
    const token = await createAdminSessionToken("access", USER_ID, now);
    assert.equal(parseAdminTokenUserId(token), USER_ID);
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
    const token = await createAdminSessionToken("refresh", USER_ID, now);
    assert.equal(
      await isValidAdminToken(token, "refresh", now + 4 * HOUR - 1),
      true,
    );
    assert.equal(
      await isValidAdminToken(token, "refresh", now + 4 * HOUR + 1),
      false,
    );
  });

  it("does not treat an access token as a refresh token or vice versa", async () => {
    const now = 1_700_000_000_000;
    const access = await createAdminSessionToken("access", USER_ID, now);
    const refresh = await createAdminSessionToken("refresh", USER_ID, now);
    assert.equal(await isValidAdminToken(access, "refresh", now), false);
    assert.equal(await isValidAdminToken(refresh, "access", now), false);
  });

  it("rejects tokens without a user id", async () => {
    const now = 1_700_000_000_000;
    const current = await createAdminSessionToken("access", USER_ID, now);
    const parts = current.split(".");
    const fourPart = `${parts[0]}.${parts[1]}.${parts[2]}.${parts[4]}`;
    assert.equal(await isValidAdminToken(fourPart, "access", now), false);
  });

  it("mints a new access token from a valid refresh token", async () => {
    const now = 1_700_000_000_000;
    const refresh = await createAdminSessionToken("refresh", USER_ID, now);
    const afterAccessExpiry = now + 15 * MINUTE + 1;
    const result = await resolveAdminAuth(undefined, refresh, afterAccessExpiry);
    assert.equal(result.ok, true);
    assert.equal("newAccess" in result && Boolean(result.newAccess), true);
    if (result.ok && result.newAccess) {
      assert.equal(result.userId, USER_ID);
      assert.equal(
        await isValidAdminToken(result.newAccess, "access", afterAccessExpiry),
        true,
      );
    }
  });
});
