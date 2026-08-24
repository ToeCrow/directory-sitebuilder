import assert from "node:assert/strict";
import { describe, it, afterEach } from "node:test";
import { buildSiteSitemapEntries } from "./sitemap";
import {
  applyPublicTemplateFallback,
  diffIndexNowSnapshots,
  getIndexNowKey,
  getIndexNowKeyLocation,
  getIndexNowUrlList,
  getIndexNowUrlSnapshots,
  indexNowUrlsToSubmit,
  isAuthorizedIndexNowSubmit,
  isPublicSiteTemplatePath,
  pageTemplateHasCopyChange,
  parseIndexNowSnapshotList,
  type IndexNowUrlSnapshot,
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

function snap(url: string, fingerprint: string): IndexNowUrlSnapshot {
  return { url, fingerprint };
}

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

  it("snapshots match sitemap URLs and are stable", () => {
    const first = getIndexNowUrlSnapshots("side-sleeper");
    const second = getIndexNowUrlSnapshots("side-sleeper");
    const sitemapUrls = buildSiteSitemapEntries("side-sleeper").map(
      (entry) => entry.url,
    );

    assert.deepEqual(
      first.map((snapshot) => snapshot.url),
      sitemapUrls,
    );
    assert.deepEqual(first, second);
    assert.ok(first.length > 0);
    for (const snapshot of first) {
      assert.equal(snapshot.fingerprint.length, 64);
    }
  });

  it("snapshots match findworthnow sitemap URLs", () => {
    const snapshots = getIndexNowUrlSnapshots("findworthnow");
    const sitemapUrls = buildSiteSitemapEntries("findworthnow").map(
      (entry) => entry.url,
    );

    assert.deepEqual(
      snapshots.map((snapshot) => snapshot.url),
      sitemapUrls,
    );
    assert.ok(
      snapshots.some(
        (snapshot) =>
          snapshot.url === "https://findworthnow.com/sleep/sleep-revive-review",
      ),
    );
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

  it("diffs added, updated, and removed URLs", () => {
    const previous = [
      snap("https://side-sleepers.com/", "home-v1"),
      snap("https://side-sleepers.com/products/old", "old-v1"),
      snap("https://side-sleepers.com/products/kept", "kept-v1"),
    ];
    const current = [
      snap("https://side-sleepers.com/", "home-v2"),
      snap("https://side-sleepers.com/products/kept", "kept-v1"),
      snap("https://side-sleepers.com/products/new", "new-v1"),
    ];

    assert.deepEqual(diffIndexNowSnapshots(current, previous), {
      added: ["https://side-sleepers.com/products/new"],
      updated: ["https://side-sleepers.com/"],
      removed: ["https://side-sleepers.com/products/old"],
    });
  });

  it("treats slug rename as removed old URL and added new URL", () => {
    assert.deepEqual(
      diffIndexNowSnapshots(
        [snap("https://side-sleepers.com/products/new-slug", "same")],
        [snap("https://side-sleepers.com/products/old-slug", "same")],
      ),
      {
        added: ["https://side-sleepers.com/products/new-slug"],
        updated: [],
        removed: ["https://side-sleepers.com/products/old-slug"],
      },
    );
  });

  it("skips updates when previous snapshots have no fingerprints", () => {
    const previous = [
      snap("https://side-sleepers.com/", ""),
      snap("https://side-sleepers.com/products/old", ""),
    ];
    const current = [
      snap("https://side-sleepers.com/", "home-v2"),
      snap("https://side-sleepers.com/products/new", "new-v1"),
    ];

    assert.deepEqual(diffIndexNowSnapshots(current, previous), {
      added: ["https://side-sleepers.com/products/new"],
      updated: [],
      removed: ["https://side-sleepers.com/products/old"],
    });
  });

  it("returns an empty diff when snapshots are unchanged", () => {
    const snapshots = [
      snap("https://side-sleepers.com/", "home-v1"),
      snap("https://side-sleepers.com/products/kept", "kept-v1"),
    ];

    assert.deepEqual(diffIndexNowSnapshots(snapshots, snapshots), {
      added: [],
      updated: [],
      removed: [],
    });
    assert.deepEqual(indexNowUrlsToSubmit(diffIndexNowSnapshots(snapshots, snapshots)), []);
  });

  it("parses both legacy URL lists and snapshot objects", () => {
    assert.deepEqual(
      parseIndexNowSnapshotList([
        "https://side-sleepers.com/",
        "https://side-sleepers.com/products",
      ]),
      [
        snap("https://side-sleepers.com/", ""),
        snap("https://side-sleepers.com/products", ""),
      ],
    );
    assert.deepEqual(
      parseIndexNowSnapshotList([
        snap("https://side-sleepers.com/", "abc"),
      ]),
      [snap("https://side-sleepers.com/", "abc")],
    );
    assert.throws(() => parseIndexNowSnapshotList({}), /must be an array/);
    assert.throws(() => parseIndexNowSnapshotList([42]), /Invalid IndexNow snapshot/);
  });

  it("marks remaining current URLs as updated when public templates change", () => {
    const diff = {
      added: ["https://side-sleepers.com/products/new"],
      updated: ["https://side-sleepers.com/reviews/guide"],
      removed: ["https://side-sleepers.com/products/old"],
    };
    const currentUrls = [
      "https://side-sleepers.com/",
      "https://side-sleepers.com/products/new",
      "https://side-sleepers.com/reviews/guide",
    ];

    assert.deepEqual(
      applyPublicTemplateFallback(diff, currentUrls, [
        "src/data/sites/side-sleeper/products.ts",
      ]),
      diff,
    );

    assert.deepEqual(
      applyPublicTemplateFallback(diff, currentUrls, [
        "src/app/[siteSlug]/layout.tsx",
      ]),
      diff,
    );

    assert.deepEqual(
      applyPublicTemplateFallback(diff, currentUrls, [
        "src/app/[siteSlug]/about/page.tsx",
      ]),
      {
        added: ["https://side-sleepers.com/products/new"],
        updated: [
          "https://side-sleepers.com/reviews/guide",
          "https://side-sleepers.com/",
        ],
        removed: ["https://side-sleepers.com/products/old"],
      },
    );
  });

  it("detects public site page templates and ignores layout chrome", () => {
    assert.equal(
      isPublicSiteTemplatePath("src/app/[siteSlug]/about/page.tsx"),
      true,
    );
    assert.equal(
      isPublicSiteTemplatePath("src/app/[siteSlug]/page.tsx"),
      true,
    );
    assert.equal(
      isPublicSiteTemplatePath("src\\app\\[siteSlug]\\reviews\\page.tsx"),
      true,
    );
    assert.equal(
      isPublicSiteTemplatePath("src\\app\\[siteSlug]\\layout.tsx"),
      false,
    );
    assert.equal(
      isPublicSiteTemplatePath("src/app/[siteSlug]/error.tsx"),
      false,
    );
    assert.equal(
      isPublicSiteTemplatePath("src/app/globals.css"),
      false,
    );
    assert.equal(
      isPublicSiteTemplatePath("src/app/admin/(dashboard)/page.tsx"),
      false,
    );
  });

  it("ignores className-only page template edits", () => {
    const before = `
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
        Reviews for Side Sleepers
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Mattress reviews, pillow reviews, and science of sleep.
      </p>
    `;
    const after = `
      <h1 className="text-3xl font-bold tracking-tight text-ss-navy md:text-4xl">
        Reviews for Side Sleepers
      </h1>
      <p className="mt-3 max-w-2xl text-ss-ink/75">
        Mattress reviews, pillow reviews, and science of sleep.
      </p>
    `;
    const cnBefore = `
      <Link
        className={cn(
          "rounded-lg px-3.5 py-2 text-sm font-medium",
          active ? "bg-blue-600 text-white" : "border border-slate-200 bg-white",
        )}
      >
        All
      </Link>
    `;
    const cnAfter = `
      <Link
        className={cn(
          "rounded-lg px-3.5 py-2 text-sm font-medium",
          active ? "bg-ss-navy text-ss-paper" : "border border-ss-navy/15 bg-ss-paper",
        )}
      >
        All
      </Link>
    `;

    assert.equal(pageTemplateHasCopyChange(before, after), false);
    assert.equal(pageTemplateHasCopyChange(cnBefore, cnAfter), false);
    assert.equal(pageTemplateHasCopyChange(undefined, after), true);
    assert.equal(pageTemplateHasCopyChange(before, undefined), true);
  });

  it("treats page template copy and structure changes as updates", () => {
    const before = `
      <h1 className="text-slate-900">Reviews for Side Sleepers</h1>
      <p className="text-slate-600">Mattress reviews.</p>
    `;
    const copyAfter = `
      <h1 className="text-ss-navy">Guides for Side Sleepers</h1>
      <p className="text-ss-ink/75">Mattress reviews.</p>
    `;
    const structureAfter = `
      <div>
        <h1 className="text-ss-navy">Reviews for Side Sleepers</h1>
        <p className="text-ss-ink/75">Mattress reviews.</p>
      </div>
    `;

    assert.equal(pageTemplateHasCopyChange(before, copyAfter), true);
    assert.equal(pageTemplateHasCopyChange(before, structureAfter), true);
  });
});
