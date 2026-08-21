import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateCtaLink } from "@/components/AffiliateCtaLink";
import { siteSlugs } from "@/data/sites";
import {
  getDirectoryCategory,
  getDirectoryProductByReviewSlug,
  getDirectoryProducts,
  siteUsesEditorialCatalog,
} from "@/lib/directory-catalog";
import {
  getDirectoryCategoryPath,
  getPublicPath,
  getSitePath,
} from "@/lib/paths";
import { getRequestPublicBasePath } from "@/lib/request-paths";
import { buildPageOpenGraph } from "@/lib/seo";
import { getSiteBySlug, isValidSiteSlug } from "@/lib/site";

type ReviewPageProps = {
  params: Promise<{
    siteSlug: string;
    categorySlug: string;
    reviewSlug: string;
  }>;
};

export function generateStaticParams() {
  return siteSlugs.flatMap((siteSlug) =>
    getDirectoryProducts(siteSlug).map((product) => ({
      siteSlug,
      categorySlug: product.categorySlug,
      reviewSlug: product.reviewSlug,
    })),
  );
}

export async function generateMetadata({
  params,
}: ReviewPageProps): Promise<Metadata> {
  const { siteSlug, categorySlug, reviewSlug } = await params;
  const siteData = getSiteBySlug(siteSlug);
  const product = getDirectoryProductByReviewSlug(
    siteSlug,
    categorySlug,
    reviewSlug,
  );

  if (!siteData || !product) {
    return { title: "Review not found" };
  }

  const path = getPublicPath(
    siteSlug,
    `/${product.categorySlug}/${product.reviewSlug}`,
  );

  return {
    title: product.metaTitle,
    description: product.metaDescription,
    alternates: { canonical: path },
    openGraph: buildPageOpenGraph({
      site: siteData,
      title: `${product.metaTitle} | ${siteData.title}`,
      description: product.metaDescription,
      path,
    }),
  };
}

export default async function DirectoryReviewPage({ params }: ReviewPageProps) {
  const { siteSlug, categorySlug, reviewSlug } = await params;

  if (!isValidSiteSlug(siteSlug) || !siteUsesEditorialCatalog(siteSlug)) {
    notFound();
  }

  const product = getDirectoryProductByReviewSlug(
    siteSlug,
    categorySlug,
    reviewSlug,
  );
  if (!product) {
    notFound();
  }

  const siteData = getSiteBySlug(siteSlug);
  if (!siteData) {
    notFound();
  }

  const category = getDirectoryCategory(siteSlug, product.categorySlug);
  const publicBasePath = await getRequestPublicBasePath(siteSlug);
  const disclosureHref = getSitePath(publicBasePath, "/affiliate-disclosure");
  const categoryHref = getDirectoryCategoryPath(
    publicBasePath,
    product.categorySlug,
  );
  const categoryName = category?.name ?? "category";

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <Link
        href={categoryHref}
        className="text-sm font-medium text-blue-700 hover:text-blue-800"
      >
        ← Back to {categoryName}
      </Link>

      <header className="mt-6 border-b border-slate-200 pb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {product.typeLabel}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {product.reviewTitle}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          {product.heroDescription}
        </p>
        <p className="mt-5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600">
          <span className="font-semibold text-slate-800">
            Affiliate disclosure:
          </span>{" "}
          We may earn a commission if you purchase through links on this page,
          at no additional cost to you.{" "}
          <Link
            href={disclosureHref}
            className="font-medium text-blue-700 hover:text-blue-800"
          >
            Read the full disclosure
          </Link>
          .
        </p>
        <div className="mt-6">
          <AffiliateCtaLink href={product.affiliateUrl}>
            {product.ctaLabel}
          </AffiliateCtaLink>
        </div>
      </header>

      {product.sections.map((section) => (
        <section key={section.heading} className="mt-10">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            {section.heading}
          </h2>
          {section.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-4 text-base leading-relaxed text-slate-600"
            >
              {paragraph}
            </p>
          ))}
          {section.bullets && section.bullets.length > 0 && (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-slate-600">
              {section.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <section className="mt-12 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Learn more
        </h2>
        <p className="mt-4 text-base leading-relaxed text-slate-600">
          If you want current details, pricing, or the full offer, visit the
          official {product.name} page. {siteData.title} may earn a commission
          from that visit, at no additional cost to you.
        </p>
        <div className="mt-6">
          <AffiliateCtaLink href={product.affiliateUrl}>
            {product.ctaLabel}
          </AffiliateCtaLink>
        </div>
      </section>
    </main>
  );
}
