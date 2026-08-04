"use client";

import Link from "next/link";
import type { SiteSlug } from "@/data/sites";
import { usePublicBasePath } from "@/context/SiteContext";
import {
  getDirectoryProducts,
  getSiteData,
} from "@/lib/site";
import type { ProductCategory } from "@/types/site";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/cn";
import { getProductsIndexPath } from "@/lib/paths";

type ProductDirectoryProps = {
  siteSlug: SiteSlug;
  className?: string;
  category?: Extract<ProductCategory, "mattress" | "pillow" | "topper">;
  showCategoryFilters?: boolean;
};

export function ProductDirectory({
  siteSlug,
  className,
  category,
  showCategoryFilters = false,
}: ProductDirectoryProps) {
  const publicBasePath = usePublicBasePath();
  const siteData = getSiteData(siteSlug);
  const directoryProducts = getDirectoryProducts(
    siteSlug,
    category,
  );
  const { productDirectory } = siteData;

  const filters = [
    { key: undefined, label: "All", href: getProductsIndexPath(publicBasePath) },
    {
      key: "mattress" as const,
      label: "Mattresses",
      href: getProductsIndexPath(publicBasePath, "mattress"),
    },
    {
      key: "pillow" as const,
      label: "Pillows",
      href: getProductsIndexPath(publicBasePath, "pillow"),
    },
    {
      key: "topper" as const,
      label: "Toppers",
      href: getProductsIndexPath(publicBasePath, "topper"),
    },
  ];

  return (
    <section
      id="directory"
      className={cn("scroll-mt-24 py-16 md:py-20", className)}
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

        {showCategoryFilters && (
          <div className="mt-6 flex flex-wrap gap-2" role="navigation" aria-label="Product categories">
            {filters.map((filter) => {
              const active = category === filter.key;
              return (
                <Link
                  key={filter.label}
                  href={filter.href}
                  scroll={false}
                  className={cn(
                    "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {filter.label}
                </Link>
              );
            })}
          </div>
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
