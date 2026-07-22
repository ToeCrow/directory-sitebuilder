import type { Metadata } from "next";
import { siteSlugs } from "@/data/sites";
import { HomePageLayout } from "@/components/HomePageLayout";
import type { SiteSlug } from "@/data/sites";
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
  const siteData = getSiteBySlug(siteSlug);

  if (!siteData) {
    return {};
  }

  // Public homepage on custom domain is `/` (rewritten), not `/{siteSlug}`.
  return {
    alternates: {
      canonical: "/",
    },
    openGraph: {
      url: "/",
    },
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
