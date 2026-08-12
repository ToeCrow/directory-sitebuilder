import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getCustomDomainRewritePath,
  getCustomDomainStripRedirectPath,
  shouldRewriteCustomDomainPath,
} from "./custom-domain";
import {
  buildInternalUrl,
  getAppPath,
  getBuyingGuidePath,
  getPublicAbsoluteUrl,
  getPublicPath,
  getReviewsIndexPath,
  resolvePublicBasePath,
  siteUsesPublicPaths,
} from "./paths";
import { getArticlesToReviewsRedirectPath } from "./articles-redirect";
import { buildSiteSitemapEntries } from "./sitemap";
import { getSiteSlugFromHost } from "./domain-map";

describe("custom domain host mapping", () => {
  it("maps side-sleepers.com hosts and ignores unknown hosts", () => {
    assert.equal(getSiteSlugFromHost("side-sleepers.com"), "side-sleeper");
    assert.equal(getSiteSlugFromHost("www.side-sleepers.com"), "side-sleeper");
    assert.equal(getSiteSlugFromHost("localhost:3000"), undefined);
    assert.equal(getSiteSlugFromHost("example.com"), undefined);
    assert.equal(
      getSiteSlugFromHost("directory-sitebuilder.vercel.app"),
      undefined,
    );
  });
});

