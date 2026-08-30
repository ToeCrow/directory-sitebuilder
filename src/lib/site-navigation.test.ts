import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getSiteNavigation } from "./site-navigation";

const catalogCategories = [
  { slug: "sleep", name: "Sleep" },
  { slug: "dental-health", name: "Dental Health" },
];

describe("getSiteNavigation", () => {
  it("shows Reviews linking to /reviews when articleConfig.route is reviews", () => {
    const nav = getSiteNavigation({
      site: "side-sleeper",
      publicBasePath: "",
      hasArticles: true,
    });

    assert.equal(nav.articles?.label, "Reviews");
    assert.equal(nav.articles?.href, "/reviews");
    assert.equal(
      nav.primaryLinks.some((link) => link.label === "Blog"),
      false,
    );
  });

  it("shows Blog linking to /blog when articleConfig.route is blog", () => {
    const nav = getSiteNavigation({
      site: "findworthnow",
      publicBasePath: "",
      hasArticles: true,
      catalogCategories,
    });

    assert.deepEqual(nav.primaryLinks, [{ href: "/blog", label: "Blog" }]);
    assert.equal(nav.articles, undefined);
  });

  it("hides comparison when the comparison feature is disabled", () => {
    const sideSleeper = getSiteNavigation({
      site: "side-sleeper",
      publicBasePath: "",
      hasArticles: true,
    });
    const construction = getSiteNavigation({
      site: "construction-software",
      publicBasePath: "/construction-software",
      hasArticles: true,
    });

    assert.equal(
      sideSleeper.primaryLinks.some((link) => link.label === "Compare"),
      false,
    );
    assert.deepEqual(
      construction.primaryLinks.map((link) => link.label),
      ["Compare", "Buying Guide", "FAQ"],
    );
  });

  it("hides the reviews dropdown when there is no article content", () => {
    const nav = getSiteNavigation({
      site: "construction-software",
      publicBasePath: "/construction-software",
      hasArticles: false,
    });
    assert.equal(nav.articles, undefined);
  });

  it("does not show a products dropdown on the directory preset", () => {
    const nav = getSiteNavigation({
      site: "construction-software",
      publicBasePath: "/construction-software",
      hasArticles: true,
    });
    assert.equal(nav.products, undefined);
  });
});
