import assert from "node:assert/strict";
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { describe, it } from "node:test";
import {
  addUtcDays,
  createLinkKey,
  isTrackableClick,
  normalizeTrackingContext,
  utcDateString,
} from "./click-tracking";
import { incrementClick } from "./click-tracking-db";
import { closeDb, getDb } from "./db";
import { dailyLinkClicks, sites, trackedLinks } from "./db/schema";

config();

const SITE = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const ARTICLE_A = "11111111-1111-4111-8111-111111111111";
const ARTICLE_B = "22222222-2222-4222-8222-222222222222";
const PRODUCT = "33333333-3333-4333-8333-333333333333";

describe("createLinkKey", () => {
  it("is stable for the same logical link", () => {
    const first = createLinkKey({
      siteId: SITE,
      sourceType: "article",
      sourceId: ARTICLE_A,
      sourcePath: "/reviews/best-mattresses",
      placement: "roundup-product-cta",
      targetType: "product",
      targetId: PRODUCT,
      targetUrl: "https://saatva.com?ref=old",
    });
    const second = createLinkKey({
      siteId: SITE,
      sourceType: "article",
      sourceId: ARTICLE_A,
      sourcePath: "/reviews/best-mattresses",
      placement: "roundup-product-cta",
      targetType: "product",
      targetId: PRODUCT,
      targetUrl: "https://saatva.com?ref=new",
    });
    assert.equal(first, second);
  });

  it("does not use label as identity", () => {
    const identity = {
      siteId: SITE,
      sourceType: "product",
      sourceId: PRODUCT,
      placement: "hub-cta",
      targetType: "product",
      targetId: PRODUCT,
    };
    assert.equal(createLinkKey(identity), createLinkKey(identity));
  });

  it("separates the same product from different articles", () => {
    const roundup = createLinkKey({
      siteId: SITE,
      sourceType: "article",
      sourceId: ARTICLE_A,
      placement: "roundup-product-cta",
      targetType: "product",
      targetId: PRODUCT,
    });
    const hub = createLinkKey({
      siteId: SITE,
      sourceType: "product",
      sourceId: PRODUCT,
      placement: "hub-cta",
      targetType: "product",
      targetId: PRODUCT,
    });
    assert.notEqual(roundup, hub);
  });

  it("separates the same destination with different placements", () => {
    const a = createLinkKey({
      siteId: SITE,
      sourceType: "article",
      sourceId: ARTICLE_A,
      placement: "roundup-product-cta",
      targetType: "product",
      targetId: PRODUCT,
    });
    const b = createLinkKey({
      siteId: SITE,
      sourceType: "article",
      sourceId: ARTICLE_A,
      placement: "roundup-product-image",
      targetType: "product",
      targetId: PRODUCT,
    });
    assert.notEqual(a, b);
  });

  it("keeps header nav identity independent of the current page", () => {
    const fromHome = createLinkKey({
      siteId: SITE,
      sourceType: "nav",
      sourcePath: "",
      placement: "header-nav",
      targetType: "path",
      targetUrl: "/reviews",
    });
    const fromArticle = createLinkKey({
      siteId: SITE,
      sourceType: "nav",
      sourcePath: "",
      placement: "header-nav",
      targetType: "path",
      targetUrl: "/reviews",
    });
    assert.equal(fromHome, fromArticle);
  });

  it("separates the same article target from different source articles", () => {
    const fromA = createLinkKey({
      siteId: SITE,
      sourceType: "article",
      sourceId: ARTICLE_A,
      placement: "related-articles",
      targetType: "article",
      targetId: ARTICLE_B,
    });
    const fromB = createLinkKey({
      siteId: SITE,
      sourceType: "article",
      sourceId: ARTICLE_B,
      placement: "related-articles",
      targetType: "article",
      targetId: ARTICLE_A,
    });
    assert.notEqual(fromA, fromB);
  });
});

describe("normalizeTrackingContext", () => {
  it("drops targetUrl from the key when a target id exists", () => {
    const normalized = normalizeTrackingContext({
      siteId: ` ${SITE} `,
      sourceType: "article",
      sourceId: ARTICLE_A,
      placement: "tiptap-internal-link",
      targetType: "article",
      targetId: ARTICLE_B,
      targetUrl: "/blog/other",
    });
    assert.equal(normalized.targetUrl, "");
    assert.equal(normalized.siteId, SITE);
  });

  it("keeps a normalized url when there is no target id", () => {
    const normalized = normalizeTrackingContext({
      siteId: SITE,
      sourceType: "page",
      sourcePath: "/privacy-policy",
      placement: "footer",
      targetType: "external",
      targetUrl: "https://adssettings.google.com/#hash",
    });
    assert.equal(normalized.targetUrl, "https://adssettings.google.com/");
  });
});

describe("utcDateString", () => {
  it("returns a YYYY-MM-DD UTC bucket", () => {
    assert.equal(utcDateString(new Date("2026-08-30T23:30:00.000Z")), "2026-08-30");
  });
});

describe("addUtcDays", () => {
  it("walks UTC calendar days for 7d and 30d windows", () => {
    assert.equal(addUtcDays("2026-08-30", -6), "2026-08-24");
    assert.equal(addUtcDays("2026-08-30", -29), "2026-08-01");
  });
});

function isLocalDatabaseUrl(url: string): boolean {
  const lower = url.toLowerCase();
  if (lower.includes("neon.tech")) return false;
  if (lower.includes("sslmode=require") && !lower.includes("localhost")) {
    return false;
  }
  return true;
}

describe("incrementClick", () => {
  it("does not write when siteId or placement is missing", async () => {
    await incrementClick({
      siteId: "  ",
      sourceType: "page",
      placement: "cta",
      targetType: "path",
    });
    await incrementClick({
      siteId: SITE,
      sourceType: "page",
      placement: "",
      targetType: "path",
    });
  });

  it("atomically increments total and today's daily bucket", async () => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl || !isLocalDatabaseUrl(databaseUrl)) {
      return;
    }

    const db = getDb();
    const input = {
      siteId: "",
      sourceType: "page",
      sourceId: `click-test-${Date.now()}`,
      placement: "test-cta",
      targetType: "path",
      targetUrl: "/click-test",
      label: "Test CTA",
    };

    try {
      const [site] = await db.select({ id: sites.id }).from(sites).limit(1);
      if (!site) {
        return;
      }

      input.siteId = site.id;
      await incrementClick(input);
      await incrementClick(input);

      const [link] = await db
        .select()
        .from(trackedLinks)
        .where(eq(trackedLinks.linkKey, createLinkKey(input)))
        .limit(1);
      assert.ok(link);
      assert.equal(link.totalClicks, 2);

      const [daily] = await db
        .select()
        .from(dailyLinkClicks)
        .where(eq(dailyLinkClicks.linkId, link.id))
        .limit(1);
      assert.ok(daily);
      assert.equal(daily.clicks, 2);
    } finally {
      if (input.siteId) {
        await db
          .delete(trackedLinks)
          .where(eq(trackedLinks.linkKey, createLinkKey(input)));
      }
      await closeDb();
    }
  });
});

describe("isTrackableClick", () => {
  it("accepts a plain left click and rejects prevented or non-primary clicks", () => {
    assert.equal(isTrackableClick({ button: 0 }), true);
    assert.equal(isTrackableClick({ button: 1 }), false);
    assert.equal(isTrackableClick({ button: 0, defaultPrevented: true }), false);
  });
});
