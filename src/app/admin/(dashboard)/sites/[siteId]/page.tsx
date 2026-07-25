import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminSiteById } from "@/lib/admin/sites";
import { SiteSettingsForm } from "./SiteSettingsForm";
import { SiteHeroForm } from "./SiteHeroForm";
import { SiteSectionsForm } from "./SiteSectionsForm";

export const dynamic = "force-dynamic";

type SiteEditPageProps = {
  params: Promise<{ siteId: string }>;
};

export default async function AdminSiteEditPage({
  params,
}: SiteEditPageProps) {
  const { siteId } = await params;
  const detail = await getAdminSiteById(siteId).catch(() => null);

  if (!detail) {
    notFound();
  }

  const { site, hero, sections } = detail;

  return (
    <div>
      <Link
        href="/admin/sites"
        className="text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        ← Back to sites
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        {site.title}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        /{site.slug} · Status: <span className="font-medium">{site.status}</span>
      </p>

      <div className="mt-10 space-y-12">
        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Site settings
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Saving a published site updates the public site immediately.
          </p>
          <div className="mt-6">
            <SiteSettingsForm
              siteId={site.id}
              initial={{
                title: site.title,
                metaTitle: site.metaTitle,
                metaDescription: site.metaDescription,
                niche: site.niche,
                siteUrl: site.siteUrl,
                ratingScale: site.ratingScale as 5 | 10,
                headerBrandImage: site.headerBrandImage ?? "",
                affiliateDisclosure: site.affiliateDisclosure,
                newsletterTitle: site.newsletterTitle,
                newsletterDescription: site.newsletterDescription,
                newsletterButtonText: site.newsletterButtonText,
                newsletterSuccessMessage: site.newsletterSuccessMessage,
                adsPrimary: site.adsPrimary ?? "",
                adsSecondary: site.adsSecondary ?? "",
                status: site.status,
                researchScorePage: Boolean(
                  (site.features as Record<string, unknown>)
                    ?.researchScorePage,
                ),
              }}
            />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">Hero</h2>
          <p className="mt-1 text-sm text-slate-600">
            The homepage hero banner shown at the top of the site.
          </p>
          <div className="mt-6">
            <SiteHeroForm
              siteId={site.id}
              initial={{
                eyebrow: hero?.eyebrow ?? "",
                headline: hero?.headline ?? "",
                subheadline: hero?.subheadline ?? "",
                primaryCta: hero?.primaryCta ?? "",
                secondaryCta: hero?.secondaryCta ?? "",
                secondaryCtaHref: hero?.secondaryCtaHref ?? "",
                imageSrc: hero?.imageSrc ?? "",
                imageSrcMobile: hero?.imageSrcMobile ?? "",
                imageAlt: hero?.imageAlt ?? "",
              }}
            />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Section titles
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Titles and descriptions shown above the top picks, product
            directory, comparison table, buying guide, and footer tagline.
          </p>
          <div className="mt-6">
            <SiteSectionsForm
              siteId={site.id}
              initial={{
                topPicksTitle: sections["top-picks"]?.title ?? "",
                topPicksDescription: sections["top-picks"]?.description ?? "",
                productDirectoryTitle:
                  sections["product-directory"]?.title ?? "",
                productDirectoryDescription:
                  sections["product-directory"]?.description ?? "",
                comparisonTitle: sections["comparison-table"]?.title ?? "",
                comparisonDescription:
                  sections["comparison-table"]?.description ?? "",
                comparisonRowHeaderLabel:
                  (
                    sections["comparison-table"]?.config as
                      | { rowHeaderLabel?: string }
                      | null
                  )?.rowHeaderLabel ?? "",
                buyingGuideTitle: sections["buying-guide"]?.title ?? "",
                footerTagline: sections["footer"]?.title ?? "",
              }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
