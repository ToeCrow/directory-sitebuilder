import assert from "node:assert/strict";
import { describe, it, afterEach } from "node:test";
import {
  getIndexNowKey,
  getIndexNowKeyLocation,
  getIndexNowUrlList,
  isAuthorizedIndexNowSubmit,
  diffNewIndexNowUrls,
} from "./indexnow";

const originalEnv = { ...process.env };

afterEach(() => {
  for (const key of Object.keys(process.env)) {
    if (!(key in originalEnv)) {
      delete process.env[key];
    }
  }
  Object.assign(process.env, originalEnv);
});

describe("indexnow helpers", () => {
  it("builds keyLocation at site root", () => {
    assert.equal(
      getIndexNowKeyLocation(
        "https://side-sleepers.com",
        "abc12345def67890",
      ),
      "https://side-sleepers.com/abc12345def67890.txt",
    );
    assert.equal(
      getIndexNowKeyLocation(
        "https://side-sleepers.com/",
        "abc12345def67890",
      ),
      "https://side-sleepers.com/abc12345def67890.txt",
    );
  });

  it("urlList matches sitemap public URLs without siteSlug prefix", () => {
    const urls = getIndexNowUrlList("side-sleeper");
    assert.ok(urls.includes("https://side-sleepers.com/"));
    assert.ok(urls.includes("https://side-sleepers.com/buying-guide"));
    assert.ok(urls.includes("https://side-sleepers.com/products"));
    assert.ok(urls.some((u) => u.startsWith("https://side-sleepers.com/reviews/")));
    for (const url of urls) {
      assert.equal(
        url.includes("/side-sleeper/"),
        false,
        `unexpected prefix in ${url}`,
      );
    }
  });

  it("validates INDEXNOW_KEY format", () => {
    process.env.INDEXNOW_KEY = "short";
    assert.throws(() => getIndexNowKey(), /8–128/);

    process.env.INDEXNOW_KEY = "valid-key-12345678";
    assert.equal(getIndexNowKey(), "valid-key-12345678");

    delete process.env.INDEXNOW_KEY;
    assert.equal(getIndexNowKey(), undefined);
  });

  it("accepts Bearer INDEXNOW_SUBMIT_SECRET or CRON_SECRET", () => {
    process.env.INDEXNOW_SUBMIT_SECRET = "submit-secret";
    process.env.CRON_SECRET = "cron-secret";

    assert.equal(isAuthorizedIndexNowSubmit(null), false);
    assert.equal(isAuthorizedIndexNowSubmit("Bearer "), false);
    assert.equal(isAuthorizedIndexNowSubmit("Bearer wrong"), false);
    assert.equal(
      isAuthorizedIndexNowSubmit("Bearer submit-secret"),
      true,
    );
    assert.equal(isAuthorizedIndexNowSubmit("Bearer cron-secret"), true);
  });

  it("diffs only newly added URLs", () => {
    assert.deepEqual(
      diffNewIndexNowUrls(
        [
          "https://side-sleepers.com/",
          "https://side-sleepers.com/products/new",
        ],
        ["https://side-sleepers.com/"],
      ),
      ["https://side-sleepers.com/products/new"],
    );
    assert.deepEqual(
      diffNewIndexNowUrls(
        ["https://side-sleepers.com/"],
        ["https://side-sleepers.com/"],
      ),
      [],
    );
  });
});
