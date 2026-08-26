import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ComparisonTable } from "@/components/ComparisonTable";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import {
  getLegacyDirectorySiteSlugs,
  getSiteBySlug,
  isValidSiteSlug,
  siteHasMattressPillowNav,
  type SiteSlug,
} from "@/lib/site";
import { siteUsesEditorialCatalog } from "@/lib/directory-catalog";
import { getProductsIndexPath, getPublicPath } from "@/lib/paths";
import { getRequestPublicBasePath } from "@/lib/request-paths";
import { buildPageOpenGraph } from "@/lib/seo";

type ComparisonsPageProps = {
  params: Promise<{ siteSlug: string }>;
};

export function generateStaticParams() {
  return getLegacyDirectorySiteSlugs().map((siteSlug) => ({ siteSlug }));
}

export async function generateMetadata({
  params,
}: ComparisonsPageProps): Promise<Metadata> {
  const { siteSlug } = await params;
  const siteData = await getSiteBySlug(siteSlug);
  if (!siteData) return { title: "Comparisons" };

  if (siteHasMattressPillowNav(siteSlug)) {
    return { title: "Redirecting…" };
  }

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

  if (!(await isValidSiteSlug(siteSlug)) || siteUsesEditorialCatalog(siteSlug)) {
    notFound();
  }

  const siteData = await getSiteBySlug(siteSlug);
  if (!siteData) {
    notFound();
  }

  // Side Sleeper Guide: comparison page retired — send traffic to products.
  if (siteHasMattressPillowNav(siteSlug)) {
    const publicBasePath = await getRequestPublicBasePath(siteSlug);
    permanentRedirect(getProductsIndexPath(publicBasePath));
  }

  return (
    <main>
      <div className="mx-auto max-w-6xl px-4 pt-12 md:pt-16">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {siteData.comparisonTable.title}
        </h1>
      </div>
      <ComparisonTable siteSlug={siteSlug as SiteSlug} />
      <div className="mx-auto max-w-6xl px-4 pb-12">
        <AffiliateDisclosure siteSlug={siteSlug as SiteSlug} className="px-0" />
      </div>
    </main>
  );
}
