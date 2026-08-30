import { createHash } from "node:crypto";
import { getPublicAbsoluteUrl } from "@/lib/paths";
import {
  getDirectoryCategories,
  getDirectoryProducts,
} from "@/lib/directory-catalog";
import { getSiteBySlug, isValidSiteSlug } from "@/data/sites";
import {
  articlesFeaturingProductFrom,
  comparisonProductsFrom,
  featuredHomeReviewsFrom,
  featuredProductsFrom,
  productBySlugFrom,
} from "@/lib/site";
import { canAccessRoute } from "@/lib/site-routes";
import { getArticleConfig, siteHasFeature } from "@/lib/site-config";
import type { Article, Product, SiteData } from "@/types/site";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const KEY_PATTERN = /^[a-zA-Z0-9-]{8,128}$/;
const PUBLIC_SITE_TEMPLATE_PREFIX = "src/app/[siteSlug]/";

/** Default live site for IndexNow submissions. */
export const INDEXNOW_DEFAULT_SITE_SLUG = "side-sleeper";

/** Custom-domain sites that submit IndexNow with the shared INDEXNOW_KEY. */
export const INDEXNOW_SITE_SLUGS = [
  "side-sleeper",
  "findworthnow",
] as const;

export type IndexNowSiteSlug = (typeof INDEXNOW_SITE_SLUGS)[number];

export function isIndexNowSiteSlug(value: string): value is IndexNowSiteSlug {
  return (INDEXNOW_SITE_SLUGS as readonly string[]).includes(value);
}

export type IndexNowSubmitResult = {
  ok: boolean;
  status: number;
  urlCount: number;
  host: string;
  body: string;
};

export type IndexNowUrlSnapshot = {
  url: string;
  fingerprint: string;
};

export type IndexNowSnapshotDiff = {
  added: string[];
  updated: string[];
  removed: string[];
};

export function getIndexNowKey(): string | undefined {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) return undefined;
  if (!KEY_PATTERN.test(key)) {
    throw new Error(
      "INDEXNOW_KEY must be 8–128 characters (a-z, A-Z, 0-9, hyphen).",
    );
  }
  return key;
}

