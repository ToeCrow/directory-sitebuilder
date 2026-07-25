import type { Metadata } from "next";
import { HomePageLayout } from "@/components/HomePageLayout";
import { getSiteBySlug } from "@/lib/site";

export const dynamic = "force-dynamic";

type SitePageProps = {
  params: Promise<{ siteSlug: string }>;
};

export async function generateMetadata({
  params,
}: SitePageProps): Promise<Metadata> {
  const { siteSlug } = await params;
  const siteData = await getSiteBySlug(siteSlug);

  if (!siteData) {
    return {};
  }

  // Public homepage on custom domain is `/` (rewritten), not `/{siteSlug}`.
  return {
    title: siteData.title,
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
      <HomePageLayout siteSlug={siteSlug} />
    </main>
  );
}
