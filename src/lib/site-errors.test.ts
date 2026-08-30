import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isMissingSiteError } from "./site";

describe("isMissingSiteError", () => {
  it("treats missing and unpublished sites as empty, not connection failures", () => {
    assert.equal(isMissingSiteError(new Error("Site not found: side-sleeper")), true);
    assert.equal(
      isMissingSiteError(new Error("Site is not published: side-sleeper")),
      true,
    );
    assert.equal(
      isMissingSiteError(new Error("POSTGRES_URL or DATABASE_URL is not set.")),
      false,
    );
    assert.equal(isMissingSiteError(new Error("prepared statement \"s0\" does not exist")), false);
  });
});