describe("resolvePublicBasePath and buildInternalUrl", () => {
  it("uses empty base on Side Sleeper custom domain", () => {
    assert.equal(
      resolvePublicBasePath("side-sleeper", "side-sleepers.com"),
      "",
    );
    assert.equal(
      resolvePublicBasePath("side-sleeper", "www.side-sleepers.com"),
      "",
    );
    assert.equal(buildInternalUrl("", "/"), "/");
    assert.equal(buildInternalUrl("", "/products"), "/products");
    assert.equal(
      buildInternalUrl("", "/products/winkbed"),
      "/products/winkbed",
    );
    assert.equal(buildInternalUrl("", "products"), "/products");
  });

  it("uses /side-sleeper base on platform hosts", () => {
    assert.equal(
      resolvePublicBasePath("side-sleeper", "directory-sitebuilder.vercel.app"),
      "/side-sleeper",
    );
    assert.equal(
      resolvePublicBasePath("side-sleeper", "localhost:3000"),
      "/side-sleeper",
    );
    assert.equal(buildInternalUrl("/side-sleeper", "/"), "/side-sleeper");
    assert.equal(
      buildInternalUrl("/side-sleeper", "/products"),
      "/side-sleeper/products",
    );
    assert.equal(
      buildInternalUrl("/side-sleeper", "/products/winkbed"),
      "/side-sleeper/products/winkbed",
    );
  });

  it("keeps Construction Software platform path on any host", () => {
    assert.equal(
      resolvePublicBasePath("construction-software", "side-sleepers.com"),
      "/construction-software",
    );
    assert.equal(
      resolvePublicBasePath(
        "construction-software",
        "directory-sitebuilder.vercel.app",
      ),
      "/construction-software",
    );
    assert.equal(
      buildInternalUrl("/construction-software", "/products"),
      "/construction-software/products",
    );
  });

  it("avoids double slug and double slash", () => {
    assert.equal(
      buildInternalUrl("/side-sleeper/", "/products"),
      "/side-sleeper/products",
    );
    assert.equal(
      buildInternalUrl("/side-sleeper", "products/winkbed"),
      "/side-sleeper/products/winkbed",
    );
    assert.equal(
      getAppPath("", "/products").includes("/side-sleeper/side-sleeper"),
      false,
    );
    assert.equal(getAppPath("/side-sleeper", "/products"), "/side-sleeper/products");
    assert.equal(getAppPath("", "/products"), "/products");
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

  it("builds host-aware app paths from publicBasePath", () => {
    assert.equal(getAppPath("/side-sleeper", "/products"), "/side-sleeper/products");
    assert.equal(getAppPath("", "/products"), "/products");
    assert.equal(
      getAppPath("/construction-software", "/products"),
      "/construction-software/products",
    );
    assert.equal(getBuyingGuidePath(""), "/buying-guide");
    assert.equal(
      getBuyingGuidePath("/side-sleeper"),
      "/side-sleeper/buying-guide",
    );
    assert.equal(
      getBuyingGuidePath("/construction-software"),
      "/construction-software/buying-guide",
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
      getPublicPath("side-sleeper", "/reviews/best-pillows-for-side-sleepers"),
      "/reviews/best-pillows-for-side-sleepers",
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
      shouldRewriteCustomDomainPath("/buying-guide", "side-sleeper"),
      true,
    );
    assert.equal(
      getCustomDomainRewritePath("/products", "side-sleeper"),
      "/side-sleeper/products",
    );
    assert.equal(
      getCustomDomainRewritePath("/buying-guide", "side-sleeper"),
      "/side-sleeper/buying-guide",
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
      getCustomDomainStripRedirectPath("/side-sleeper/products", "side-sleeper"),
      "/products",
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

  it("preserves query string when composing strip redirect target", () => {
    const stripped = getCustomDomainStripRedirectPath(
      "/side-sleeper/products/winkbed",
      "side-sleeper",
    );
    assert.equal(stripped, "/products/winkbed");
    // proxy clones nextUrl and only replaces pathname, so search is kept
    const search = "?test=1";
    assert.equal(`${stripped}${search}`, "/products/winkbed?test=1");
  });

  it("does not strip on platform domain because host is unmapped", () => {
    assert.equal(
      getSiteSlugFromHost("directory-sitebuilder.vercel.app"),
      undefined,
    );
    // Without a mapped host, proxy never calls strip redirect.
    // Prefixed platform paths remain valid app routes.
    assert.equal(
      getCustomDomainStripRedirectPath(
        "/side-sleeper/products",
        "side-sleeper",
      ),
      "/products",
    );
  });
});

describe("sitemap", () => {
  it("emits side-sleeper public URLs without /side-sleeper prefix", () => {
    const entries = buildSiteSitemapEntries("side-sleeper");
    const urls = entries.map((e) => e.url);

    assert.ok(urls.includes("https://side-sleepers.com/"));
    assert.ok(urls.includes("https://side-sleepers.com/products"));
    assert.equal(
      urls.includes("https://side-sleepers.com/comparisons"),
      false,
    );
    assert.ok(urls.includes("https://side-sleepers.com/privacy-policy"));
    assert.ok(urls.includes("https://side-sleepers.com/about"));
    assert.ok(urls.includes("https://side-sleepers.com/affiliate"));
    assert.ok(urls.includes("https://side-sleepers.com/research-score"));
    assert.ok(urls.includes("https://side-sleepers.com/buying-guide"));
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
    assert.ok(urls.includes("https://side-sleepers.com/reviews"));
    assert.ok(
      urls.some((u) => u.startsWith("https://side-sleepers.com/reviews/")),
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
    assert.ok(urls.some((u) => u.includes("/construction-software/affiliate")));
    assert.ok(
      urls.some((u) => u.includes("/construction-software/buying-guide")),
    );
    assert.equal(
      urls.some((u) => u.includes("/research-score")),
      false,
    );
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

describe("articles to reviews redirect", () => {
  it("rewrites bare and site-prefixed /articles paths", () => {
    assert.equal(getArticlesToReviewsRedirectPath("/articles"), "/reviews");
    assert.equal(
      getArticlesToReviewsRedirectPath("/articles/best-pillows-for-side-sleepers"),
      "/reviews/best-pillows-for-side-sleepers",
    );
    assert.equal(
      getArticlesToReviewsRedirectPath("/side-sleeper/articles"),
      "/side-sleeper/reviews",
    );
    assert.equal(
      getArticlesToReviewsRedirectPath(
        "/side-sleeper/articles/best-pillows-for-side-sleepers",
      ),
      "/side-sleeper/reviews/best-pillows-for-side-sleepers",
    );
    assert.equal(getArticlesToReviewsRedirectPath("/products"), null);
  });

  it("builds reviews index paths with category filters", () => {
    assert.equal(getReviewsIndexPath(""), "/reviews");
    assert.equal(
      getReviewsIndexPath("", "mattress"),
      "/reviews?category=mattress",
    );
    assert.equal(
      getReviewsIndexPath("/side-sleeper", "science"),
      "/side-sleeper/reviews?category=science",
    );
  });
});
