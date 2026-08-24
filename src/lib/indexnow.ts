import { createHash } from "node:crypto";
import { getPublicAbsoluteUrl } from "@/lib/paths";
import { siteUsesAboutPage } from "@/lib/about";
import {
  getDirectoryCategories,
  getDirectoryProducts,
  siteUsesEditorialCatalog,
} from "@/lib/directory-catalog";
import { siteUsesPrivacyPolicy } from "@/lib/privacy-policy";
import {
  getArticles,
  getArticlesFeaturingProduct,
  getComparisonProducts,
  getFeaturedHomeReviews,
  getFeaturedProducts,
  getProductBySlug,
  getProducts,
  getSiteBySlug,
  isValidSiteSlug,
  siteHasMattressPillowNav,
  type SiteSlug,
} from "@/lib/site";
import type { Article, Product, SiteData } from "@/types/site";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const KEY_PATTERN = /^[a-zA-Z0-9-]{8,128}$/;
const PUBLIC_SITE_TEMPLATE_PREFIX = "src/app/[siteSlug]/";

/** Default live site for IndexNow submissions. */
export const INDEXNOW_DEFAULT_SITE_SLUG = "side-sleeper";

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
    ratingScale: siteData.ratingScale,
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
  siteSlug: SiteSlug,
  article: Article,
): Product[] {
  if (article.kind !== "product-roundup") {
    return [];
  }

  return article.products.flatMap((section) => {
    if (!section.productSlug) return [];
    const product = getProductBySlug(siteSlug, section.productSlug);
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

  if (siteUsesEditorialCatalog(siteSlug)) {
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

    return snapshots;
  }

  const products = getProducts(siteSlug);
  const articles = getArticles(siteSlug);
  const snapshots: IndexNowUrlSnapshot[] = [
    snapshotFor(abs("/"), chrome, {
      hero: siteData.hero,
      topPicks: siteData.topPicks,
      faqs: siteData.faqs,
      newsletter: siteData.newsletter,
      featuredReviewSlugs: siteData.featuredReviewSlugs,
      scienceArticleSlug: siteData.scienceArticleSlug,
      featuredProducts: getFeaturedProducts(siteSlug),
      featuredReviews: getFeaturedHomeReviews(siteSlug),
    }),
    snapshotFor(abs("/products"), chrome, {
      productDirectory: siteData.productDirectory,
      products,
    }),
  ];

  if (!siteHasMattressPillowNav(siteSlug)) {
    snapshots.push(
      snapshotFor(abs("/comparisons"), chrome, {
        comparisonTable: siteData.comparisonTable,
        products: getComparisonProducts(siteSlug),
      }),
    );
  }

  snapshots.push(
    snapshotFor(abs("/buying-guide"), chrome, siteData.buyingGuide),
  );

  if (siteUsesAboutPage(siteSlug)) {
    snapshots.push(snapshotFor(abs("/about"), chrome, { page: "about" }));
  }

  if (siteUsesPrivacyPolicy(siteSlug)) {
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
        featuredGuideSlugs: getArticlesFeaturingProduct(
          siteSlug,
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
        catalogProducts: linkedCatalogProducts(siteSlug, article),
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
  return filePath.replaceAll("\\", "/").startsWith(PUBLIC_SITE_TEMPLATE_PREFIX);
}

/**
 * Copy in `src/app/[siteSlug]/**` is not part of content fingerprints.
 * Treat remaining current sitemap URLs as updated when those templates change.
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
