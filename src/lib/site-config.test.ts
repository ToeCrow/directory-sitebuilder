import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getArticleConfig,
  getEnabledHomepageSections,
  getSiteTheme,
  siteHasFeature,
  siteHasHomepageSection,
} from "./site-config";

describe("siteHasFeature", () => {
  it("returns true when the feature is enabled", () => {
    assert.equal(siteHasFeature("construction-software", "comparison"), true);
    assert.equal(siteHasFeature("side-sleeper", "about"), true);
    assert.equal(siteHasFeature("findworthnow", "catalog"), true);
  });

  it("returns false when the feature is disabled", () => {
    assert.equal(siteHasFeature("side-sleeper", "comparison"), false);
    assert.equal(siteHasFeature("findworthnow", "ads"), false);
    assert.equal(siteHasFeature("construction-software", "catalog"), false);
  });

  it("accepts a site object with a slug", () => {
    assert.equal(
      siteHasFeature({ slug: "side-sleeper" }, "product-nav"),
      true,
    );
  });

  it("treats articles as one content system on all three sites", () => {
    assert.equal(siteHasFeature("construction-software", "articles"), true);
    assert.equal(siteHasFeature("side-sleeper", "articles"), true);
    assert.equal(siteHasFeature("findworthnow", "articles"), true);
  });
});

describe("getArticleConfig", () => {
  it("exposes Reviews at /reviews for directory and review sites", () => {
    assert.deepEqual(getArticleConfig("construction-software"), {
      label: "Reviews",
      route: "reviews",
    });
    assert.deepEqual(getArticleConfig("side-sleeper"), {
      label: "Reviews",
      route: "reviews",
    });
  });

  it("exposes Blog at /blog for the editorial catalog site", () => {
    assert.deepEqual(getArticleConfig("findworthnow"), {
      label: "Blog",
      route: "blog",
    });
  });
});

describe("getSiteTheme", () => {
  it("returns the theme for each live site", () => {
    assert.equal(getSiteTheme("construction-software"), "default");
    assert.equal(getSiteTheme("side-sleeper"), "paper");
    assert.equal(getSiteTheme("findworthnow"), "editorial-dark");
  });
});

describe("getEnabledHomepageSections", () => {
  it("keeps the construction directory home composition", () => {
    assert.deepEqual(getEnabledHomepageSections("construction-software"), [
      "hero",
      "affiliate-disclosure",
      "top-picks",
      "ad-primary",
      "comparison",
      "product-directory",
      "ad-secondary",
      "faq",
      "featured-reviews",
    ]);
  });

  it("keeps the side sleeper review home composition", () => {
    assert.deepEqual(getEnabledHomepageSections("side-sleeper"), [
      "hero",
      "affiliate-disclosure",
      "featured-reviews",
      "faq",
    ]);
  });

  it("keeps the editorial catalog home composition", () => {
    assert.deepEqual(getEnabledHomepageSections("findworthnow"), [
      "hero",
      "category-grid",
      "blog-teasers",
    ]);
    assert.equal(siteHasHomepageSection("findworthnow", "category-grid"), true);
    assert.equal(siteHasHomepageSection("side-sleeper", "top-picks"), false);
  });
});
