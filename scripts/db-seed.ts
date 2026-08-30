import { config } from "dotenv";
config({ override: true });
import { count, eq, inArray, sql } from "drizzle-orm";
import { getAllSites } from "@/data/sites";
import type { Db } from "@/lib/db";
import { getMigrateDb } from "@/lib/db";
import { hashPassword } from "@/lib/admin-password";
import {
  articleProductSections,
  articles,
  buyingGuideSections,
  comparisonRows,
  faqs,
  footerLinks,
  products,
  siteDomains,
  siteHeroes,
  siteSections,
  siteTopPicks,
  sites,
  users,
  userSiteAccess,
} from "@/lib/db/schema";
import type { Article, Product, SiteData } from "@/types/site";
import type { DirectoryBlogPost } from "@/types/directory-blog";
import type { DirectoryProduct } from "@/types/directory-catalog";
import { directoryBlogPostToTiptapDoc } from "@/lib/article-content";
import { getDirectoryBlogPosts } from "@/lib/directory-blog";
import { getDirectoryCatalog } from "@/lib/directory-catalog";

export type SeedCounts = {
  sites: number;
  siteDomains: number;
  heroes: number;
  sections: number;
  comparisonRows: number;
  products: number;
  topPicks: number;
  faqs: number;
  buyingGuideSections: number;
  footerLinks: number;
  articles: number;
  articleProductSections: number;
  users: number;
  userSiteAccess: number;
};

const SEEDED_ADMIN_USERS = [
  {
    username: "ToeCrow",
    displayName: "Thomas",
    role: "superadmin" as const,
    siteSlugs: [] as string[],
  },
  {
    username: "DaMaNi",
    displayName: "George",
    role: "admin" as const,
    siteSlugs: ["construction-software", "side-sleeper"],
  },
];

function parseHost(siteUrl: string): string | null {
  try {
    return new URL(siteUrl).host;
  } catch {
    return null;
  }
}

