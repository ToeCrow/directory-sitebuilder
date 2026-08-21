import Link from "next/link";
import type { DirectoryProduct } from "@/types/directory-catalog";

type DirectoryProductCardProps = {
  product: DirectoryProduct;
  href: string;
};

export function DirectoryProductCard({
  product,
  href,
}: DirectoryProductCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {product.typeLabel}
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
        <Link href={href} className="hover:text-blue-700">
          {product.name}
        </Link>
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        {product.shortDescription}
      </p>
      <p className="mt-5">
        <Link
          href={href}
          className="text-sm font-medium text-blue-700 hover:text-blue-800"
        >
          Read overview →
        </Link>
      </p>
    </article>
  );
}
