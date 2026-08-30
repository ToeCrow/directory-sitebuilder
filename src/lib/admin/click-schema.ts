import { z } from "zod";

export const clickEventSchema = z.object({
  siteSlug: z.string().trim().min(1).max(80),
  sourceType: z.string().trim().min(1).max(40).default("page"),
  sourceId: z.string().trim().max(80).optional().nullable(),
  sourcePath: z.string().trim().max(500).optional().nullable(),
  placement: z.string().trim().min(1).max(80),
  targetType: z.string().trim().min(1).max(40).default("path"),
  targetId: z.string().trim().max(80).optional().nullable(),
  targetUrl: z.string().trim().max(2000).optional().nullable(),
  label: z.string().trim().max(200).optional().nullable(),
});
