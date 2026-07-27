import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteSlugs } from "@/data/sites";
import { ComparisonTable } from "@/components/ComparisonTable";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import {
  getSiteBySlug,
  isValidSiteSlug,
  type SiteSlug,
} from "@/lib/site";
import { getPublicPath } from "@/lib/paths";

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
  return {
    title: siteData.comparisonTable.title,
    description: siteData.comparisonTable.description,
    alternates: { canonical: path },
    openGraph: {
      url: path,
      title: `${siteData.comparisonTable.title} — ${siteData.title}`,
      description: siteData.comparisonTable.description,
    },
  };
}

export default async function ComparisonsPage({ params }: ComparisonsPageProps) {
  const { siteSlug } = await params;

  if (!isValidSiteSlug(siteSlug)) {
    notFound();
  }

  return (
    <main>
      <ComparisonTable siteSlug={siteSlug as SiteSlug} />
      <div className="mx-auto max-w-6xl px-4 pb-12">
        <AffiliateDisclosure siteSlug={siteSlug as SiteSlug} className="px-0" />
      </div>
    </main>
  );
}
