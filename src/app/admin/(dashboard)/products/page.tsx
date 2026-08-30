import Link from "next/link";
import { listAdminProducts } from "@/lib/admin/products";
import { listAdminSites } from "@/lib/admin/sites";
import { AffiliateToggle } from "./AffiliateToggle";
import { StatusControls } from "./StatusControls";

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams: Promise<{ site?: string }>;
};

export default async function AdminProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { site: siteFilter } = await searchParams;
  let products: Awaited<ReturnType<typeof listAdminProducts>> = [];
  let sites: Awaited<ReturnType<typeof listAdminSites>> = [];
  let loadError: string | null = null;

  try {
    [products, sites] = await Promise.all([
      listAdminProducts(siteFilter || undefined),
      listAdminSites(),
    ]);
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Could not load products from the database.";
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Products
          </h1>
          <p className="mt-2 text-slate-600">
            Edit listings, affiliate flags, and publish status. Saving
            a published product updates the public site immediately.
          </p>
        </div>
        <Link
          href={
            siteFilter
              ? `/admin/products/new?site=${siteFilter}`
              : "/admin/products/new"
          }
          className="inline-flex rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Add product
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/admin/products"
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            !siteFilter
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-700 ring-1 ring-slate-200"
          }`}
        >
          All sites
        </Link>
        {sites.map((site) => (
          <Link
            key={site.slug}
            href={`/admin/products?site=${site.slug}`}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              siteFilter === site.slug
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200"
            }`}
          >
            {site.title}
          </Link>
        ))}
      </div>

      {loadError && (
        <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError} Start Postgres with <code>npm run db:up</code>, then{" "}
          <code>npm run db:migrate</code> and <code>npm run db:seed</code>.
        </p>
      )}

      {!loadError && products.length === 0 && (
        <p className="mt-6 text-sm text-slate-600">
          No products found. Run <code>npm run db:seed</code> if the database is
          empty.
        </p>
      )}

      {products.length > 0 && (
        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Site</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Affiliate</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-500">/{product.slug}</p>
                    {product.isTopPick && (
                      <p className="mt-1 text-xs font-medium text-blue-700">
                        Top pick #{product.topPickSortOrder}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {product.siteTitle}
                  </td>
                  <td className="px-4 py-3">
                    <StatusControls
                      productId={product.id}
                      status={product.status}
                      isTopPick={product.isTopPick}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <AffiliateToggle
                      productId={product.id}
                      checked={product.hasAffiliatePartnership}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
