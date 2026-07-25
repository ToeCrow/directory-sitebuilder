import { z } from "zod";

export const articleStatusSchema = z.enum(["draft", "published"]);

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

export const articleUpdateSchema = z.object({
  title: z.string().trim().min(1).max(300),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
  excerpt: optionalText(500),
  introText: z.string(),
  researchNoteTitle: z.string().trim().min(1).max(200),
  researchNoteContent: z.string().trim().min(1).max(4000),
  author: optionalText(200),
  ogImageSrc: optionalText(500),
  ogImageAlt: optionalText(300),
  status: articleStatusSchema,
  publishedAt: optionalDate,
  updatedAtContent: optionalDate,
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
});

export type ArticleProductSectionInput = z.infer<
  typeof articleProductSectionSchema
>;
