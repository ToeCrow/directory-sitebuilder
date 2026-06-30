import Link from "next/link";
import type { Product } from "@/types/product";
import { StarRating } from "@/components/StarRating";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-4">
        <h3 className="text-xl font-semibold text-slate-900">
          <Link
            href={`/products/${product.slug}`}
            className="hover:text-blue-600"
          >
            {product.name}
          </Link>
        </h3>
        <StarRating rating={product.rating} />
      </div>

      <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-600">
        {product.description}
      </p>

      <dl className="mb-6 space-y-2 text-sm">
        <div>
          <dt className="font-medium text-slate-500">Best for</dt>
          <dd className="text-slate-800">{product.bestFor}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Price from</dt>
          <dd className="text-slate-800">{product.priceFrom}</dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-col gap-2 sm:flex-row">
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
        >
          Read review
        </Link>
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener sponsored"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Visit site
        </a>
      </div>
    </article>
  );
}
