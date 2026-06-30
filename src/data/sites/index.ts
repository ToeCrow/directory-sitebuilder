import * as constructionSoftware from "./construction-software/products";
import type { SiteId } from "@/config/sites";

export const productModules = {
  "construction-software": constructionSoftware,
} as const satisfies Record<SiteId, typeof constructionSoftware>;
