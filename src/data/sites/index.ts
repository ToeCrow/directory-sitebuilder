import * as constructionManagement from "./construction-management/products";
import type { SiteId } from "@/config/sites";

export const productModules = {
  "construction-management": constructionManagement,
} as const satisfies Record<SiteId, typeof constructionManagement>;
