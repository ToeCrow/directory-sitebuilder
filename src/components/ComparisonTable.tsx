import type { SiteSlug } from "@/data/sites";
import { getComparisonProducts, getComparisonValue, getSiteData } from "@/lib/site";
import { cn } from "@/lib/cn";

type ComparisonTableProps = {
  siteSlug: SiteSlug;
  className?: string;
};

export function ComparisonTable({ siteSlug, className }: ComparisonTableProps) {
  const siteData = getSiteData(siteSlug);
  const products = getComparisonProducts(siteSlug);
  const { comparisonTable } = siteData;

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
          {comparisonTable.title}
        </h2>
        {comparisonTable.description && (
          <p className="mt-2 max-w-2xl text-slate-600">
            {comparisonTable.description}
          </p>
        )}

        <div className="mt-10 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th
                  scope="col"
                  className="px-4 py-3 font-semibold text-slate-900"
                >
                  {comparisonTable.rowHeaderLabel ?? "Feature"}
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
              {comparisonTable.rows.map((row) => (
                <tr
                  key={row.key}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  <th
                    scope="row"
                    className="px-4 py-3 font-medium text-slate-700"
                  >
                    {row.label}
                  </th>
                  {products.map((product) => {
                    const value = getComparisonValue(product, row.key);

                    if (row.type === "boolean") {
                      const supported = value === true;
                      return (
                        <td key={product.slug} className="px-4 py-3">
                          <span
                            className={
                              supported ? "text-green-600" : "text-slate-300"
                            }
                            aria-label={
                              supported
                                ? `${product.name} supports ${row.label}`
                                : `${product.name} does not support ${row.label}`
                            }
                          >
                            {supported ? "✓" : "—"}
                          </span>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={product.slug}
                        className="px-4 py-3 text-slate-800"
                      >
                        {typeof value === "string" ? value : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
