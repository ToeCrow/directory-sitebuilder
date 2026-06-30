import type { SiteId } from "@/config/sites";
import { getSiteConfig, getTopProducts } from "@/lib/site";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/cn";

type ProductGridProps = {
  siteSlug: SiteId;
  className?: string;
};

export function ProductGrid({ siteSlug, className }: ProductGridProps) {
  const siteConfig = getSiteConfig(siteSlug);
  const topProducts = getTopProducts(siteSlug, 3);

  return (
    <section
      className={cn("py-16 md:py-20", className)}
      aria-labelledby="top-picks-heading"
    >
      <div className="mx-auto max-w-6xl px-4">
        <h2
          id="top-picks-heading"
          className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl"
        >
          {siteConfig.productGrid.title}
        </h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          {siteConfig.productGrid.description}
        </p>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topProducts.map((product) => (
            <ProductCard
              key={product.slug}
              siteSlug={siteSlug}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
