import { z } from "zod";
import { ARTICLE_SLUG_PATTERN } from "@/lib/slug";

export const articleStatusSchema = z.enum(["draft", "published"]);
export const articleKindSchema = z.enum(["editorial", "product-roundup"]);

export const articleSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(200)
  .regex(ARTICLE_SLUG_PATTERN, "Slug must be lowercase kebab-case");

export const internalLinkAttrsSchema = z.object({
  articleId: z.string().uuid(),
});

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((value) => (value ? value : null));

const optionalDate = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => (value ? value : null));

const optionalUuidList = z
  .array(z.string().uuid())
  .optional()
  .default([]);

export const articleCreateSchema = z.object({
  siteId: z.string().uuid(),
  kind: articleKindSchema,
  title: z.string().trim().min(1).max(300),
  slug: articleSlugSchema,
});

export type ArticleCreateInput = z.infer<typeof articleCreateSchema>;

export const articleUpdateSchema = z.object({
  title: z.string().trim().min(1).max(300),
  slug: articleSlugSchema,
  excerpt: optionalText(500),
  introText: z.string(),
  researchNoteTitle: z.string().trim().max(200).optional().default(""),
  researchNoteContent: z.string().trim().max(4000).optional().default(""),
  author: optionalText(200),
  ogImageSrc: optionalText(500),
  ogImageAlt: optionalText(300),
  status: articleStatusSchema,
  publishedAt: optionalDate,
  updatedAtContent: optionalDate,
  relatedArticleIds: optionalUuidList,
  body: z.unknown().optional(),
});

export type ArticleUpdateInput = z.infer<typeof articleUpdateSchema>;

export const articleProductSectionSchema = z.object({
  heading: z.string().trim().min(1).max(300),
  intro: optionalText(1000),
  imageSrc: optionalText(500),
  imageAlt: optionalText(300),
  whatItIs: z.string().trim().min(1).max(4000),
  whyItEarnsASpotText: z.string(),
  whereItFallsShortText: z.string(),
  bestFor: z.string().trim().min(1).max(500),
  skipIf: z.string().trim().min(1).max(500),
  sortOrder: z.number().int().min(1),
  productId: z.string().uuid().optional().nullable(),
});

export type ArticleProductSectionInput = z.infer<
  typeof articleProductSectionSchema
>;

export const articleProductSectionCreateSchema =
  articleProductSectionSchema.extend({
    productId: z.string().uuid(),
  });

export type ArticleProductSectionCreateInput = z.infer<
  typeof articleProductSectionCreateSchema
>;