export function getIndexNowKeyLocation(siteUrl: string, key: string): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}/${key}.txt`;
}

export function getIndexNowUrlList(siteSlug: string): string[] {
  return getIndexNowUrlSnapshots(siteSlug).map((entry) => entry.url);
}

/** Keep snapshots whose host matches the site. Ignores leftover URLs from older list scripts. */
export function filterIndexNowSnapshotsForSite(
  snapshots: IndexNowUrlSnapshot[],
  siteSlug: string,
): IndexNowUrlSnapshot[] {
  const siteData = getSiteBySlug(siteSlug);
  if (!siteData) {
    return [];
  }

  const host = new URL(siteData.siteUrl).host;
  return snapshots.filter((snapshot) => {
    try {
      return new URL(snapshot.url).host === host;
    } catch {
      return false;
    }
  });
}

export function indexNowSiteSlugForUrl(url: string): IndexNowSiteSlug | undefined {
  let host: string;
  try {
    host = new URL(url).host;
  } catch {
    return undefined;
  }

  for (const siteSlug of INDEXNOW_SITE_SLUGS) {
    const siteData = getSiteBySlug(siteSlug);
    if (!siteData) continue;
    if (new URL(siteData.siteUrl).host === host) {
      return siteSlug;
    }
  }

  return undefined;
}

export function isAuthorizedIndexNowSubmit(authHeader: string | null): boolean {
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) return false;

  const allowed = [
    process.env.INDEXNOW_SUBMIT_SECRET?.trim(),
    process.env.CRON_SECRET?.trim(),
  ].filter((value): value is string => Boolean(value));

  return allowed.includes(token);
}

export type IndexNowSubmitOptions = {
  /** When set, only these URLs are submitted (added, updated, or deleted). */
  urlList?: string[];
};

export async function submitSiteToIndexNow(
  siteSlug: string = INDEXNOW_DEFAULT_SITE_SLUG,
  options: IndexNowSubmitOptions = {},
): Promise<IndexNowSubmitResult> {
  const key = getIndexNowKey();
  if (!key) {
    throw new Error("INDEXNOW_KEY is not configured");
  }

  const siteData = getSiteBySlug(siteSlug);
  if (!siteData) {
    throw new Error(`Unknown site slug: ${siteSlug}`);
  }

  const host = new URL(siteData.siteUrl).host;
  const urlList = options.urlList ?? getIndexNowUrlList(siteSlug);
  if (urlList.length === 0) {
    return {
      ok: true,
      status: 200,
      urlCount: 0,
      host,
      body: "No URLs to submit",
    };
  }

  const keyLocation = getIndexNowKeyLocation(siteData.siteUrl, key);

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key,
      keyLocation,
      urlList,
    }),
  });

  const body = await response.text();

  return {
    ok: response.ok || response.status === 202,
    status: response.status,
    urlCount: urlList.length,
    host,
    body,
  };
}

export function fingerprintIndexNowPayload(payload: unknown): string {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

function siteChrome(siteData: SiteData) {
  return {
    title: siteData.title,
    metaTitle: siteData.metaTitle,
    metaDescription: siteData.metaDescription,
    headerBrandImage: siteData.headerBrandImage,
    footer: siteData.footer,
    siteUrl: siteData.siteUrl,
  };
}

function snapshotFor(
  url: string,
  chrome: ReturnType<typeof siteChrome>,
  payload: unknown,
): IndexNowUrlSnapshot {
  return {
    url,
    fingerprint: fingerprintIndexNowPayload({ chrome, payload }),
  };
}

function articleListPayload(article: Article) {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
  };
}

function linkedCatalogProducts(
  siteData: SiteData,
  article: Article,
): Product[] {
  if (article.kind !== "product-roundup") {
    return [];
  }

  return article.products.flatMap((section) => {
    const product = section.productSlug
      ? productBySlugFrom(siteData, section.productSlug)
      : undefined;
    return product ? [product] : [];
  });
}

/**
 * Content snapshot per sitemap URL. Layout chrome is included on every page so
 * site-wide metadata changes notify the full URL set.
 */
export function getIndexNowUrlSnapshots(siteSlug: string): IndexNowUrlSnapshot[] {
  if (!isValidSiteSlug(siteSlug)) {
    return [];
  }

  const siteData = getSiteBySlug(siteSlug);
  if (!siteData) {
    return [];
  }

  const chrome = siteChrome(siteData);
  const abs = (path: string) =>
    getPublicAbsoluteUrl(siteSlug, siteData.siteUrl, path);

  if (siteHasFeature(siteSlug, "catalog")) {
    const snapshots: IndexNowUrlSnapshot[] = [
      snapshotFor(abs("/"), chrome, {
        hero: siteData.hero,
        categories: getDirectoryCategories(siteSlug),
      }),
      snapshotFor(abs("/affiliate-disclosure"), chrome, {
        affiliateDisclosure: siteData.affiliateDisclosure,
      }),
      snapshotFor(abs("/products"), chrome, {
        productDirectory: siteData.productDirectory,
        categories: getDirectoryCategories(siteSlug),
        products: getDirectoryProducts(siteSlug),
      }),
    ];

    for (const category of getDirectoryCategories(siteSlug)) {
      snapshots.push(
        snapshotFor(abs(`/${category.slug}`), chrome, {
          category,
          products: getDirectoryProducts(siteSlug, category.slug),
        }),
      );
    }

    for (const product of getDirectoryProducts(siteSlug)) {
      snapshots.push(
        snapshotFor(
          abs(`/${product.categorySlug}/${product.reviewSlug}`),
          chrome,
          product,
        ),
      );
    }

    const articleRoute = getArticleConfig(siteSlug)?.route;
    const blogPosts =
      articleRoute === "blog" ? siteData.articles : [];
    if (blogPosts.length > 0 && articleRoute) {
      snapshots.push(
        snapshotFor(abs(`/${articleRoute}`), chrome, {
          posts: blogPosts.map((post) => ({
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            publishedAt: post.publishedAt,
          })),
        }),
      );
    }

    for (const post of blogPosts) {
      snapshots.push(
        snapshotFor(abs(`/${articleRoute}/${post.slug}`), chrome, post),
      );
    }

    return snapshots;
  }

  const products = siteData.products;
  const articles = siteData.articles;
  const snapshots: IndexNowUrlSnapshot[] = [
    snapshotFor(abs("/"), chrome, {
      hero: siteData.hero,
      topPicks: siteData.topPicks,
      faqs: siteData.faqs,
      newsletter: siteData.newsletter,
      featuredReviewSlugs: siteData.featuredReviewSlugs,
      scienceArticleSlug: siteData.scienceArticleSlug,
      featuredProducts: featuredProductsFrom(siteData),
      featuredReviews: featuredHomeReviewsFrom(siteData),
    }),
    snapshotFor(abs("/products"), chrome, {
      productDirectory: siteData.productDirectory,
      products,
    }),
  ];

  if (canAccessRoute(siteSlug, "comparisons")) {
    snapshots.push(
      snapshotFor(abs("/comparisons"), chrome, {
        comparisonTable: siteData.comparisonTable,
        products: comparisonProductsFrom(siteData),
      }),
    );
  }

  snapshots.push(
    snapshotFor(abs("/buying-guide"), chrome, siteData.buyingGuide),
  );

  if (canAccessRoute(siteSlug, "about")) {
    snapshots.push(snapshotFor(abs("/about"), chrome, { page: "about" }));
  }

  if (canAccessRoute(siteSlug, "privacy")) {
    snapshots.push(
      snapshotFor(abs("/privacy-policy"), chrome, { page: "privacy-policy" }),
    );
  }

  snapshots.push(
    snapshotFor(abs("/affiliate"), chrome, {
      affiliateDisclosure: siteData.affiliateDisclosure,
    }),
  );

  for (const product of products) {
    snapshots.push(
      snapshotFor(abs(`/products/${product.slug}`), chrome, {
        product,
        featuredGuideSlugs: articlesFeaturingProductFrom(
          siteData,
          product.slug,
        ).map((article) => article.slug),
      }),
    );
  }

  if (articles.length > 0) {
    snapshots.push(
      snapshotFor(abs("/reviews"), chrome, {
        articles: articles.map(articleListPayload),
      }),
    );
  }

  for (const article of articles) {
    snapshots.push(
      snapshotFor(abs(`/reviews/${article.slug}`), chrome, {
        article,
        catalogProducts: linkedCatalogProducts(siteData, article),
      }),
    );
  }

  return snapshots;
}

/**
 * Classify URL changes. Empty previous fingerprints (legacy URL-only lists)
 * detect added/removed but not updated.
 */
export function diffIndexNowSnapshots(
  current: IndexNowUrlSnapshot[],
  previous: IndexNowUrlSnapshot[],
): IndexNowSnapshotDiff {
  const prevByUrl = new Map(
    previous.map((snapshot) => [snapshot.url, snapshot.fingerprint]),
  );
  const currentUrls = new Set(current.map((snapshot) => snapshot.url));
  const previousHasFingerprints = previous.some(
    (snapshot) => snapshot.fingerprint.length > 0,
  );

  const added: string[] = [];
  const updated: string[] = [];
  const removed: string[] = [];

  for (const snapshot of current) {
    const previousFingerprint = prevByUrl.get(snapshot.url);
    if (previousFingerprint === undefined) {
      added.push(snapshot.url);
    } else if (
      previousHasFingerprints &&
      previousFingerprint !== snapshot.fingerprint
    ) {
      updated.push(snapshot.url);
    }
  }

  for (const snapshot of previous) {
    if (!currentUrls.has(snapshot.url)) {
      removed.push(snapshot.url);
    }
  }

  return { added, updated, removed };
}

export function indexNowUrlsToSubmit(diff: IndexNowSnapshotDiff): string[] {
  return [...diff.added, ...diff.updated, ...diff.removed];
}

export function parseIndexNowSnapshotList(raw: unknown): IndexNowUrlSnapshot[] {
  if (!Array.isArray(raw)) {
    throw new Error("IndexNow snapshot list must be an array");
  }

  return raw.map((item, index) => {
    if (typeof item === "string") {
      return { url: item, fingerprint: "" };
    }

    if (
      item &&
      typeof item === "object" &&
      "url" in item &&
      "fingerprint" in item &&
      typeof item.url === "string" &&
      typeof item.fingerprint === "string"
    ) {
      return { url: item.url, fingerprint: item.fingerprint };
    }

    throw new Error(`Invalid IndexNow snapshot item at index ${index}`);
  });
}

export function isPublicSiteTemplatePath(filePath: string): boolean {
  const normalized = filePath.replaceAll("\\", "/");
  return (
    normalized.startsWith(PUBLIC_SITE_TEMPLATE_PREFIX) &&
    normalized.endsWith("/page.tsx")
  );
}

function stripClassNameAttributes(source: string): string {
  let result = "";
  let i = 0;

  while (i < source.length) {
    const isClassName =
      source.startsWith("className", i) &&
      (i === 0 || !/[A-Za-z0-9_$]/.test(source[i - 1]));

    if (!isClassName) {
      result += source[i];
      i += 1;
      continue;
    }

    let j = i + "className".length;
    while (j < source.length && /\s/.test(source[j])) j += 1;
    if (source[j] !== "=") {
      result += source[i];
      i += 1;
      continue;
    }

    j += 1;
    while (j < source.length && /\s/.test(source[j])) j += 1;

    if (source[j] === '"' || source[j] === "'") {
      const quote = source[j];
      j += 1;
      while (j < source.length && source[j] !== quote) {
        if (source[j] === "\\") j += 1;
        j += 1;
      }
      i = Math.min(j + 1, source.length);
      continue;
    }

    if (source[j] === "{") {
      let depth = 0;
      let k = j;
      while (k < source.length) {
        const char = source[k];
        if (char === '"' || char === "'" || char === "`") {
          const quote = char;
          k += 1;
          while (k < source.length && source[k] !== quote) {
            if (source[k] === "\\") k += 1;
            k += 1;
          }
          k += 1;
          continue;
        }
        if (char === "{") {
          depth += 1;
          k += 1;
          continue;
        }
        if (char === "}") {
          depth -= 1;
          k += 1;
          if (depth === 0) break;
          continue;
        }
        k += 1;
      }
      i = k;
      continue;
    }

    result += source[i];
    i += 1;
  }

  return result;
}

