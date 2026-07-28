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
import { getProductPath, getPublicPath, getSitePath } from "@/lib/paths";
import { getRequestPublicBasePath } from "@/lib/request-paths";
import { buildPageOpenGraph } from "@/lib/seo";

const AFFILIATE_TITLE = "How we work with brands";
const AFFILIATE_DESCRIPTION =
  "See every product we cover and whether Side Sleeper Guide currently has an affiliate partnership when you buy through our links.";

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

  const path = getPublicPath(siteSlug, "/affiliate");

  return {
    title: {
      absolute: AFFILIATE_TITLE,
    },
    description: AFFILIATE_DESCRIPTION,
    alternates: {
      canonical: path,
    },
    openGraph: buildPageOpenGraph({
      site: siteData,
      title: AFFILIATE_TITLE,
      description: AFFILIATE_DESCRIPTION,
      path,
    }),
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
  const publicBasePath = await getRequestPublicBasePath(siteSlug);

  return (
    <main className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4">
        <Link
          href={getSitePath(publicBasePath)}
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
                      href={getProductPath(publicBasePath, product.slug)}
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
