import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteSlugs } from "@/data/sites";
import type { SiteSlug } from "@/data/sites";
import {
  getProducts,
  getSiteBySlug,
  isValidSiteSlug,
} from "@/lib/site";
import { siteUsesResearchScore } from "@/lib/research-score";

type AffiliatePageProps = {
  params: Promise<{ siteSlug: string }>;
};

export function generateStaticParams() {
  return siteSlugs.map((siteSlug) => ({ siteSlug }));
}

export async function generateMetadata({
  params,
}: AffiliatePageProps): Promise<Metadata> {
  const { siteSlug } = await params;
  const siteData = getSiteBySlug(siteSlug);

  if (!siteData) {
    return { title: "Affiliate partnerships" };
  }

  return {
    title: {
      absolute: "How we work with brands",
    },
    description:
      "See which products we cover and whether we currently have an affiliate partnership.",
    alternates: {
      canonical: `/${siteSlug}/affiliate`,
    },
  };
}

export default async function AffiliatePage({ params }: AffiliatePageProps) {
  const { siteSlug } = await params;

  if (!isValidSiteSlug(siteSlug)) {
    notFound();
  }

  const siteData = getSiteBySlug(siteSlug);
  if (!siteData) {
    notFound();
  }

  const products = getProducts(siteSlug as SiteSlug);
  const usesResearchScore = siteUsesResearchScore(siteSlug);

  return (
    <main className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4">
        <Link
          href={`/${siteSlug}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to home
        </Link>

        <header className="mt-6 border-b border-slate-200 pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            How we work with brands
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            {usesResearchScore ? (
              <>
                When you buy through some links on {siteData.title}, we may earn
                a commission at no extra cost to you. That never changes our
                research criteria or how we review products. Below is every
                product we cover and whether we currently have an affiliate
                partnership.
              </>
            ) : (
              <>
                When you buy through some links on {siteData.title}, we may earn
                a commission at no extra cost to you. That never changes how we
                rate or recommend products. Below is every product we cover and
                whether we currently have an affiliate partnership.
              </>
            )}
          </p>
        </header>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[20rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-3 pr-4 font-medium">Product</th>
                <th className="py-3 font-medium">Affiliate partnership</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.slug}
                  className="border-b border-slate-100 text-slate-800"
                >
                  <td className="py-3 pr-4">
                    <Link
                      href={`/${siteSlug}/products/${product.slug}`}
                      className="font-medium text-slate-900 hover:text-blue-600"
                    >
                      {product.name}
                    </Link>
                  </td>
                  <td className="py-3">
                    {product.hasAffiliatePartnership ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-10 text-sm leading-relaxed text-slate-600">
          {siteData.affiliateDisclosure}
        </p>
      </div>
    </main>
  );
}
