import { z } from "zod";

export { linesToArray } from "./lines";

export const productStatusSchema = z.enum(["draft", "published"]);

export function buildProductUpdateSchema() {
  return z.object({
    name: z.string().trim().min(1).max(200),
    slug: z
      .string()
      .trim()
      .min(1)
      .max(200)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
    shortDescription: z.string().trim().min(1).max(2000),
    bestFor: z.string().trim().min(1).max(500),
    priceFrom: z.string().trim().min(1).max(100),
    featuresText: z.string(),
    prosText: z.string(),
    consText: z.string(),
    affiliateUrl: z.string().trim().url(),
    hasAffiliatePartnership: z.boolean(),
    badge: z.string().trim().max(100).optional().nullable(),
    comparisonRank: z.number().int().min(1),
    directorySortOrder: z.number().int().min(1),
    status: productStatusSchema,
  });
}

export function buildProductCreateSchema() {
  return buildProductUpdateSchema().extend({
    siteId: z.string().uuid(),
  });
}

export type ProductUpdateInput = z.infer<
  ReturnType<typeof buildProductUpdateSchema>
>;

export type ProductCreateInput = z.infer<
  ReturnType<typeof buildProductCreateSchema>
>;
