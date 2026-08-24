"use client";

import Image from "next/image";
import Link from "next/link";
import type { SiteSlug } from "@/data/sites";
import { usePublicBasePath } from "@/context/SiteContext";
import { getSiteData, siteShowsProductRatings } from "@/lib/site";
import type { Product, ProductCategory } from "@/types/site";
import { StarRating } from "@/components/StarRating";
import { cn } from "@/lib/cn";
import { getProductPath } from "@/lib/paths";
import { buyLinkRel, getBuyUrl } from "@/lib/product-links";

type ProductCardProps = {
  siteSlug: SiteSlug;
  product: Product;
  variant?: "featured" | "directory";
};

function ProductImagePlaceholder({ category }: { category: ProductCategory }) {
  const label =
    category === "pillow"
      ? "Pillow"
      : category === "topper"
        ? "Topper"
        : "Mattress";

  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-linear-to-br from-slate-100 via-slate-50 to-blue-50"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.45) 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-blue-100/60 blur-2xl" />
      <div className="absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-slate-200/70 blur-2xl" />
      <div className="relative flex flex-col items-center gap-2 text-slate-400">
        {category === "pillow" ? (
          <svg
            viewBox="0 0 48 48"
            className="h-12 w-12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              d="M8 22c0-5 4-9 10-9h12c6 0 10 4 10 9v4c0 5-4 9-10 9H18c-6 0-10-4-10-9v-4Z"
              strokeLinejoin="round"
            />
            <path d="M12 22h24" strokeLinecap="round" opacity="0.5" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 48 48"
            className="h-12 w-12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="6" y="16" width="36" height="16" rx="4" />
            <path d="M10 24h28" strokeLinecap="round" opacity="0.45" />
            <path d="M14 32v4M34 32v4" strokeLinecap="round" opacity="0.55" />
          </svg>
        )}
        <span className="text-xs font-medium tracking-wide text-slate-400">
          {label} photo coming soon
        </span>
      </div>
    </div>
  );
}

export function ProductCard({
  siteSlug,
  product,
  variant = "featured",
}: ProductCardProps) {
  const publicBasePath = usePublicBasePath();
  const showRating = siteShowsProductRatings(siteSlug);
  const siteData = showRating ? getSiteData(siteSlug) : null;
  const productHref = getProductPath(publicBasePath, product.slug);
  const buyHref = getBuyUrl(product);
  const isDirectory = variant === "directory";
  const headingId = `product-card-${product.slug}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-0 shadow-sm transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <Link
        href={productHref}
        className="absolute inset-0 z-0"
        aria-labelledby={headingId}
      >
        <span className="sr-only">View {product.name}</span>
      </Link>

      <div className="pointer-events-none relative mb-4 aspect-4/3 overflow-hidden border-b border-slate-200 bg-slate-100">
        {product.image ? (
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover object-center scale-[1.22] transition-transform duration-300 group-hover:scale-[1.28]"
          />
        ) : (
          <ProductImagePlaceholder category={product.category} />
        )}
      </div>

      <div
        className={cn(
          "pointer-events-none relative flex flex-1 flex-col",
          isDirectory ? "px-4 pb-4" : "px-6 pb-6",
        )}
      >
        <div className="mb-3">
          {product.badge && (
            <span className="mb-2 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              {product.badge}
            </span>
          )}
          <h3
            id={headingId}
            className={cn(
              "font-semibold text-slate-900 transition-colors group-hover:text-blue-600",
              isDirectory ? "text-lg" : "text-xl",
            )}
          >
            {product.name}
          </h3>
          {showRating && siteData && (
            <div
              className={cn(
                "mt-2",
                !isDirectory &&
                  "rounded-lg border border-slate-200 bg-slate-50 px-3 py-2",
              )}
            >
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                Rating
              </p>
              <StarRating
                rating={product.rating}
                maxRating={siteData.ratingScale}
                label="Rating"
              />
            </div>
          )}
        </div>

        <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-600">
          {product.shortDescription}
        </p>

        <dl className="mb-6 space-y-2 text-sm">
          <div>
            <dt className="font-medium text-slate-500">Best for</dt>
            <dd className="text-slate-800">{product.bestFor}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Price</dt>
            <dd className="text-slate-800">{product.priceDisplay}</dd>
          </div>
        </dl>

        <div className="pointer-events-auto relative z-10 mt-auto">
          <a
            href={buyHref}
            target="_blank"
            rel={buyLinkRel(product)}
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Check price & availability
          </a>
        </div>
      </div>
    </article>
  );
}
