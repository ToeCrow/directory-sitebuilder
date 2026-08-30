"use client";

import Image from "next/image";
import { TrackedLink } from "@/components/TrackedLink";
import { usePublicBasePath } from "@/context/SiteContext";
import type { Product, ProductCategory } from "@/types/site";
import { cn } from "@/lib/cn";
import { getProductPath } from "@/lib/paths";
import { buyLinkRel, getBuyUrl } from "@/lib/product-links";

type ProductCardProps = {
  siteSlug: string;
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
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-ss-mist"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(22 50 79 / 0.18) 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-ss-teal/20 blur-2xl" />
      <div className="absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-ss-navy/10 blur-2xl" />
      <div className="relative flex flex-col items-center gap-2 text-ss-navy/40">
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
        <span className="text-xs font-medium tracking-wide text-ss-navy/45">
          {label} photo coming soon
        </span>
      </div>
    </div>
  );
}

export function ProductCard({
  product,
  variant = "featured",
}: ProductCardProps) {
  const publicBasePath = usePublicBasePath();
  const productHref = getProductPath(publicBasePath, product.slug);
  const buyHref = getBuyUrl(product);
  const isDirectory = variant === "directory";
  const headingId = `product-card-${product.slug}`;

  return (
    <article className="group relative flex flex-col overflow-hidden border border-ss-navy/10 bg-ss-paper transition-colors duration-200 hover:border-ss-navy/25">
      <TrackedLink
        href={productHref}
        placement="product-card"
        target={product.id ? { type: "product", id: product.id } : { type: "path" }}
        source={{ type: "page" }}
        label={`View ${product.name}`}
        className="absolute inset-0 z-0"
      >
        <span className="sr-only">View {product.name}</span>
      </TrackedLink>

      <div className="pointer-events-none relative mb-4 aspect-4/3 overflow-hidden bg-ss-mist">
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
            <span className="mb-2 inline-block bg-ss-mist px-2.5 py-0.5 text-xs font-medium text-ss-navy">
              {product.badge}
            </span>
          )}
          <h3
            id={headingId}
            className={cn(
              "font-semibold text-ss-navy transition-colors group-hover:text-ss-blue",
              isDirectory ? "text-lg" : "text-xl",
            )}
          >
            {product.name}
          </h3>
        </div>

        <p className="mb-4 flex-1 text-sm leading-relaxed text-ss-ink/75">
          {product.shortDescription}
        </p>

        <dl className="mb-6 space-y-3 text-sm">
          <div className="border-l-[3px] border-ss-green bg-ss-green/10 px-3 py-2">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ss-ink">
              Best for
            </dt>
            <dd className="mt-1 text-ss-ink/85">{product.bestFor}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ss-navy/60">
              Price
            </dt>
            <dd className="mt-1 text-ss-ink">{product.priceDisplay}</dd>
          </div>
        </dl>

        <div className="pointer-events-auto relative z-10 mt-auto">
          <TrackedLink
            href={buyHref}
            external
            rel={buyLinkRel(product)}
            placement="product-card-cta"
            target={
              product.id
                ? { type: "product", id: product.id }
                : { type: "external" }
            }
            source={{ type: "page" }}
            label="Check price & availability"
            className="inline-flex w-full items-center justify-center rounded-lg bg-ss-navy px-4 py-2 text-sm font-semibold text-ss-paper transition-colors hover:bg-ss-navy/90"
          >
            Check price & availability
          </TrackedLink>
        </div>
      </div>
    </article>
  );
}
