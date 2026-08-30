import Link from "next/link";
import { listAdminSites } from "@/lib/admin/sites";
import { getNextProductSortOrders } from "@/lib/admin/products";
import { requireAdminUser } from "@/lib/admin/session";
import { ProductCreateForm } from "./ProductCreateForm";

export const dynamic = "force-dynamic";

type NewProductPageProps = {
  searchParams: Promise<{ site?: string }>;
};

export default async function AdminNewProductPage({
  searchParams,
}: NewProductPageProps) {
  const { site: siteSlugFilter } = await searchParams;
  const user = await requireAdminUser();
  let sites: Awaited<ReturnType<typeof listAdminSites>> = [];
  let loadError: string | null = null;
  let defaultSort = { comparisonRank: 1, directorySortOrder: 1 };

  try {
    sites = await listAdminSites(user);
    const preferred =
      sites.find((s) => s.slug === siteSlugFilter) ?? sites[0] ?? null;
    if (preferred) {
      defaultSort = await getNextProductSortOrders(preferred.id);
    }
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Could not load sites from the database.";
  }

  const initialSiteId =
    sites.find((s) => s.slug === siteSlugFilter)?.id ?? sites[0]?.id ?? "";

  return (
    <div>
      <Link
        href="/admin/products"
        className="text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        ← Back to products
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        Add product
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        New products default to draft until you publish them.
      </p>

      {loadError && (
        <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError}
        </p>
      )}

      {!loadError && sites.length === 0 && (
        <p className="mt-6 text-sm text-slate-600">
          No sites found. Seed the database first.
        </p>
      )}

      {!loadError && sites.length > 0 && (
        <div className="mt-8">
          <ProductCreateForm
            sites={sites.map((site) => ({
              id: site.id,
              title: site.title,
              slug: site.slug,
            }))}
            initialSiteId={initialSiteId}
            initialComparisonRank={defaultSort.comparisonRank}
            initialDirectorySortOrder={defaultSort.directorySortOrder}
          />
        </div>
      )}
    </div>
  );
}