function pageTemplateCopySignature(source: string): string {
  return stripClassNameAttributes(source).replace(/\s+/g, "");
}

/**
 * True when page.tsx copy/structure changed, ignoring className-only edits.
 * Missing before or after (added/deleted file) counts as a copy change.
 */
export function pageTemplateHasCopyChange(
  before: string | undefined,
  after: string | undefined,
): boolean {
  if (before === undefined && after === undefined) {
    return false;
  }
  if (before === undefined || after === undefined) {
    return true;
  }
  return pageTemplateCopySignature(before) !== pageTemplateCopySignature(after);
}

/**
 * Copy in public `page.tsx` files is not part of content fingerprints.
 * Treat remaining current sitemap URLs as updated when those page templates
 * change. Callers should pass only page.tsx files with real copy changes.
 */
export function applyPublicTemplateFallback(
  diff: IndexNowSnapshotDiff,
  currentUrls: string[],
  changedFiles: string[],
): IndexNowSnapshotDiff {
  if (!changedFiles.some(isPublicSiteTemplatePath)) {
    return diff;
  }

  const claimed = new Set([
    ...diff.added,
    ...diff.updated,
    ...diff.removed,
  ]);
  const updated = [...diff.updated];

  for (const url of currentUrls) {
    if (!claimed.has(url)) {
      updated.push(url);
      claimed.add(url);
    }
  }

  return { ...diff, updated };
}
