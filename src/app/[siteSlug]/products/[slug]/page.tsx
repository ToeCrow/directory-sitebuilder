import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { ReviewListItem } from "@/components/ReviewListItem";
import { getDefaultOgImage, OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "@/lib/seo";
import {
  getArticlesFeaturingProduct,
  getLegacyDirectorySiteSlugs,
  getProductBySlug,
  getProducts,
  getSiteBySlug,
  isValidSiteSlug,
  siteHasMattressPillowNav,
} from "@/lib/site";
import { siteUsesEditorialCatalog } from "@/lib/directory-catalog";
import {
  RESEARCH_SCORE_HOWTO_LABEL,
  RESEARCH_SCORE_LABEL,
  formatScoreValue,
  getResearchScorePath,
  siteUsesResearchScore,
} from "@/lib/research-score";
import {
  getArticlePath,
  getPublicPath,
  getProductsIndexPath,
} from "@/lib/paths";
import { getRequestPublicBasePath } from "@/lib/request-paths";
import { buyLinkRel, getBuyUrl } from "@/lib/product-links";

type ProductPageProps = {
  params: Promise<{ siteSlug: string; slug: string }>;
};

export function generateStaticParams() {
  return getLegacyDirectorySiteSlugs().flatMap((siteSlug) =>
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
  const siteData = getSiteBySlug(siteSlug);

  if (!product || !siteData) {
    return { title: "Product not found" };
  }

  const title = product.metaTitle ?? `${product.name} Review`;
  const description = product.metaDescription ?? product.shortDescription;
  const path = getPublicPath(siteSlug, `/products/${slug}`);
  const fallbackOg = getDefaultOgImage(siteData) ?? {
    url: `/sites/${siteData.slug}/og-default.png`,
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    alt: siteData.title,
  };
  const ogImage = product.image
    ? {
        url: product.image.src,
        width: fallbackOg.width,
        height: fallbackOg.height,
        alt: product.image.alt,
      }
    : fallbackOg;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "article",
      siteName: siteData.title,
      title: `${title} — ${siteData.title}`,
      description,
      url: path,
      images: [
        {
          url: ogImage.url,
          width: ogImage.width,
          height: ogImage.height,
          alt: ogImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${siteData.title}`,
      description,
      images: [
        {
          url: ogImage.url,
          alt: ogImage.alt,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { siteSlug, slug } = await params;

  if (!isValidSiteSlug(siteSlug) || siteUsesEditorialCatalog(siteSlug)) {
    notFound();
  }

  const product = getProductBySlug(siteSlug, slug);
  const siteData = getSiteBySlug(siteSlug);

  if (!product || !siteData) {
    notFound();
  }

  const publicBasePath = await getRequestPublicBasePath(siteSlug);
  const featuredGuides = getArticlesFeaturingProduct(siteSlug, product.slug);

  return (
    <main className="py-12 md:py-16">
      <article className="mx-auto max-w-3xl px-4">
        <Link
          href={getProductsIndexPath(publicBasePath)}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to products
        </Link>

        <header className="mt-6 border-b border-slate-200 pb-8">
          {product.badge && (
            <span className="mb-3 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              {product.badge}
            </span>
          )}
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {siteUsesResearchScore(siteSlug) ? (
              <>
                {RESEARCH_SCORE_LABEL}:{" "}
                {formatScoreValue(product.rating, siteData.ratingScale)} ·{" "}
                {product.priceDisplay}
              </>
            ) : (
              <>
                Rating: {product.rating}/{siteData.ratingScale} ·{" "}
                {product.priceDisplay}
              </>
            )}
          </p>
          {siteUsesResearchScore(siteSlug) && (
            <p className="mt-2 text-sm text-slate-600">
              <Link
                href={getResearchScorePath(publicBasePath)}
                className="font-medium text-blue-600 underline-offset-2 hover:underline"
              >
                {RESEARCH_SCORE_HOWTO_LABEL}
              </Link>
            </p>
          )}
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            {product.shortDescription}
          </p>
          <p className="mt-4 text-sm text-slate-700">
            <span className="font-medium">Best for:</span> {product.bestFor}
          </p>
        </header>

        <AffiliateDisclosure siteSlug={siteSlug} className="mt-6 px-0" />

        <section className="mt-8" aria-labelledby="features-heading">
          <div
            className={
              product.image
                ? "grid gap-8 md:grid-cols-2 md:items-start"
                : undefined
            }
          >
            <div>
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
            </div>
            {product.image && (
              <figure className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <Image
                  src={product.image.src}
                  alt={product.image.alt}
                  width={1200}
                  height={900}
                  className="h-auto w-full object-cover"
                  priority
                />
              </figure>
            )}
          </div>
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

        {featuredGuides.length > 0 && (
          <section
            className="mt-12 border-t border-slate-200"
            aria-labelledby="featured-guides-heading"
          >
            <h2
              id="featured-guides-heading"
              className="mt-10 text-xl font-semibold text-slate-900"
            >
              Featured in our guides
            </h2>
            <ul className="mt-2">
              {featuredGuides.map((article) => (
                <li key={article.slug}>
                  <ReviewListItem
                    article={article}
                    href={getArticlePath(publicBasePath, article.slug)}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm text-slate-600">
            {siteHasMattressPillowNav(siteSlug)
              ? `Ready to try ${product.name}? Visit the official site to check availability and current price.`
              : `Ready to try ${product.name}? Visit the official site to learn more or request a demo.`}
          </p>
          <a
            href={getBuyUrl(product)}
            target="_blank"
            rel={buyLinkRel(product)}
            className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Visit {product.name}
          </a>
        </div>
      </article>
    </main>
  );
}
