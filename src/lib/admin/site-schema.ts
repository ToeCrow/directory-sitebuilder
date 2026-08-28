import { z } from "zod";

export const siteStatusSchema = z.enum(["draft", "published"]);

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((value) => (value ? value : null));

export const siteSettingsSchema = z.object({
  title: z.string().trim().min(1).max(200),
  metaTitle: z.string().trim().min(1).max(200),
  metaDescription: z.string().trim().min(1).max(500),
  niche: z.string().trim().min(1).max(200),
  siteUrl: z.string().trim().url(),
  headerBrandImage: optionalText(500),
  affiliateDisclosure: z.string().trim().min(1).max(4000),
  newsletterTitle: z.string().trim().min(1).max(200),
  newsletterDescription: z.string().trim().min(1).max(1000),
  newsletterButtonText: z.string().trim().min(1).max(100),
  newsletterSuccessMessage: z.string().trim().min(1).max(500),
  adsPrimary: optionalText(200),
  adsSecondary: optionalText(200),
  status: siteStatusSchema,
  researchScorePage: z.boolean(),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

export const siteHeroSchema = z.object({
  eyebrow: optionalText(200),
  headline: z.string().trim().min(1).max(300),
  subheadline: z.string().trim().min(1).max(500),
  primaryCta: z.string().trim().min(1).max(100),
  secondaryCta: optionalText(100),
  secondaryCtaHref: optionalText(500),
  imageSrc: optionalText(500),
  imageSrcMobile: optionalText(500),
  imageAlt: optionalText(300),
});

export type SiteHeroInput = z.infer<typeof siteHeroSchema>;

export const siteSectionsSchema = z.object({
  topPicksTitle: z.string().trim().min(1).max(300),
  topPicksDescription: optionalText(1000),
  productDirectoryTitle: z.string().trim().min(1).max(300),
  productDirectoryDescription: optionalText(1000),
  comparisonTitle: z.string().trim().min(1).max(300),
  comparisonDescription: optionalText(1000),
  comparisonRowHeaderLabel: optionalText(200),
  buyingGuideTitle: z.string().trim().min(1).max(300),
  footerTagline: optionalText(500),
});

export type SiteSectionsInput = z.infer<typeof siteSectionsSchema>;

export const comparisonSectionSchema = z.object({
  title: z.string().trim().min(1).max(300),
  description: optionalText(1000),
  rowHeaderLabel: optionalText(200),
});

export type ComparisonSectionInput = z.infer<typeof comparisonSectionSchema>;

export const buyingGuideTitleSchema = z.object({
  title: z.string().trim().min(1).max(300),
});

export const footerTaglineSchema = z.object({
  tagline: optionalText(500),
});
