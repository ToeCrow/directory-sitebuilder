"use client";

import Link from "next/link";
import type { DirectoryProduct } from "@/types/directory-catalog";
import { ProductMediaImage } from "@/components/ProductMediaImage";

type DirectoryProductCardProps = {
  product: DirectoryProduct;
  href: string;
  categoryLabel?: string;
};

export function DirectoryProductCard({
  product,
  href,
  categoryLabel,
}: DirectoryProductCardProps) {
  const headingId = `directory-product-${product.slug}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-0 shadow-sm transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <Link
        href={href}
        className="absolute inset-0 z-0"
        aria-labelledby={headingId}
      >
        <span className="sr-only">Read {product.name} overview</span>
      </Link>

      <div className="pointer-events-none relative mb-4 aspect-4/3 overflow-hidden border-b border-slate-200 bg-slate-100">
        {product.image ? (
          <ProductMediaImage
            src={product.image.src}
            alt={product.image.alt}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="p-3 transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-100" />
        )}
      </div>

      <div className="pointer-events-none relative flex flex-1 flex-col px-6 pb-6">
        <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-500">
          {categoryLabel ? `${categoryLabel} · ${product.typeLabel}` : product.typeLabel}
        </p>
        <h2
          id={headingId}
          className="mt-2 line-clamp-2 min-h-[3.5rem] text-xl font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-blue-600"
        >
          {product.name}
        </h2>
        <p className="mt-3 line-clamp-3 min-h-[4.125rem] text-sm leading-relaxed text-slate-600">
          {product.shortDescription}
        </p>
        <p className="mt-auto pt-5 text-sm font-medium text-blue-700 group-hover:text-blue-800">
          Read overview →
        </p>
      </div>
    </article>
  );
}
