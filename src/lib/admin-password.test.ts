import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hashPassword, verifyPassword } from "./admin-password";

describe("admin password hashing", () => {
  it("verifies a matching password and rejects a wrong one", async () => {
    const record = await hashPassword("correct-horse");
    assert.equal(record.kdf, "scrypt");
    assert.equal(record.salt.length > 0, true);
    assert.equal(record.hash.length > 0, true);
    assert.equal(record.salt === record.hash, false);
    assert.equal(
      await verifyPassword("correct-horse", record.salt, record.hash, record.kdf),
      true,
    );
    assert.equal(
      await verifyPassword("wrong-password", record.salt, record.hash, record.kdf),
      false,
    );
  });

  it("uses a unique salt per hash", async () => {
    const a = await hashPassword("same-password");
    const b = await hashPassword("same-password");
    assert.notEqual(a.salt, b.salt);
    assert.notEqual(a.hash, b.hash);
  });
});
