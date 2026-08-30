import { config } from "dotenv";
config({ override: true });
import { count, sql } from "drizzle-orm";
import { getAllSites, getSiteBySlug } from "@/data/sites";
import { getMigrateDb } from "@/lib/db";
import { hydrateSiteData } from "@/lib/db/hydrate";
import {
  articleProductSections,
  articles,
  faqs,
  products,
  sites,
} from "@/lib/db/schema";

type CheckResult = { ok: true } | { ok: false; message: string };

function pass(message: string) {
  console.log(`OK  ${message}`);
}

function fail(message: string): CheckResult {
  console.error(`FAIL ${message}`);
  return { ok: false, message };
}

function expectedCounts() {
  const staticSites = getAllSites();
  return {
    sites: staticSites.length,
    products: staticSites.reduce((total, site) => total + site.products.length, 0),
    articles: staticSites.reduce((total, site) => total + site.articles.length, 0),
    faqs: staticSites.reduce((total, site) => total + site.faqs.length, 0),
    articleProductSections: staticSites.reduce(
      (total, site) =>
        total +
        site.articles.reduce(
          (articleTotal, article) =>
            articleTotal +
            (article.kind === "product-roundup" ? article.products.length : 0),
          0,
        ),
      0,
    ),
  };
}

async function checkTableCounts(): Promise<CheckResult> {
  const expected = expectedCounts();
  const db = getMigrateDb();

  const [siteCount] = await db.select({ value: count() }).from(sites);
  const [productCount] = await db.select({ value: count() }).from(products);
  const [articleCount] = await db.select({ value: count() }).from(articles);
  const [faqCount] = await db.select({ value: count() }).from(faqs);
  const [articleSectionCount] = await db
    .select({ value: count() })
    .from(articleProductSections);

  const actual = {
    sites: Number(siteCount?.value ?? 0),
    products: Number(productCount?.value ?? 0),
    articles: Number(articleCount?.value ?? 0),
    faqs: Number(faqCount?.value ?? 0),
    articleProductSections: Number(articleSectionCount?.value ?? 0),
  };

  for (const key of Object.keys(expected) as Array<keyof typeof expected>) {
    if (actual[key] !== expected[key]) {
      return fail(`${key} count expected ${expected[key]}, got ${actual[key]}`);
    }
  }

  pass(
    `table counts match static seed (sites=${actual.sites}, products=${actual.products}, articles=${actual.articles}, faqs=${actual.faqs})`,
  );
  return { ok: true };
}

function executeRows<T>(result: { rows: T[] } | T[]): T[] {
  return Array.isArray(result) ? result : result.rows;
}

async function checkUniqueSlugs(): Promise<CheckResult> {
  const db = getMigrateDb();

  const duplicateProductSlugs = executeRows(
    await db.execute<{ site_slug: string; slug: string; n: number }>(sql`
    SELECT s.slug AS site_slug, p.slug, COUNT(*)::int AS n
    FROM products p
    JOIN sites s ON s.id = p.site_id
    GROUP BY s.slug, p.slug
    HAVING COUNT(*) > 1
  `),
  );

  if (duplicateProductSlugs.length > 0) {
    return fail(`duplicate product slugs found: ${JSON.stringify(duplicateProductSlugs)}`);
  }

  const duplicateArticleSlugs = executeRows(
    await db.execute<{ site_slug: string; slug: string; n: number }>(sql`
    SELECT s.slug AS site_slug, a.slug, COUNT(*)::int AS n
    FROM articles a
    JOIN sites s ON s.id = a.site_id
    GROUP BY s.slug, a.slug
    HAVING COUNT(*) > 1
  `),
  );

  if (duplicateArticleSlugs.length > 0) {
    return fail(`duplicate article slugs found: ${JSON.stringify(duplicateArticleSlugs)}`);
  }

  pass("product and article slugs are unique per site");
  return { ok: true };
}

