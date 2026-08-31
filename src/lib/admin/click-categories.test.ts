import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { AdminClickedLink } from "./clicks";
import {
  clicksAdminHref,
  filterClickedLinks,
  formatClickSource,
  formatClickTarget,
  getClickCategory,
  getClickCategoryLabel,
  parseClickPeriod,
  parseClickView,
  sortClickedLinks,
} from "./click-categories";

function row(
  overrides: Partial<AdminClickedLink> &
    Pick<AdminClickedLink, "placement" | "targetType" | "sourceType">,
): AdminClickedLink {
  return {
    id: "1",
    label: null,
    sourcePath: null,
    targetId: null,
    targetUrl: null,
    totalClicks: 0,
    clicks7d: 0,
    clicks30d: 0,
    siteSlug: "findworthnow",
    siteTitle: "FindWorthNow",
    ...overrides,
  };
}

describe("getClickCategory", () => {
  it("classifies known commercial CTAs", () => {
    for (const placement of [
      "product-card-cta",
      "catalog-hero-cta",
      "catalog-footer-cta",
      "hub-cta",
      "roundup-product-cta",
    ]) {
      assert.equal(
        getClickCategory({ placement, targetType: "product", sourceType: "page" }),
        "commercial",
        placement,
      );
    }
  });

  it("does not treat footer or header external links as commercial", () => {
    assert.equal(
      getClickCategory({
        placement: "footer-nav",
        targetType: "external",
        sourceType: "nav",
      }),
      "navigation",
    );
    assert.equal(
      getClickCategory({
        placement: "header-nav",
        targetType: "path",
        sourceType: "nav",
      }),
      "navigation",
    );
    assert.equal(
      getClickCategory({
        placement: "hero-cta",
        targetType: "path",
        sourceType: "page",
      }),
      "navigation",
    );
  });

  it("classifies article-to-article placements as engagement", () => {
    for (const placement of [
      "tiptap-internal-link",
      "related-articles",
      "related-articles-inline",
      "featured-guides",
    ]) {
      assert.equal(
        getClickCategory({ placement, targetType: "article", sourceType: "article" }),
        "engagement",
        placement,
      );
    }
  });

  it("classifies product exploration placements", () => {
    for (const placement of [
      "product-card",
      "catalog-card",
      "roundup-product-heading",
      "roundup-product-image",
    ]) {
      assert.equal(
        getClickCategory({ placement, targetType: "product", sourceType: "article" }),
        "product-exploration",
        placement,
      );
    }
  });

  it("falls back from targetType for unknown placements", () => {
    assert.equal(
      getClickCategory({
        placement: "future-affiliate-button",
        targetType: "external",
        sourceType: "article",
      }),
      "commercial",
    );
    assert.equal(
      getClickCategory({
        placement: "future-article-card",
        targetType: "article",
        sourceType: "page",
      }),
      "engagement",
    );
    assert.equal(
      getClickCategory({
        placement: "future-product-tile",
        targetType: "product",
        sourceType: "page",
      }),
      "product-exploration",
    );
    assert.equal(
      getClickCategory({
        placement: "mystery",
        targetType: "path",
        sourceType: "page",
      }),
      "other",
    );
  });
});

describe("getClickCategoryLabel", () => {
  it("uses admin tab labels", () => {
    assert.equal(getClickCategoryLabel("commercial"), "Commercial");
    assert.equal(getClickCategoryLabel("engagement"), "Internal links");
    assert.equal(getClickCategoryLabel("product-exploration"), "Product exploration");
    assert.equal(getClickCategoryLabel("navigation"), "Navigation");
    assert.equal(getClickCategoryLabel("all"), "All");
  });
});

describe("parseClickView / parseClickPeriod", () => {
  it("defaults to commercial and 7d", () => {
    assert.equal(parseClickView(undefined), "commercial");
    assert.equal(parseClickView("nope"), "commercial");
    assert.equal(parseClickPeriod(undefined), "7d");
    assert.equal(parseClickPeriod("30d"), "30d");
  });
});

describe("sortClickedLinks", () => {
  it("sorts by the selected period", () => {
    const rows = [
      row({ id: "a", placement: "hub-cta", targetType: "external", sourceType: "product", clicks7d: 1, clicks30d: 9, totalClicks: 9 }),
      row({ id: "b", placement: "hub-cta", targetType: "external", sourceType: "product", clicks7d: 5, clicks30d: 5, totalClicks: 40 }),
    ];
    assert.equal(sortClickedLinks(rows, "7d")[0]?.id, "b");
    assert.equal(sortClickedLinks(rows, "30d")[0]?.id, "a");
    assert.equal(sortClickedLinks(rows, "total")[0]?.id, "b");
  });
});

describe("filterClickedLinks", () => {
  it("keeps other rows only in All", () => {
    const rows = [
      row({ placement: "hub-cta", targetType: "external", sourceType: "product" }),
      row({ placement: "mystery", targetType: "path", sourceType: "page" }),
    ];
    assert.equal(filterClickedLinks(rows, "commercial").length, 1);
    assert.equal(filterClickedLinks(rows, "all").length, 2);
  });
});

describe("clicksAdminHref", () => {
  it("omits default commercial and 7d params", () => {
    assert.equal(clicksAdminHref({}), "/admin/clicks");
    assert.equal(
      clicksAdminHref({ site: "findworthnow", view: "navigation", period: "30d" }),
      "/admin/clicks?site=findworthnow&view=navigation&period=30d",
    );
  });
});

describe("formatClickSource / formatClickTarget", () => {
  it("prefers path and label over type", () => {
    assert.equal(
      formatClickSource(
        row({
          placement: "related-articles",
          targetType: "article",
          sourceType: "article",
          sourcePath: "/blog/sleep",
        }),
      ),
      "/blog/sleep",
    );
    assert.equal(
      formatClickTarget(
        row({
          placement: "hub-cta",
          targetType: "external",
          sourceType: "product",
          label: "Check price",
          targetUrl: "https://www.example.com/p/1",
        }),
      ),
      "Check price",
    );
  });
});
