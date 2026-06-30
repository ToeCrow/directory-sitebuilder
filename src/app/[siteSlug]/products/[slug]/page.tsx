import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteIds } from "@/config/sites";
import type { SiteId } from "@/config/sites";
import {
  getProductBySlug,
  getProducts,
  getSiteConfig,
  isValidSiteSlug,
} from "@/lib/site";

type ProductPageProps = {
  params: Promise<{ siteSlug: string; slug: string }>;
};

export function generateStaticParams() {
  return siteIds.flatMap((siteSlug) =>
    getProducts(siteSlug).map((product) => ({
      siteSlug,
      slug: product.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { siteSlug, slug } = await params;

  if (!isValidSiteSlug(siteSlug)) {
    return { title: "Product not found" };
  }

  const product = getProductBySlug(siteSlug, slug);
  const siteConfig = getSiteConfig(siteSlug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: `${product.name} Review — ${siteConfig.name}`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { siteSlug, slug } = await params;

  if (!isValidSiteSlug(siteSlug)) {
    notFound();
  }

  const product = getProductBySlug(siteSlug, slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="py-12 md:py-16">
      <article className="mx-auto max-w-3xl px-4">
        <Link
          href={`/${siteSlug}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to comparison
        </Link>

        <header className="mt-6 border-b border-slate-200 pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Rating: {product.rating}/5 · From {product.priceFrom}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            {product.description}
          </p>
          <p className="mt-4 text-sm text-slate-700">
            <span className="font-medium">Best for:</span> {product.bestFor}
          </p>
        </header>

        <section className="mt-8" aria-labelledby="features-heading">
          <h2
            id="features-heading"
            className="text-xl font-semibold text-slate-900"
          >
            Key features
          </h2>
          <ul className="mt-4 list-inside list-disc space-y-1 text-slate-600">
            {product.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <section aria-labelledby="pros-heading">
            <h2
              id="pros-heading"
              className="text-xl font-semibold text-slate-900"
            >
              Pros
            </h2>
            <ul className="mt-4 space-y-2">
              {product.pros.map((pro) => (
                <li key={pro} className="flex gap-2 text-sm text-slate-600">
                  <span className="text-green-600" aria-hidden="true">
                    ✓
                  </span>
                  {pro}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="cons-heading">
            <h2
              id="cons-heading"
              className="text-xl font-semibold text-slate-900"
            >
              Cons
            </h2>
            <ul className="mt-4 space-y-2">
              {product.cons.map((con) => (
                <li key={con} className="flex gap-2 text-sm text-slate-600">
                  <span className="text-red-500" aria-hidden="true">
                    ✗
                  </span>
                  {con}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm text-slate-600">
            Ready to try {product.name}? Visit the official site to start a
            free trial or request a demo.
          </p>
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener sponsored"
            className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Visit {product.name}
          </a>
        </div>
      </article>
    </main>
  );
}
