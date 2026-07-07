import type { SiteSlug } from "@/data/sites";
import { getDirectoryProducts, getSiteData } from "@/lib/site";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/cn";

type ProductDirectoryProps = {
  siteSlug: SiteSlug;
  className?: string;
};

// TODO: add category filters (mattress, pillow, topper).
// TODO: add pagination for large catalogs.
// TODO: load products from PostgreSQL via admin/CMS.

export function ProductDirectory({ siteSlug, className }: ProductDirectoryProps) {
  const siteData = getSiteData(siteSlug);
  const directoryProducts = getDirectoryProducts(siteSlug);
  const { productDirectory } = siteData;

  return (
    <section
      id="directory"
      className={cn("py-16 md:py-20", className)}
      aria-labelledby="directory-heading"
    >
      <div className="mx-auto max-w-6xl px-4">
        <h2
          id="directory-heading"
          className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl"
        >
          {productDirectory.title}
        </h2>
        {productDirectory.description && (
          <p className="mt-2 max-w-2xl text-slate-600">
            {productDirectory.description}
          </p>
        )}
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {directoryProducts.map((product) => (
            <ProductCard
              key={product.slug}
              siteSlug={siteSlug}
              product={product}
              variant="directory"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
