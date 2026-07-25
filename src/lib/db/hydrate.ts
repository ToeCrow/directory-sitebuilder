import { and, asc, eq, inArray } from "drizzle-orm";
import type {
  Article,
  ArticleProductSection,
  ComparisonRow,
  Product,
  SiteData,
} from "@/types/site";
import { getDb } from "./index";
import {
  articleProductSections,
  articles,
  buyingGuideSections,
  comparisonRows,
  faqs,
  footerLinks,
  products,
  siteHeroes,
  siteSections,
  siteTopPicks,
} from "./schema";
import { findSiteByIdOrSlug } from "./repositories/sites";

export type HydrateOptions = {
  /** When true (default), only published site/products/articles are included. */
  publishedOnly?: boolean;
};

function toIsoDate(value: Date | null | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  return value.toISOString().slice(0, 10);
}

function sectionText(value: string | null | undefined): string | undefined {
  if (value == null || value === "") {
    return undefined;
  }
  return value;
}

export async function hydrateSiteData(
  siteIdOrSlug: string,
  options: HydrateOptions = {},
): Promise<SiteData> {
  const { publishedOnly = true } = options;
  const site = await findSiteByIdOrSlug(siteIdOrSlug);

  if (!site) {
    throw new Error(`Site not found: ${siteIdOrSlug}`);
  }

  if (publishedOnly && site.status !== "published") {
    throw new Error(`Site is not published: ${site.slug}`);
  }

  const db = getDb();
  const siteId = site.id;

  const productStatusFilter = publishedOnly
    ? and(eq(products.siteId, siteId), eq(products.status, "published"))
    : eq(products.siteId, siteId);

  const articleStatusFilter = publishedOnly
    ? and(eq(articles.siteId, siteId), eq(articles.status, "published"))
    : eq(articles.siteId, siteId);

  const [
    heroRow,
    sectionRows,
    comparisonRowRows,
    productRows,
    topPickRows,
    faqRows,
    buyingGuideRows,
    footerLinkRows,
    articleRows,
  ] = await Promise.all([
    db
      .select()
      .from(siteHeroes)
      .where(eq(siteHeroes.siteId, siteId))
      .limit(1)
      .then((rows) => rows[0]),
    db
      .select()
      .from(siteSections)
      .where(eq(siteSections.siteId, siteId)),
    db
      .select()
      .from(comparisonRows)
      .where(eq(comparisonRows.siteId, siteId))
      .orderBy(asc(comparisonRows.sortOrder)),
    db
      .select()
      .from(products)
      .where(productStatusFilter)
      .orderBy(asc(products.directorySortOrder)),
    db
      .select()
      .from(siteTopPicks)
      .where(eq(siteTopPicks.siteId, siteId))
      .orderBy(asc(siteTopPicks.sortOrder)),
    db
      .select()
      .from(faqs)
      .where(eq(faqs.siteId, siteId))
      .orderBy(asc(faqs.sortOrder)),
    db
      .select()
      .from(buyingGuideSections)
      .where(eq(buyingGuideSections.siteId, siteId))
      .orderBy(asc(buyingGuideSections.sortOrder)),
    db
      .select()
      .from(footerLinks)
      .where(eq(footerLinks.siteId, siteId))
      .orderBy(asc(footerLinks.sortOrder)),
    db
      .select()
      .from(articles)
      .where(articleStatusFilter)
      .orderBy(asc(articles.slug)),
  ]);

  if (!heroRow) {
    throw new Error(`Site hero not found for site: ${site.slug}`);
  }

  const sectionsByKey = Object.fromEntries(
    sectionRows.map((row) => [row.sectionKey, row]),
  );

  const topPickByProductId = new Map(
    topPickRows.map((row) => [row.productId, row]),
  );

  const articleIds = articleRows.map((row) => row.id);
  const articleProductSectionRows =
    articleIds.length > 0
      ? await db
          .select()
          .from(articleProductSections)
          .where(inArray(articleProductSections.articleId, articleIds))
          .orderBy(asc(articleProductSections.sortOrder))
      : [];

  const articleSectionsByArticleId = new Map<
    string,
    typeof articleProductSectionRows
  >();
  for (const row of articleProductSectionRows) {
    const existing = articleSectionsByArticleId.get(row.articleId) ?? [];
    existing.push(row);
    articleSectionsByArticleId.set(row.articleId, existing);
  }

  const hydratedProducts: Product[] = productRows.map((row) => {
    const topPick = topPickByProductId.get(row.id);
    const badge =
      topPick?.badgeOverride != null && topPick.badgeOverride !== ""
        ? topPick.badgeOverride
        : row.badge ?? undefined;

    return {
      name: row.name,
      slug: row.slug,
      shortDescription: row.shortDescription,
      bestFor: row.bestFor,
      priceFrom: row.priceFrom,
      features: row.features,
      pros: row.pros,
      cons: row.cons,
      affiliateUrl: row.affiliateUrl,
      hasAffiliatePartnership: row.hasAffiliatePartnership,
      rating: Number(row.rating),
      researchScoreBreakdown: row.researchScoreBreakdown ?? undefined,
      badge,
      featuredRank: topPick?.sortOrder ?? null,
      comparisonRank: row.comparisonRank,
      directoryOrder: row.directorySortOrder,
      comparison: row.comparison,
    };
  });

  const hydratedArticles: Article[] = articleRows.map((row) => {
    const productSectionRows = articleSectionsByArticleId.get(row.id) ?? [];
    const articleProducts: ArticleProductSection[] = productSectionRows.map(
      (section) => {
        const mapped: ArticleProductSection = {
          heading: section.heading,
          intro: section.intro ?? undefined,
          whatItIs: section.whatItIs,
          whyItEarnsASpot: section.whyItEarnsASpot,
          whereItFallsShort: section.whereItFallsShort,
          bestFor: section.bestFor,
          skipIf: section.skipIf,
        };

        if (section.imageSrc && section.imageAlt) {
          mapped.image = {
            src: section.imageSrc,
            alt: section.imageAlt,
          };
        }

        return mapped;
      },
    );

    const mapped: Article = {
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt ?? undefined,
      intro: row.intro,
      researchNote: {
        title: row.researchNoteTitle,
        content: row.researchNoteContent,
      },
      products: articleProducts,
      publishedAt: toIsoDate(row.publishedAt),
      updatedAt: toIsoDate(row.updatedAtContent),
      author: row.author ?? undefined,
    };

    if (row.ogImageSrc && row.ogImageAlt) {
      mapped.ogImage = {
        src: row.ogImageSrc,
        alt: row.ogImageAlt,
      };
    }

    return mapped;
  });

  const comparisonTableSection = sectionsByKey["comparison-table"];
  const comparisonTableConfig = comparisonTableSection?.config as
    | { rowHeaderLabel?: string }
    | undefined;

  const comparisonTableRows: ComparisonRow[] = comparisonRowRows.map((row) => ({
    key: row.key,
    label: row.label,
    type: row.type,
  }));

  const topPicksSection = sectionsByKey["top-picks"];
  const productDirectorySection = sectionsByKey["product-directory"];
  const buyingGuideSection = sectionsByKey["buying-guide"];
  const footerSection = sectionsByKey["footer"];

  const siteData: SiteData = {
    slug: site.slug,
    title: site.title,
    metaTitle: site.metaTitle,
    metaDescription: site.metaDescription,
    niche: site.niche,
    siteUrl: site.siteUrl,
    ratingScale: site.ratingScale as 5 | 10,
    headerBrandImage: site.headerBrandImage ?? undefined,
    hero: {
      eyebrow: heroRow.eyebrow ?? undefined,
      headline: heroRow.headline,
      subheadline: heroRow.subheadline,
      primaryCta: heroRow.primaryCta,
      secondaryCta: heroRow.secondaryCta ?? undefined,
      secondaryCtaHref: heroRow.secondaryCtaHref ?? undefined,
      image:
        heroRow.imageSrc && heroRow.imageAlt
          ? {
              src: heroRow.imageSrc,
              srcMobile: heroRow.imageSrcMobile ?? undefined,
              alt: heroRow.imageAlt,
            }
          : undefined,
    },
    topPicks: {
      title: topPicksSection?.title ?? "Top picks",
      description: sectionText(topPicksSection?.description),
    },
    products: hydratedProducts,
    productDirectory: {
      title: productDirectorySection?.title ?? "Products",
      description: sectionText(productDirectorySection?.description),
    },
    comparisonTable: {
      title: comparisonTableSection?.title ?? "Comparison",
      description: sectionText(comparisonTableSection?.description),
      rowHeaderLabel: comparisonTableConfig?.rowHeaderLabel,
      rows: comparisonTableRows,
    },
    buyingGuide: {
      title: buyingGuideSection?.title ?? "Buying guide",
      sections: buyingGuideRows.map((row) => ({
        title: row.title,
        content: row.content,
      })),
    },
    faqs: faqRows.map((row) => ({
      question: row.question,
      answer: row.answer,
    })),
    articles: hydratedArticles,
    newsletter: {
      title: site.newsletterTitle,
      description: site.newsletterDescription,
      buttonText: site.newsletterButtonText,
      successMessage: site.newsletterSuccessMessage,
    },
    affiliateDisclosure: site.affiliateDisclosure,
    footer: {
      tagline: sectionText(footerSection?.title),
      links: footerLinkRows.map((row) => ({
        label: row.label,
        href: row.href,
      })),
    },
    features: {
      researchScorePage: Boolean(
        (site.features as { researchScorePage?: unknown } | null)
          ?.researchScorePage,
      ),
    },
  };

  if (site.adsPrimary && site.adsSecondary) {
    siteData.ads = {
      slots: {
        primary: site.adsPrimary,
        secondary: site.adsSecondary,
      },
    };
  }

  return siteData;
}
