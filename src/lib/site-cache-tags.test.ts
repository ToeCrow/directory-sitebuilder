import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SITES_LIST_CACHE_TAG, siteCacheTag } from "./site-cache-tags";

describe("siteCacheTag", () => {
  it("scopes invalidation to one site slug", () => {
    assert.equal(siteCacheTag("side-sleeper"), "site:side-sleeper");
    assert.notEqual(siteCacheTag("side-sleeper"), siteCacheTag("findworthnow"));
    assert.equal(SITES_LIST_CACHE_TAG, "sites:list");
  });
});
