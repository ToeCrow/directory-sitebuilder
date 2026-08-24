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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-fwn-gold/20 bg-fwn-panel p-0 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.8)] transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-fwn-gold/50 hover:shadow-[0_28px_50px_-24px_rgba(196,163,106,0.4)]">
      <Link
        href={href}
        className="absolute inset-0 z-0"
        aria-labelledby={headingId}
      >
        <span className="sr-only">Read {product.name} overview</span>
      </Link>

      <div className="pointer-events-none relative mb-4 aspect-4/3 overflow-hidden border-b border-fwn-gold/15 bg-fwn-ivory">
        {product.image ? (
          <ProductMediaImage
            src={product.image.src}
            alt={product.image.alt}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="p-3 transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-fwn-ivory" />
        )}
      </div>

      <div className="pointer-events-none relative flex flex-1 flex-col px-6 pb-6">
        <p className="truncate text-xs font-semibold uppercase tracking-[0.18em] text-fwn-gold">
          {categoryLabel ? `${categoryLabel} · ${product.typeLabel}` : product.typeLabel}
        </p>
        <h2
          id={headingId}
          className="mt-2 line-clamp-2 min-h-[3.5rem] text-xl font-semibold tracking-tight text-fwn-ivory transition-colors group-hover:text-fwn-gold"
        >
          {product.name}
        </h2>
        <p className="mt-3 line-clamp-3 min-h-[4.125rem] text-sm leading-relaxed text-fwn-sand">
          {product.shortDescription}
        </p>
        <p className="mt-auto pt-5 text-sm font-medium tracking-wide text-fwn-gold group-hover:text-fwn-ivory">
          Read overview →
        </p>
      </div>
    </article>
  );
}
