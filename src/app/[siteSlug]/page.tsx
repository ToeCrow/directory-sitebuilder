import type { Metadata } from "next";
import { siteSlugs } from "@/data/sites";
import { HomePageLayout } from "@/components/HomePageLayout";
import type { SiteSlug } from "@/data/sites";
import { siteHasFeature } from "@/lib/site-config";
import { getPublicPath } from "@/lib/paths";
import { buildPageOpenGraph } from "@/lib/seo";
import { getSiteBySlug } from "@/lib/site";

type SitePageProps = {
  params: Promise<{ siteSlug: string }>;
};

export function generateStaticParams() {
  return siteSlugs.map((siteSlug) => ({ siteSlug }));
}

export async function generateMetadata({
  params,
}: SitePageProps): Promise<Metadata> {
  const { siteSlug } = await params;
  const siteData = await getSiteBySlug(siteSlug);

  if (!siteData) {
    return {};
  }

  // Public homepage path: `/` on custom-domain sites, `/{siteSlug}` on platform-only sites.
  const path = getPublicPath(siteSlug, "/");
  const title = siteHasFeature(siteSlug, "catalog")
    ? { absolute: siteData.metaTitle }
    : siteData.title;

  return {
    title,
    description: siteData.metaDescription,
    alternates: {
      canonical: path,
    },
    openGraph: buildPageOpenGraph({
      site: siteData,
      title: siteData.metaTitle,
      description: siteData.metaDescription,
      path,
    }),
  };
}

export default async function SitePage({ params }: SitePageProps) {
  const { siteSlug } = await params;

  return (
    <main>
      <HomePageLayout siteSlug={siteSlug as SiteSlug} />
    </main>
  );
}
