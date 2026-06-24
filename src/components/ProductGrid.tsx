import { siteConfig } from "@/config/active-site";
import { getTopProducts } from "@/data/active-products";
import { ProductCard } from "@/components/ProductCard";

export function ProductGrid() {
  const topProducts = getTopProducts(3);

  return (
    <section className="py-16 md:py-20" aria-labelledby="top-picks-heading">
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
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
