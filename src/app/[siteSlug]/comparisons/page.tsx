import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteSlugs } from "@/data/sites";
import { ComparisonTable } from "@/components/ComparisonTable";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import {
  getSiteBySlug,
  isValidSiteSlug,
  siteHasMattressPillowNav,
  type SiteSlug,
} from "@/lib/site";
import { getPublicPath } from "@/lib/paths";
import { buildPageOpenGraph } from "@/lib/seo";

type ComparisonsPageProps = {
  params: Promise<{ siteSlug: string }>;
};

export function generateStaticParams() {
  return siteSlugs.map((siteSlug) => ({ siteSlug }));
}

export async function generateMetadata({
  params,
}: ComparisonsPageProps): Promise<Metadata> {
  const { siteSlug } = await params;
  const siteData = getSiteBySlug(siteSlug);
  if (!siteData) return { title: "Comparisons" };

  const path = getPublicPath(siteSlug, "/comparisons");
  const description = siteData.comparisonTable.description ?? "";
  const ogTitle = `${siteData.comparisonTable.title} — ${siteData.title}`;

  return {
    title: siteData.comparisonTable.title,
    description,
    alternates: { canonical: path },
    openGraph: buildPageOpenGraph({
      site: siteData,
      title: ogTitle,
      description,
      path,
    }),
  };
}

export default async function ComparisonsPage({ params }: ComparisonsPageProps) {
  const { siteSlug } = await params;

  if (!isValidSiteSlug(siteSlug)) {
    notFound();
  }

  const siteData = getSiteBySlug(siteSlug);
  if (!siteData) {
    notFound();
  }

  const pageHeading = siteHasMattressPillowNav(siteSlug)
    ? "Compare Mattresses for Side Sleepers"
    : siteData.comparisonTable.title;

  return (
    <main>
      <div className="mx-auto max-w-6xl px-4 pt-12 md:pt-16">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {pageHeading}
        </h1>
      </div>
      <ComparisonTable siteSlug={siteSlug as SiteSlug} />
      <div className="mx-auto max-w-6xl px-4 pb-12">
        <AffiliateDisclosure siteSlug={siteSlug as SiteSlug} className="px-0" />
      </div>
    </main>
  );
}
