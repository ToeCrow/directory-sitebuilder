import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ComparisonTable } from "@/components/ComparisonTable";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { getSiteBySlug, isValidSiteSlug, type SiteSlug } from "@/lib/site";
import { getProductsIndexPath, getPublicPath } from "@/lib/paths";
import { getRequestPublicBasePath } from "@/lib/request-paths";
import { buildPageOpenGraph } from "@/lib/seo";
import {
  getRouteAccess,
  getStaticParamSiteSlugsForRoute,
} from "@/lib/site-routes";

type ComparisonsPageProps = {
  params: Promise<{ siteSlug: string }>;
};

export function generateStaticParams() {
  return getStaticParamSiteSlugsForRoute("comparisons").map((siteSlug) => ({
    siteSlug,
  }));
}

export async function generateMetadata({
  params,
}: ComparisonsPageProps): Promise<Metadata> {
  const { siteSlug } = await params;
  const siteData = await getSiteBySlug(siteSlug);
  if (!siteData) return { title: "Comparisons" };

  if (getRouteAccess(siteSlug, "comparisons") !== "allow") {
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

  if (!(await isValidSiteSlug(siteSlug))) {
    notFound();
  }

  const access = getRouteAccess(siteSlug, "comparisons");
  if (access === "not-found") {
    notFound();
  }

  const siteData = await getSiteBySlug(siteSlug);
  if (!siteData) {
    notFound();
  }

  if (typeof access === "object") {
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