function parseIsoDate(value: string | undefined): Date | null {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

type DbClient = Db | Parameters<Parameters<Db["transaction"]>[0]>[0];

async function insertSite(tx: DbClient, siteData: SiteData) {
  const now = new Date();
  const [site] = await tx
    .insert(sites)
    .values({
      slug: siteData.slug,
      title: siteData.title,
      metaTitle: siteData.metaTitle,
      metaDescription: siteData.metaDescription,
      niche: siteData.niche,
      siteUrl: siteData.siteUrl,
      headerBrandImage: siteData.headerBrandImage ?? null,
      favicon: siteData.favicon ?? null,
      affiliateDisclosure: siteData.affiliateDisclosure,
      newsletterTitle: siteData.newsletter.title,
      newsletterDescription: siteData.newsletter.description,
      newsletterButtonText: siteData.newsletter.buttonText,
      newsletterSuccessMessage: siteData.newsletter.successMessage,
      adsPrimary: siteData.ads?.slots.primary ?? null,
      adsSecondary: siteData.ads?.slots.secondary ?? null,
      status: "published",
      publishedAt: now,
      features: {
        ...(siteData.features ?? {}),
        featuredReviewSlugs: siteData.featuredReviewSlugs,
        scienceArticleSlug: siteData.scienceArticleSlug,
      },
    })
    .returning();

  const host = parseHost(siteData.siteUrl);
  if (host) {
    await tx.insert(siteDomains).values({
      siteId: site.id,
      host,
    });
  }

  await tx.insert(siteHeroes).values({
    siteId: site.id,
    eyebrow: siteData.hero.eyebrow ?? null,
    headline: siteData.hero.headline,
    subheadline: siteData.hero.subheadline,
    primaryCta: siteData.hero.primaryCta,
    secondaryCta: siteData.hero.secondaryCta ?? null,
    secondaryCtaHref: siteData.hero.secondaryCtaHref ?? null,
    imageSrc: siteData.hero.image?.src ?? null,
    imageSrcMobile: siteData.hero.image?.srcMobile ?? null,
    imageAlt: siteData.hero.image?.alt ?? null,
  });

  await tx.insert(siteSections).values([
    {
      siteId: site.id,
      sectionKey: "top-picks",
      title: siteData.topPicks.title,
      description: siteData.topPicks.description ?? null,
    },
    {
      siteId: site.id,
      sectionKey: "product-directory",
      title: siteData.productDirectory.title,
      description: siteData.productDirectory.description ?? null,
    },
    {
      siteId: site.id,
      sectionKey: "comparison-table",
      title: siteData.comparisonTable.title,
      description: siteData.comparisonTable.description ?? null,
      config: siteData.comparisonTable.rowHeaderLabel
        ? { rowHeaderLabel: siteData.comparisonTable.rowHeaderLabel }
        : null,
    },
    {
      siteId: site.id,
      sectionKey: "buying-guide",
      title: siteData.buyingGuide.title,
      config: {
        intro: siteData.buyingGuide.intro,
        chapters: siteData.buyingGuide.chapters,
        productNav: siteData.buyingGuide.productNav,
      },
    },
    {
      siteId: site.id,
      sectionKey: "footer",
      title: siteData.footer.tagline ?? null,
    },
  ]);

  if (siteData.comparisonTable.rows.length > 0) {
    await tx.insert(comparisonRows).values(
      siteData.comparisonTable.rows.map((row, index) => ({
        siteId: site.id,
        key: row.key,
        label: row.label,
        type: row.type ?? "text",
        sortOrder: index + 1,
      })),
    );
  }

  const catalogBySlug = new Map(
    (getDirectoryCatalog(siteData.slug)?.products ?? []).map((product) => [
      product.slug,
      product,
    ]),
  );
  const blogBySlug = new Map(
    getDirectoryBlogPosts(siteData.slug).map((post) => [post.slug, post]),
  );

  const productIdBySlug = new Map<string, string>();

  for (const product of siteData.products) {
    const [inserted] = await tx
      .insert(products)
      .values(mapProduct(site.id, product, catalogBySlug.get(product.slug)))
      .returning({ id: products.id, slug: products.slug });
    productIdBySlug.set(inserted.slug, inserted.id);
  }

  const topPickRows = siteData.products
    .filter(
      (product): product is Product & { featuredRank: number } =>
        product.featuredRank != null,
    )
    .map((product) => ({
      siteId: site.id,
      productId: productIdBySlug.get(product.slug)!,
      sortOrder: product.featuredRank,
      badgeOverride: null,
      headingOverride: null,
      descriptionOverride: null,
    }));

  if (topPickRows.length > 0) {
    await tx.insert(siteTopPicks).values(topPickRows);
  }

  if (siteData.faqs.length > 0) {
    await tx.insert(faqs).values(
      siteData.faqs.map((faq, index) => ({
        siteId: site.id,
        question: faq.question,
        answer: faq.answer,
        sortOrder: index + 1,
      })),
    );
  }

  const buyingGuideSectionsData = siteData.buyingGuide.sections ?? [];
  if (buyingGuideSectionsData.length > 0) {
    await tx.insert(buyingGuideSections).values(
      buyingGuideSectionsData.map((section, index) => ({
        siteId: site.id,
        title: section.title,
        content: section.content,
        sortOrder: index + 1,
      })),
    );
  }

  if (siteData.footer.links.length > 0) {
    await tx.insert(footerLinks).values(
      siteData.footer.links.map((link, index) => ({
        siteId: site.id,
        label: link.label,
        href: link.href,
        sortOrder: index + 1,
      })),
    );
  }

  let articleProductSectionCount = 0;
  const articleIdBySlug = new Map<string, string>();

  for (const article of siteData.articles) {
    const [insertedArticle] = await tx
      .insert(articles)
      .values(
        mapArticle(
          site.id,
          article,
          blogBySlug.get(article.slug),
          articleIdBySlug,
        ),
      )
      .returning({ id: articles.id, slug: articles.slug });

    articleIdBySlug.set(insertedArticle.slug, insertedArticle.id);

    if (article.kind === "product-roundup" && article.products.length > 0) {
      await tx.insert(articleProductSections).values(
        article.products.map((section, index) => {
          articleProductSectionCount += 1;
          return mapArticleProductSection(
            insertedArticle.id,
            section,
            index + 1,
            productIdBySlug,
          );
        }),
      );
    }
  }

  for (const article of siteData.articles) {
    const articleId = articleIdBySlug.get(article.slug);
    if (!articleId) continue;

    const relatedArticleIds = (article.relatedSlugs ?? [])
      .map((slug) => articleIdBySlug.get(slug))
      .filter((id): id is string => Boolean(id));

    const blogPost = blogBySlug.get(article.slug);
    const body = blogPost
      ? directoryBlogPostToTiptapDoc(blogPost, articleIdBySlug)
      : undefined;

    if (!body && relatedArticleIds.length === 0) {
      continue;
    }

    const current = await tx
      .select({ content: articles.content })
      .from(articles)
      .where(eq(articles.id, articleId))
      .then((rows) => rows[0]?.content ?? {});

    await tx
      .update(articles)
      .set({
        content: {
          ...(current as Record<string, unknown>),
          ...(relatedArticleIds.length > 0 ? { relatedArticleIds } : {}),
          ...(body ? { body } : {}),
        },
      })
      .where(eq(articles.id, articleId));
  }

  return {
    siteDomains: host ? 1 : 0,
    products: siteData.products.length,
    topPicks: topPickRows.length,
    faqs: siteData.faqs.length,
    buyingGuideSections: buyingGuideSectionsData.length,
    footerLinks: siteData.footer.links.length,
    articles: siteData.articles.length,
    articleProductSections: articleProductSectionCount,
    comparisonRows: siteData.comparisonTable.rows.length,
  };
}

function mapProduct(
  siteId: string,
  product: Product,
  catalogProduct?: DirectoryProduct,
) {
  return {
    siteId,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    bestFor: product.bestFor,
    priceFrom:
      product.priceFrom != null
        ? String(product.priceFrom)
        : product.priceDisplay,
    features: product.features,
    pros: product.pros,
    cons: product.cons,
    affiliateUrl: product.affiliateUrl ?? product.productUrl,
    hasAffiliatePartnership: product.hasAffiliatePartnership,
    researchScoreBreakdown: null,
    badge: product.badge ?? null,
    comparisonRank: product.comparisonRank ?? 0,
    directorySortOrder: product.directoryOrder,
    comparison: product.comparison ?? {},
    content: {
      category: catalogProduct?.categorySlug ?? product.category,
      image: product.image,
      priceDisplay: product.priceDisplay,
      productUrl: product.productUrl,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      priceUpdatedAt: product.priceUpdatedAt,
      ...(catalogProduct
        ? {
            typeLabel: catalogProduct.typeLabel,
            ctaLabel: catalogProduct.ctaLabel,
            reviewSlug: catalogProduct.reviewSlug,
            reviewTitle: catalogProduct.reviewTitle,
            heroDescription: catalogProduct.heroDescription,
            sections: catalogProduct.sections,
          }
        : {}),
    },
    status: "published" as const,
    publishedAt: new Date(),
  };
}

function mapArticle(
  siteId: string,
  article: Article,
  blogPost?: DirectoryBlogPost,
  articleIdBySlug: ReadonlyMap<string, string> = new Map(),
) {
  const researchNote =
    article.kind === "product-roundup"
      ? article.researchNote
      : { title: "", content: "" };

  const relatedArticleIds = (article.relatedSlugs ?? [])
    .map((slug) => articleIdBySlug.get(slug))
    .filter((id): id is string => Boolean(id));

  return {
    siteId,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt ?? null,
    intro: article.intro,
    researchNoteTitle: researchNote.title,
    researchNoteContent: researchNote.content,
    author: article.author ?? null,
    ogImageSrc: article.ogImage?.src ?? null,
    ogImageAlt: article.ogImage?.alt ?? null,
    content: {
      kind: article.kind,
      reviewCategory: article.reviewCategory,
      metaTitle: article.metaTitle,
      metaDescription: article.metaDescription,
      inlineRelatedSlug: article.inlineRelatedSlug,
      relatedSlugs: article.relatedSlugs,
      ...(relatedArticleIds.length > 0 ? { relatedArticleIds } : {}),
      introImage: article.kind === "editorial" ? article.introImage : undefined,
      sections: blogPost
        ? blogPost.sections
        : article.kind === "editorial"
          ? article.sections
          : undefined,
      body: blogPost
        ? directoryBlogPostToTiptapDoc(blogPost, articleIdBySlug)
        : undefined,
      closingGuide:
        article.kind === "product-roundup" ? article.closingGuide : undefined,
      faqs: article.kind === "product-roundup" ? article.faqs : undefined,
      ...(blogPost
        ? { relatedProductSlugs: blogPost.relatedProductSlugs }
        : {}),
    },
    status: "published" as const,
    publishedAt: parseIsoDate(article.publishedAt) ?? new Date(),
    updatedAtContent: parseIsoDate(article.updatedAt),
  };
}

function mapArticleProductSection(
  articleId: string,
  section: Extract<Article, { kind: "product-roundup" }>["products"][number],
  sortOrder: number,
  productIdBySlug: ReadonlyMap<string, string>,
) {
  return {
    articleId,
    heading: section.heading,
    intro: section.intro ?? null,
    imageSrc: section.image?.src ?? null,
    imageAlt: section.image?.alt ?? null,
    whatItIs: section.whatItIs,
    whyItEarnsASpot: section.whyItEarnsASpot,
    whereItFallsShort: section.whereItFallsShort,
    bestFor: section.bestFor,
    skipIf: section.skipIf,
    productSlug: section.productSlug ?? null,
    productId: section.productSlug
      ? (productIdBySlug.get(section.productSlug) ?? null)
      : null,
    productVariant: section.productVariant ?? null,
    sortOrder,
  };
}

export async function seedAdminUsers(
  db: Db = getMigrateDb(),
): Promise<{ users: number; userSiteAccess: number }> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("ADMIN_PASSWORD must be set to seed admin users.");
  }

  let userCount = 0;
  let accessCount = 0;

  for (const seed of SEEDED_ADMIN_USERS) {
    const [existing] = await db
      .select()
      .from(users)
      .where(sql`lower(${users.username}) = lower(${seed.username})`)
      .limit(1);

    let userId: string;
    if (existing) {
      await db
        .update(users)
        .set({
          username: seed.username,
          displayName: seed.displayName,
          role: seed.role,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existing.id));
      userId = existing.id;
    } else {
      const hashed = await hashPassword(password);
      const [inserted] = await db
        .insert(users)
        .values({
          username: seed.username,
          displayName: seed.displayName,
          role: seed.role,
          passwordSalt: hashed.salt,
          passwordHash: hashed.hash,
          passwordKdf: hashed.kdf,
          profile: {},
        })
        .returning({ id: users.id });
      if (!inserted) {
        throw new Error(`Could not insert user ${seed.username}`);
      }
      userId = inserted.id;
    }
    userCount += 1;

    await db.delete(userSiteAccess).where(eq(userSiteAccess.userId, userId));
    if (seed.siteSlugs.length === 0) {
      continue;
    }

    const siteRows = await db
      .select({ id: sites.id, slug: sites.slug })
      .from(sites)
      .where(inArray(sites.slug, seed.siteSlugs));
    if (siteRows.length !== seed.siteSlugs.length) {
      const found = new Set(siteRows.map((row) => row.slug));
      const missing = seed.siteSlugs.filter((slug) => !found.has(slug));
      throw new Error(
        `Cannot grant site access; missing sites: ${missing.join(", ")}`,
      );
    }

    await db.insert(userSiteAccess).values(
      siteRows.map((site) => ({
        userId,
        siteId: site.id,
      })),
    );
    accessCount += siteRows.length;
  }

  return { users: userCount, userSiteAccess: accessCount };
}

