import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const publishStatusEnum = pgEnum("publish_status", [
  "draft",
  "published",
]);

export const comparisonRowTypeEnum = pgEnum("comparison_row_type", [
  "text",
  "boolean",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
};

export const sites = pgTable(
  "sites",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    metaTitle: text("meta_title").notNull(),
    metaDescription: text("meta_description").notNull(),
    niche: text("niche").notNull(),
    siteUrl: text("site_url").notNull(),
    ratingScale: smallint("rating_scale").notNull(),
    headerBrandImage: text("header_brand_image"),
    favicon: text("favicon"),
    affiliateDisclosure: text("affiliate_disclosure").notNull(),
    newsletterTitle: text("newsletter_title").notNull(),
    newsletterDescription: text("newsletter_description").notNull(),
    newsletterButtonText: text("newsletter_button_text").notNull(),
    newsletterSuccessMessage: text("newsletter_success_message").notNull(),
    adsPrimary: text("ads_primary"),
    adsSecondary: text("ads_secondary"),
    status: publishStatusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    features: jsonb("features")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("sites_slug_uidx").on(table.slug),
    check("sites_rating_scale_check", sql`${table.ratingScale} IN (5, 10)`),
  ],
);

export const siteDomains = pgTable(
  "site_domains",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id, { onDelete: "cascade" }),
    host: text("host").notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("site_domains_host_uidx").on(table.host)],
);

export const siteHeroes = pgTable(
  "site_heroes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id, { onDelete: "cascade" }),
    eyebrow: text("eyebrow"),
    headline: text("headline").notNull(),
    subheadline: text("subheadline").notNull(),
    primaryCta: text("primary_cta").notNull(),
    secondaryCta: text("secondary_cta"),
    secondaryCtaHref: text("secondary_cta_href"),
    imageSrc: text("image_src"),
    imageSrcMobile: text("image_src_mobile"),
    imageAlt: text("image_alt"),
    ...timestamps,
  },
  (table) => [uniqueIndex("site_heroes_site_uidx").on(table.siteId)],
);

export const siteSections = pgTable(
  "site_sections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id, { onDelete: "cascade" }),
    sectionKey: text("section_key").notNull(),
    title: text("title"),
    description: text("description"),
    config: jsonb("config").$type<Record<string, unknown>>(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("site_sections_site_key_uidx").on(
      table.siteId,
      table.sectionKey,
    ),
  ],
);

export const comparisonRows = pgTable(
  "comparison_rows",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    label: text("label").notNull(),
    type: comparisonRowTypeEnum("type").notNull().default("text"),
    sortOrder: integer("sort_order").notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("comparison_rows_site_key_uidx").on(table.siteId, table.key),
  ],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    shortDescription: text("short_description").notNull(),
    bestFor: text("best_for").notNull(),
    priceFrom: text("price_from").notNull(),
    features: text("features").array().notNull().default(sql`'{}'::text[]`),
    pros: text("pros").array().notNull().default(sql`'{}'::text[]`),
    cons: text("cons").array().notNull().default(sql`'{}'::text[]`),
    affiliateUrl: text("affiliate_url").notNull(),
    hasAffiliatePartnership: boolean("has_affiliate_partnership")
      .notNull()
      .default(false),
    rating: numeric("rating", { precision: 3, scale: 1 }).notNull(),
    researchScoreBreakdown: jsonb(
      "research_score_breakdown",
    ).$type<Record<string, number>>(),
    badge: text("badge"),
    comparisonRank: integer("comparison_rank").notNull(),
    directorySortOrder: integer("directory_sort_order").notNull(),
    comparison: jsonb("comparison")
      .$type<Record<string, string | boolean>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    content: jsonb("content")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    status: publishStatusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("products_site_slug_uidx").on(table.siteId, table.slug),
    check("products_rating_gte_zero", sql`${table.rating} >= 0`),
  ],
);

export const siteTopPicks = pgTable(
  "site_top_picks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    sortOrder: integer("sort_order").notNull(),
    badgeOverride: text("badge_override"),
    headingOverride: text("heading_override"),
    descriptionOverride: text("description_override"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("site_top_picks_site_product_uidx").on(
      table.siteId,
      table.productId,
    ),
  ],
);

export const faqs = pgTable("faqs", {
  id: uuid("id").defaultRandom().primaryKey(),
  siteId: uuid("site_id")
    .notNull()
    .references(() => sites.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").notNull(),
  ...timestamps,
});

export const buyingGuideSections = pgTable("buying_guide_sections", {
  id: uuid("id").defaultRandom().primaryKey(),
  siteId: uuid("site_id")
    .notNull()
    .references(() => sites.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  sortOrder: integer("sort_order").notNull(),
  ...timestamps,
});

export const footerLinks = pgTable("footer_links", {
  id: uuid("id").defaultRandom().primaryKey(),
  siteId: uuid("site_id")
    .notNull()
    .references(() => sites.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  href: text("href").notNull(),
  sortOrder: integer("sort_order").notNull(),
  ...timestamps,
});

export const articles = pgTable(
  "articles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    excerpt: text("excerpt"),
    intro: text("intro").array().notNull().default(sql`'{}'::text[]`),
    researchNoteTitle: text("research_note_title").notNull(),
    researchNoteContent: text("research_note_content").notNull(),
    author: text("author"),
    ogImageSrc: text("og_image_src"),
    ogImageAlt: text("og_image_alt"),
    content: jsonb("content")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    status: publishStatusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    updatedAtContent: timestamp("content_updated_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("articles_site_slug_uidx").on(table.siteId, table.slug),
  ],
);

export const articleProductSections = pgTable("article_product_sections", {
  id: uuid("id").defaultRandom().primaryKey(),
  articleId: uuid("article_id")
    .notNull()
    .references(() => articles.id, { onDelete: "cascade" }),
  heading: text("heading").notNull(),
  intro: text("intro"),
  imageSrc: text("image_src"),
  imageAlt: text("image_alt"),
  whatItIs: text("what_it_is").notNull(),
  whyItEarnsASpot: text("why_it_earns_a_spot")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  whereItFallsShort: text("where_it_falls_short")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  bestFor: text("best_for").notNull(),
    skipIf: text("skip_if").notNull(),
    productSlug: text("product_slug"),
    productVariant: text("product_variant"),
    sortOrder: integer("sort_order").notNull(),
  ...timestamps,
});
