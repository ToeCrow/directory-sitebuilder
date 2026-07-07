import { siteSlugs } from "@/data/sites";
import { HomePageLayout } from "@/components/HomePageLayout";
import type { SiteSlug } from "@/data/sites";

type SitePageProps = {
  params: Promise<{ siteSlug: string }>;
};

export function generateStaticParams() {
  return siteSlugs.map((siteSlug) => ({ siteSlug }));
}

export default async function SitePage({ params }: SitePageProps) {
  const { siteSlug } = await params;

  return (
    <main>
      <HomePageLayout siteSlug={siteSlug as SiteSlug} />
    </main>
  );
}
