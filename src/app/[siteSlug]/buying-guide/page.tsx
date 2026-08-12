import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteSlugs } from "@/data/sites";
import { BuyingGuide } from "@/components/BuyingGuide";
import {
  getSiteBySlug,
  isValidSiteSlug,
  type SiteSlug,
} from "@/lib/site";
import { getPublicPath, getSitePath } from "@/lib/paths";
import { getRequestPublicBasePath } from "@/lib/request-paths";
import { buildPageOpenGraph } from "@/lib/seo";

type BuyingGuidePageProps = {
  params: Promise<{ siteSlug: string }>;
};

export function generateStaticParams() {
  return siteSlugs.map((siteSlug) => ({ siteSlug }));
}

export async function generateMetadata({
  params,
}: BuyingGuidePageProps): Promise<Metadata> {
  const { siteSlug } = await params;
  const siteData = getSiteBySlug(siteSlug);
  if (!siteData) {
    return { title: "Buying guide" };
  }

  const path = getPublicPath(siteSlug, "/buying-guide");
  const title = siteData.buyingGuide.title;
  const description =
    siteData.buyingGuide.intro?.[0]?.slice(0, 160) ??
    siteData.buyingGuide.chapters?.[0]?.subsections?.[0]?.content.slice(0, 160) ??
    siteData.buyingGuide.sections?.[0]?.content.slice(0, 160) ??
    siteData.metaDescription;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: buildPageOpenGraph({
      site: siteData,
      title: `${title} — ${siteData.title}`,
      description,
      path,
    }),
  };
}

export default async function BuyingGuidePage({ params }: BuyingGuidePageProps) {
  const { siteSlug } = await params;

  if (!isValidSiteSlug(siteSlug)) {
    notFound();
  }

  const siteData = getSiteBySlug(siteSlug);
  if (!siteData) {
    notFound();
  }

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
        <div className="mt-8">
          <BuyingGuide siteSlug={siteSlug as SiteSlug} asPage />
        </div>
      </div>
    </main>
  );
}
