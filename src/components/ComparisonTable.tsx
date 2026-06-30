import type { SiteId } from "@/config/sites";
import { getSiteConfig, getProducts, productHasFeature } from "@/lib/site";
import { cn } from "@/lib/cn";

type ComparisonTableProps = {
  siteSlug: SiteId;
  className?: string;
};

export function ComparisonTable({ siteSlug, className }: ComparisonTableProps) {
  const siteConfig = getSiteConfig(siteSlug);
  const products = getProducts(siteSlug);

  return (
    <section
      id="compare"
      className={cn(
        "border-y border-slate-200 bg-slate-50 py-16 md:py-20",
        className,
      )}
      aria-labelledby="compare-heading"
    >
      <div className="mx-auto max-w-6xl px-4">
        <h2
          id="compare-heading"
          className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl"
        >
          Feature comparison
        </h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Side-by-side look at key features across all tools on this page.
        </p>

        <div className="mt-10 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th
                  scope="col"
                  className="px-4 py-3 font-semibold text-slate-900"
                >
                  Feature
                </th>
                {products.map((product) => (
                  <th
                    key={product.slug}
                    scope="col"
                    className="px-4 py-3 font-semibold text-slate-900"
                  >
                    {product.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {siteConfig.comparisonFeatures.map((feature) => (
                <tr
                  key={feature}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  <th
                    scope="row"
                    className="px-4 py-3 font-medium text-slate-700"
                  >
                    {feature}
                  </th>
                  {products.map((product) => {
                    const supported = productHasFeature(
                      siteSlug,
                      product,
                      feature,
                    );
                    return (
                      <td key={product.slug} className="px-4 py-3">
                        <span
                          className={
                            supported ? "text-green-600" : "text-slate-300"
                          }
                          aria-label={
                            supported
                              ? `${product.name} supports ${feature}`
                              : `${product.name} does not support ${feature}`
                          }
                        >
                          {supported ? "✓" : "—"}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="border-t border-slate-200 bg-slate-50">
                <th scope="row" className="px-4 py-3 font-medium text-slate-700">
                  Starting price
                </th>
                {products.map((product) => (
                  <td key={product.slug} className="px-4 py-3 text-slate-800">
                    {product.priceFrom}
                  </td>
                ))}
              </tr>
              <tr className="bg-slate-50">
                <th scope="row" className="px-4 py-3 font-medium text-slate-700">
                  Rating
                </th>
                {products.map((product) => (
                  <td key={product.slug} className="px-4 py-3 text-slate-800">
                    {product.rating}/5
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