export async function seedDatabase(): Promise<SeedCounts> {
  const db = getMigrateDb();
  const staticSites = getAllSites();

  const totals: SeedCounts = {
    sites: 0,
    siteDomains: 0,
    heroes: 0,
    sections: 0,
    comparisonRows: 0,
    products: 0,
    topPicks: 0,
    faqs: 0,
    buyingGuideSections: 0,
    footerLinks: 0,
    articles: 0,
    articleProductSections: 0,
    users: 0,
    userSiteAccess: 0,
  };

  await db.transaction(async (tx) => {
    for (const siteData of staticSites) {
      const siteCounts = await insertSite(tx, siteData);
      totals.sites += 1;
      totals.heroes += 1;
      totals.sections += 5;
      totals.siteDomains += siteCounts.siteDomains;
      totals.comparisonRows += siteCounts.comparisonRows;
      totals.products += siteCounts.products;
      totals.topPicks += siteCounts.topPicks;
      totals.faqs += siteCounts.faqs;
      totals.buyingGuideSections += siteCounts.buyingGuideSections;
      totals.footerLinks += siteCounts.footerLinks;
      totals.articles += siteCounts.articles;
      totals.articleProductSections += siteCounts.articleProductSections;
    }
  });

  const userCounts = await seedAdminUsers(db);
  totals.users = userCounts.users;
  totals.userSiteAccess = userCounts.userSiteAccess;

  return totals;
}

function printCounts(counts: SeedCounts) {
  console.log("Seed complete:");
  for (const [key, value] of Object.entries(counts)) {
    console.log(`  ${key}: ${value}`);
  }
}

async function main() {
  const db = getMigrateDb();
  const [result] = await db.select({ value: count() }).from(sites);
  const existingSites = Number(result?.value ?? 0);
  if (existingSites > 0) {
    const userCounts = await seedAdminUsers(db);
    console.log(
      "Sites already present; seeded admin users only (existing passwords were kept):",
    );
    console.log(`  users: ${userCounts.users}`);
    console.log(`  userSiteAccess: ${userCounts.userSiteAccess}`);
    return;
  }

  const counts = await seedDatabase();
  printCounts(counts);
}

const isDirectRun = process.argv[1]?.replace(/\\/g, "/").endsWith("scripts/db-seed.ts");

if (isDirectRun) {
  main().catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
}
