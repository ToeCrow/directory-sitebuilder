import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getCustomDomainRewritePath,
  getCustomDomainStripRedirectPath,
  shouldRewriteCustomDomainPath,
} from "./custom-domain";
import {
  getAppPath,
  getPublicAbsoluteUrl,
  getPublicPath,
  siteUsesPublicPaths,
} from "./paths";
import { buildSiteSitemapEntries } from "./sitemap";
import { getSiteSlugFromHost } from "./domain-map";

describe("custom domain host mapping", () => {
  it("maps side-sleepers.com hosts and ignores unknown hosts", () => {
    assert.equal(getSiteSlugFromHost("side-sleepers.com"), "side-sleeper");
    assert.equal(getSiteSlugFromHost("www.side-sleepers.com"), "side-sleeper");
    assert.equal(getSiteSlugFromHost("localhost:3000"), undefined);
    assert.equal(getSiteSlugFromHost("example.com"), undefined);
  });
});

describe("path helpers", () => {
  it("uses public paths without siteSlug for side-sleeper", () => {
    assert.equal(siteUsesPublicPaths("side-sleeper"), true);
    assert.equal(getPublicPath("side-sleeper", "/"), "/");
    assert.equal(getPublicPath("side-sleeper", "/products"), "/products");
    assert.equal(
      getPublicPath("side-sleeper", "/products/winkbed"),
      "/products/winkbed",
    );
    assert.equal(
      getPublicAbsoluteUrl(
        "side-sleeper",
        "https://side-sleepers.com",
        "/products/winkbed",
      ),
      "https://side-sleepers.com/products/winkbed",
    );
  });

  it("keeps app paths prefixed for routing", () => {
    assert.equal(
      getAppPath("side-sleeper", "/products"),
      "/side-sleeper/products",
    );
    assert.equal(
      getAppPath("construction-software", "/products"),
      "/construction-software/products",
    );
  });

  it("never puts siteSlug in side-sleeper public absolute URLs", () => {
    const url = getPublicAbsoluteUrl(
      "side-sleeper",
      "https://side-sleepers.com",
      "/comparisons",
    );
    assert.equal(url.includes("/side-sleeper/"), false);
  });
});

describe("canonical helpers", () => {
  it("side-sleeper product and comparison canonicals omit siteSlug", () => {
    assert.equal(getPublicPath("side-sleeper", "/products"), "/products");
    assert.equal(
      getPublicPath("side-sleeper", "/products/winkbed"),
      "/products/winkbed",
    );
    assert.equal(getPublicPath("side-sleeper", "/comparisons"), "/comparisons");
    assert.equal(
      getPublicPath("side-sleeper", "/articles/best-pillows-for-side-sleepers"),
      "/articles/best-pillows-for-side-sleepers",
    );
  });
});

describe("robots sitemap URL shape", () => {
  it("uses siteUrl/sitemap.xml without siteSlug for side-sleeper", () => {
    const siteUrl = "https://side-sleepers.com";
    const sitemap = `${siteUrl.replace(/\/$/, "")}/sitemap.xml`;
    assert.equal(sitemap, "https://side-sleepers.com/sitemap.xml");
    assert.equal(sitemap.includes("/side-sleeper/"), false);
  });
});

describe("custom domain rewrite helpers", () => {
  it("rewrites public paths on mapped hosts", () => {
    assert.equal(shouldRewriteCustomDomainPath("/", "side-sleeper"), true);
    assert.equal(
      shouldRewriteCustomDomainPath("/products", "side-sleeper"),
      true,
    );
    assert.equal(
      shouldRewriteCustomDomainPath("/products/winkbed", "side-sleeper"),
      true,
    );
    assert.equal(
      getCustomDomainRewritePath("/products", "side-sleeper"),
      "/side-sleeper/products",
    );
  });

  it("does not rewrite admin, api, next, sitemap, robots, favicon", () => {
    for (const path of [
      "/admin",
      "/admin/login",
      "/api/hello",
      "/_next/static/chunk.js",
      "/sitemap.xml",
      "/robots.txt",
      "/favicon.ico",
    ]) {
      assert.equal(
        shouldRewriteCustomDomainPath(path, "side-sleeper"),
        false,
        path,
      );
    }
  });

  it("avoids rewrite loops when path already has siteSlug", () => {
    assert.equal(
      shouldRewriteCustomDomainPath("/side-sleeper", "side-sleeper"),
      false,
    );
    assert.equal(
      shouldRewriteCustomDomainPath("/side-sleeper/products", "side-sleeper"),
      false,
    );
  });

  it("strips internal prefix on custom domain", () => {
    assert.equal(
      getCustomDomainStripRedirectPath("/side-sleeper", "side-sleeper"),
      "/",
    );
    assert.equal(
      getCustomDomainStripRedirectPath(
        "/side-sleeper/products/winkbed",
        "side-sleeper",
      ),
      "/products/winkbed",
    );
    assert.equal(
      getCustomDomainStripRedirectPath("/products", "side-sleeper"),
      null,
    );
  });
});

describe("sitemap", () => {
  it("emits side-sleeper public URLs without /side-sleeper prefix", () => {
    const entries = buildSiteSitemapEntries("side-sleeper");
    const urls = entries.map((e) => e.url);

    assert.ok(urls.includes("https://side-sleepers.com/"));
    assert.ok(urls.includes("https://side-sleepers.com/products"));
    assert.ok(urls.includes("https://side-sleepers.com/comparisons"));
    assert.ok(urls.includes("https://side-sleepers.com/privacy-policy"));
    assert.ok(urls.includes("https://side-sleepers.com/about"));
    assert.equal(
      urls.filter((u) => u === "https://side-sleepers.com/privacy-policy")
        .length,
      1,
    );
    assert.equal(
      urls.filter((u) => u === "https://side-sleepers.com/about").length,
      1,
    );
    assert.ok(
      urls.some((u) => u === "https://side-sleepers.com/products/winkbed"),
    );
    assert.ok(
      urls.some((u) => u.startsWith("https://side-sleepers.com/articles/")),
    );

    for (const url of urls) {
      assert.equal(
        url.includes("/side-sleeper/"),
        false,
        `unexpected prefix in ${url}`,
      );
      assert.equal(url.includes("?category="), false);
    }
  });

  it("keeps construction-software platform-style paths", () => {
    const entries = buildSiteSitemapEntries("construction-software");
    const urls = entries.map((e) => e.url);
    assert.ok(urls.some((u) => u.includes("/construction-software/products")));
    assert.equal(
      urls.some((u) => u.includes("/privacy-policy")),
      false,
    );
    assert.equal(
      urls.some((u) => u.endsWith("/about") || u.includes("/about")),
      false,
    );
  });
});
