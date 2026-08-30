import { revalidatePath } from "next/cache";
import { getArticleConfig } from "@/lib/site-config";

/**
 * Revalidate every public path that could render data owned by a site, plus
 * the admin list pages that summarize cross-site data. Individual admin
 * detail pages (e.g. `/admin/products/[productId]`) are revalidated by their
 * own actions since they need the specific id.
 */
export function revalidateSitePaths(siteSlug: string): void {
  const articleRoute = getArticleConfig(siteSlug)?.route ?? "reviews";

  revalidatePath(`/${siteSlug}`, "layout");
  revalidatePath(`/${siteSlug}/affiliate`);
  revalidatePath(`/${siteSlug}/research-score`);
  revalidatePath(`/${siteSlug}/${articleRoute}`);

  revalidatePath("/admin/sites");
  revalidatePath("/admin/products");
  revalidatePath("/admin/top-picks");
  revalidatePath("/admin/comparison");
  revalidatePath("/admin/faq");
  revalidatePath("/admin/buying-guide");
  revalidatePath("/admin/footer");
  revalidatePath("/admin/articles");
}

export function revalidateForArticle(
  siteSlug: string,
  articleSlug: string,
  articleId: string,
): void {
  const articleRoute = getArticleConfig(siteSlug)?.route ?? "reviews";
  revalidateSitePaths(siteSlug);
  revalidatePath(`/${siteSlug}/${articleRoute}/${articleSlug}`);
  revalidatePath(`/admin/articles/${articleId}`);
  revalidatePath("/admin/articles/new");
}
