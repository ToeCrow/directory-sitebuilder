import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canAccessRoute,
  getRouteAccess,
  getStaticParamSiteSlugsForRoute,
} from "./site-routes";

describe("getRouteAccess", () => {
  it("allows /reviews only when articleConfig.route is reviews", () => {
    assert.equal(getRouteAccess("construction-software", "reviews"), "allow");
    assert.equal(getRouteAccess("side-sleeper", "reviews"), "allow");
    assert.equal(getRouteAccess("findworthnow", "reviews"), "not-found");
  });

  it("allows /blog only when articleConfig.route is blog", () => {
    assert.equal(getRouteAccess("findworthnow", "blog"), "allow");
    assert.equal(getRouteAccess("construction-software", "blog"), "not-found");
    assert.equal(getRouteAccess("side-sleeper", "blog"), "not-found");
  });

  it("allows comparison pages only when the comparison feature is on", () => {
    assert.equal(getRouteAccess("construction-software", "comparisons"), "allow");
    assert.deepEqual(getRouteAccess("side-sleeper", "comparisons"), {
      redirect: "products",
    });
    assert.equal(getRouteAccess("findworthnow", "comparisons"), "not-found");
  });

  it("gates about, privacy, catalog, and affiliate routes by feature", () => {
    assert.equal(canAccessRoute("side-sleeper", "about"), true);
    assert.equal(canAccessRoute("construction-software", "about"), false);
    assert.equal(canAccessRoute("side-sleeper", "privacy"), true);
    assert.equal(canAccessRoute("findworthnow", "catalog"), true);
    assert.equal(canAccessRoute("findworthnow", "affiliate-disclosure"), true);
    assert.equal(canAccessRoute("side-sleeper", "affiliate"), true);
    assert.equal(canAccessRoute("findworthnow", "buying-guide"), false);
    assert.equal(canAccessRoute("findworthnow", "product-detail"), false);
    assert.equal(canAccessRoute("side-sleeper", "product-detail"), true);
  });
});

describe("getStaticParamSiteSlugsForRoute", () => {
  it("includes redirecting sites so retired comparison URLs still resolve", () => {
    assert.deepEqual(getStaticParamSiteSlugsForRoute("comparisons"), [
      "construction-software",
      "side-sleeper",
    ]);
  });

  it("lists only sites whose article route matches", () => {
    assert.deepEqual(getStaticParamSiteSlugsForRoute("blog"), ["findworthnow"]);
    assert.deepEqual(getStaticParamSiteSlugsForRoute("reviews"), [
      "construction-software",
      "side-sleeper",
    ]);
  });
});
