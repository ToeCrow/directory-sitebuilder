import { revalidatePath } from "next/cache";

/**
 * Revalidate every public path that could render data owned by a site, plus
 * the admin list pages that summarize cross-site data. Individual admin
 * detail pages (e.g. `/admin/products/[productId]`) are revalidated by their
 * own actions since they need the specific id.
 */
export function revalidateSitePaths(siteSlug: string): void {
  revalidatePath(`/${siteSlug}`, "layout");
  revalidatePath(`/${siteSlug}/affiliate`);
  revalidatePath(`/${siteSlug}/research-score`);
  revalidatePath(`/${siteSlug}/articles`);

  revalidatePath("/admin/sites");
  revalidatePath("/admin/products");
  revalidatePath("/admin/top-picks");
  revalidatePath("/admin/comparison");
  revalidatePath("/admin/faq");
  revalidatePath("/admin/buying-guide");
  revalidatePath("/admin/footer");
  revalidatePath("/admin/articles");
}
