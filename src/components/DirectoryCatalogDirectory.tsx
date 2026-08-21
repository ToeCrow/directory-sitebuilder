"use client";

import Link from "next/link";
import type { DirectoryCategory, DirectoryProduct } from "@/types/directory-catalog";
import { DirectoryProductCard } from "@/components/DirectoryProductCard";
import { getDirectoryReviewPath, getProductsIndexPath } from "@/lib/paths";
import { cn } from "@/lib/cn";

type DirectoryCatalogDirectoryProps = {
  publicBasePath: string;
  categories: DirectoryCategory[];
  products: DirectoryProduct[];
  activeCategorySlug?: string;
  title: string;
  description?: string;
};

export function DirectoryCatalogDirectory({
  publicBasePath,
  categories,
  products,
  activeCategorySlug,
  title,
  description,
}: DirectoryCatalogDirectoryProps) {
  const categoryNameBySlug = new Map(
    categories.map((category) => [category.slug, category.name]),
  );

  const filters = [
    { slug: undefined, label: "All", href: getProductsIndexPath(publicBasePath) },
    ...categories.map((category) => ({
      slug: category.slug,
      label: category.name,
      href: getProductsIndexPath(publicBasePath, category.slug),
    })),
  ];

  return (
    <section
      id="directory"
      className="scroll-mt-24 py-10 md:py-12"
      aria-labelledby="directory-heading"
    >
      <div className="mx-auto max-w-6xl px-4">
        <h2
          id="directory-heading"
          className={
            title
              ? "text-2xl font-bold tracking-tight text-slate-900 md:text-3xl"
              : "sr-only"
          }
        >
          {title || "Product directory"}
        </h2>
        {description && (
          <p className="mt-2 max-w-2xl text-slate-600">{description}</p>
        )}

        <div
          className="mt-6 flex flex-wrap gap-2"
          role="navigation"
          aria-label="Product categories"
        >
          {filters.map((filter) => {
            const active = activeCategorySlug === filter.slug;
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

        <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <li key={product.slug}>
              <DirectoryProductCard
                product={product}
                href={getDirectoryReviewPath(
                  publicBasePath,
                  product.categorySlug,
                  product.reviewSlug,
                )}
                categoryLabel={
                  activeCategorySlug
                    ? undefined
                    : categoryNameBySlug.get(product.categorySlug)
                }
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