async function checkTopPicksIntegrity(): Promise<CheckResult> {
  const db = getMigrateDb();

  const missingProducts = executeRows(
    await db.execute<{ site_slug: string; product_id: string }>(sql`
    SELECT s.slug AS site_slug, tp.product_id
    FROM site_top_picks tp
    JOIN sites s ON s.id = tp.site_id
    LEFT JOIN products p ON p.id = tp.product_id
    WHERE p.id IS NULL
  `),
  );

  if (missingProducts.length > 0) {
    return fail(`top picks reference missing products: ${JSON.stringify(missingProducts)}`);
  }

  const draftProductsOnPublishedSites = executeRows(
    await db.execute<{ site_slug: string; product_slug: string }>(sql`
    SELECT s.slug AS site_slug, p.slug AS product_slug
    FROM site_top_picks tp
    JOIN sites s ON s.id = tp.site_id
    JOIN products p ON p.id = tp.product_id
    WHERE s.status = 'published' AND p.status = 'draft'
  `),
  );

  if (draftProductsOnPublishedSites.length > 0) {
    return fail(
      `published sites have top picks on draft products: ${JSON.stringify(draftProductsOnPublishedSites)}`,
    );
  }

  const duplicateTopPicks = executeRows(
    await db.execute<{ site_slug: string; sort_order: number; n: number }>(sql`
    SELECT s.slug AS site_slug, tp.sort_order, COUNT(*)::int AS n
    FROM site_top_picks tp
    JOIN sites s ON s.id = tp.site_id
    GROUP BY s.slug, tp.sort_order
    HAVING COUNT(*) > 1
  `),
  );

  if (duplicateTopPicks.length > 0) {
    return fail(`duplicate top pick sort orders: ${JSON.stringify(duplicateTopPicks)}`);
  }

  pass("top picks integrity checks passed");
  return { ok: true };
}

async function checkHydrationAndSpotChecks(): Promise<CheckResult> {
  for (const staticSite of getAllSites()) {
    const hydrated = await hydrateSiteData(staticSite.slug);

    if (hydrated.products.length !== staticSite.products.length) {
      return fail(
        `${staticSite.slug}: hydrated product count ${hydrated.products.length} !== static ${staticSite.products.length}`,
      );
    }

    for (const staticProduct of staticSite.products) {
      const hydratedProduct = hydrated.products.find(
        (product) => product.slug === staticProduct.slug,
      );

      if (!hydratedProduct) {
        return fail(`${staticSite.slug}: missing hydrated product ${staticProduct.slug}`);
      }

      if (hydratedProduct.featuredRank !== staticProduct.featuredRank) {
        return fail(
          `${staticSite.slug}/${staticProduct.slug}: featuredRank expected ${staticProduct.featuredRank}, got ${hydratedProduct.featuredRank}`,
        );
      }
    }

    pass(`hydrated ${staticSite.slug} with matching featuredRank values`);
  }

  const sideSleeper = await hydrateSiteData("side-sleeper");
  const winkbed = sideSleeper.products.find((product) => product.slug === "winkbed");
  if (!winkbed) {
    return fail("side-sleeper/winkbed not found in hydrated data");
  }
  pass("side-sleeper winkbed is present");

  const constructionSoftware = await hydrateSiteData("construction-software");
  const procore = constructionSoftware.products.find(
    (product) => product.slug === "procore",
  );
  if (!procore) {
    return fail("construction-software/procore not found in hydrated data");
  }

  const booleanKeys = [
    "mobile-app",
    "estimating",
    "job-scheduling",
    "document-management",
    "time-tracking",
  ] as const;

  for (const key of booleanKeys) {
    if (typeof procore.comparison?.[key] !== "boolean") {
      return fail(
        `construction-software/procore comparison.${key} expected boolean, got ${typeof procore.comparison?.[key]}`,
      );
    }
  }
  pass("construction-software procore comparison boolean keys preserved");

  const staticSideSleeper = getSiteBySlug("side-sleeper");
  const staticConstruction = getSiteBySlug("construction-software");
  if (!staticSideSleeper || !staticConstruction) {
    return fail("static site data missing for comparison");
  }

  if (!sideSleeper.ads) {
    return fail("side-sleeper ads should hydrate when slots are set");
  }

  const findworthnow = await hydrateSiteData("findworthnow");
  if (findworthnow.ads !== undefined) {
    return fail("findworthnow ads should be omitted when slots are empty");
  }

  pass("hydration spot checks passed");
  return { ok: true };
}

async function main() {
  const checks = [
    checkTableCounts,
    checkUniqueSlugs,
    checkTopPicksIntegrity,
    checkHydrationAndSpotChecks,
  ];

  let failed = 0;

  for (const check of checks) {
    const result = await check();
    if (!result.ok) {
      failed += 1;
    }
  }

  if (failed > 0) {
    console.error(`\nVerification failed (${failed} check group(s)).`);
    process.exit(1);
  }

  console.log("\nAll verification checks passed.");
}

main().catch((error: unknown) => {
  console.error("Verification failed:", error);
  process.exit(1);
});
