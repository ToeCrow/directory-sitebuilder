import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteSlugs } from "@/data/sites";
import { siteUsesEditorialCatalog } from "@/lib/directory-catalog";
import { getPublicPath, getSitePath } from "@/lib/paths";
import { getRequestPublicBasePath } from "@/lib/request-paths";
import { buildPageOpenGraph } from "@/lib/seo";
import { getSiteBySlug, isValidSiteSlug } from "@/lib/site";

const PAGE_TITLE = "Affiliate Disclosure";
const PAGE_DESCRIPTION =
  "FindWorthNow may earn a commission if you purchase through links on this site, at no additional cost to you.";

type AffiliateDisclosurePageProps = {
  params: Promise<{ siteSlug: string }>;
};

export function generateStaticParams() {
  return siteSlugs
    .filter((siteSlug) => siteUsesEditorialCatalog(siteSlug))
    .map((siteSlug) => ({ siteSlug }));
}

export async function generateMetadata({
  params,
}: AffiliateDisclosurePageProps): Promise<Metadata> {
  const { siteSlug } = await params;
  const siteData = await getSiteBySlug(siteSlug);

  if (!siteUsesEditorialCatalog(siteSlug) || !siteData) {
    return { title: PAGE_TITLE };
  }

  const path = getPublicPath(siteSlug, "/affiliate-disclosure");

  return {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    alternates: { canonical: path },
    openGraph: buildPageOpenGraph({
      site: siteData,
      title: `${PAGE_TITLE} | ${siteData.title}`,
      description: PAGE_DESCRIPTION,
      path,
    }),
  };
}

export default async function AffiliateDisclosurePage({
  params,
}: AffiliateDisclosurePageProps) {
  const { siteSlug } = await params;

  if (!(await isValidSiteSlug(siteSlug)) || !siteUsesEditorialCatalog(siteSlug)) {
    notFound();
  }

  const siteData = await getSiteBySlug(siteSlug);
  if (!siteData) {
    notFound();
  }

  const publicBasePath = await getRequestPublicBasePath(siteSlug);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <Link
        href={getSitePath(publicBasePath)}
        className="text-sm font-medium text-fwn-gold hover:text-fwn-brass"
      >
        ← Back to home
      </Link>

      <article className="mt-6">
        <h1 className="text-3xl font-semibold tracking-tight text-fwn-ivory md:text-4xl">
          Affiliate disclosure
        </h1>
        <p className="mt-6 text-base leading-relaxed text-fwn-sand">
          Some links on {siteData.title} are affiliate links. We may earn a
          commission if you purchase through those links, at no additional cost
          to you.
        </p>
        <p className="mt-4 text-base leading-relaxed text-fwn-sand">
          {siteData.affiliateDisclosure} Affiliate relationships do not change
          the facts we present, and they are not a reason to treat any product
          as medical advice, a personal recommendation, or a guarantee of
          results.
        </p>
        <p className="mt-4 text-base leading-relaxed text-fwn-sand">
          If a page includes an affiliate link, we disclose that near the link.
        </p>
      </article>
    </main>
  );
}
