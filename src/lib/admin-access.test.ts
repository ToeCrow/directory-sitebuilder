import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  requestedSiteSlugOrDenied,
  userCanAccessSite,
  type AdminUser,
} from "./admin-access";

const superadmin: AdminUser = {
  id: "1",
  username: "ToeCrow",
  displayName: "Thomas",
  role: "superadmin",
  siteSlugs: [],
  profile: {},
};

const admin: AdminUser = {
  id: "2",
  username: "DaMaNi",
  displayName: "George",
  role: "admin",
  siteSlugs: ["construction-software", "side-sleeper"],
  profile: {},
};

describe("userCanAccessSite", () => {
  it("lets a superadmin into every site", () => {
    assert.equal(userCanAccessSite(superadmin, "findworthnow"), true);
    assert.equal(userCanAccessSite(superadmin, "side-sleeper"), true);
  });

  it("limits an admin to granted site slugs", () => {
    assert.equal(userCanAccessSite(admin, "construction-software"), true);
    assert.equal(userCanAccessSite(admin, "side-sleeper"), true);
    assert.equal(userCanAccessSite(admin, "findworthnow"), false);
    assert.equal(userCanAccessSite(admin, null), false);
  });
});

describe("requestedSiteSlugOrDenied", () => {
  it("returns null when the requested site is out of reach", () => {
    assert.equal(requestedSiteSlugOrDenied(admin, "findworthnow"), null);
    assert.equal(
      requestedSiteSlugOrDenied(admin, "side-sleeper"),
      "side-sleeper",
    );
    assert.equal(requestedSiteSlugOrDenied(admin, undefined), undefined);
  });
});
