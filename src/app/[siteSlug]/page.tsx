import { siteIds } from "@/config/sites";
import { HomePageLayout } from "@/components/HomePageLayout";
import type { SiteId } from "@/config/sites";

type SitePageProps = {
  params: Promise<{ siteSlug: string }>;
};

export function generateStaticParams() {
  return siteIds.map((siteSlug) => ({ siteSlug }));
}

export default async function SitePage({ params }: SitePageProps) {
  const { siteSlug } = await params;

  return (
    <main>
      <HomePageLayout siteSlug={siteSlug as SiteId} />
    </main>
  );
}
