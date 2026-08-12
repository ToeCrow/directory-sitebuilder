"use client";

import Link from "next/link";
import type { SiteSlug } from "@/data/sites";
import { usePublicBasePath } from "@/context/SiteContext";
import { getSiteData } from "@/lib/site";
import { getProductsIndexPath } from "@/lib/paths";
import { cn } from "@/lib/cn";
import {
  RESEARCH_SCORE_HOWTO_LABEL,
  getResearchScorePath,
  siteUsesResearchScore,
} from "@/lib/research-score";

type BuyingGuideProps = {
  siteSlug: SiteSlug;
  className?: string;
  /** When true, the guide title is rendered as H1 for a dedicated page. */
  asPage?: boolean;
};

function isMethodologySection(title: string): boolean {
  return (
    title.startsWith("How we compare") || title.startsWith("How we evaluate")
  );
}

function ResearchScoreSuffix({
  show,
  publicBasePath,
}: {
  show: boolean;
  publicBasePath: string;
}) {
  if (!show) return null;
  return (
    <>
      {" "}
      <Link
        href={getResearchScorePath(publicBasePath)}
        className="font-medium text-blue-600 underline-offset-2 hover:underline"
      >
        {RESEARCH_SCORE_HOWTO_LABEL}
      </Link>
      .
    </>
  );
}

export function BuyingGuide({
  siteSlug,
  className,
  asPage = false,
}: BuyingGuideProps) {
  const publicBasePath = usePublicBasePath();
  const siteData = getSiteData(siteSlug);
  const { buyingGuide } = siteData;
  const showResearchScoreLink = siteUsesResearchScore(siteSlug);
  const TitleTag = asPage ? "h1" : "h2";
  const useHierarchy =
    Boolean(buyingGuide.chapters?.length) || Boolean(buyingGuide.intro?.length);

  const educationalChapters =
    buyingGuide.chapters?.filter(
      (chapter) =>
        chapter.subsections &&
        chapter.subsections.length > 0 &&
        !isMethodologySection(chapter.title),
    ) ?? [];
  const methodologyChapters =
    buyingGuide.chapters?.filter((chapter) =>
      isMethodologySection(chapter.title),
    ) ?? [];

  return (
    <section
      id={asPage ? undefined : "buying-guide"}
      className={cn(
        asPage ? undefined : "scroll-mt-24 py-16 md:py-20",
        className,
      )}
      aria-labelledby="buying-guide-heading"
    >
      <div className={asPage ? undefined : "mx-auto max-w-3xl px-4"}>
        <TitleTag
          id="buying-guide-heading"
          className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl"
        >
          {buyingGuide.title}
        </TitleTag>

        {useHierarchy ? (
          <div className="mt-6 space-y-12">
            {buyingGuide.intro && buyingGuide.intro.length > 0 && (
              <div className="space-y-4">
                {buyingGuide.intro.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="text-sm leading-relaxed text-slate-600 md:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {educationalChapters.map((chapter) => (
              <article key={chapter.title} className="space-y-6">
                <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                  {chapter.title}
                </h2>
                {chapter.subsections?.map((subsection) => (
                  <div key={subsection.title}>
                    <h3 className="text-base font-semibold text-slate-900">
                      {subsection.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {subsection.content}
                    </p>
                  </div>
                ))}
              </article>
            ))}

            {buyingGuide.productNav && (
              <article className="space-y-6">
                <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                  {buyingGuide.productNav.title}
                </h2>
                {buyingGuide.productNav.items.map((item) => (
                  <div key={item.category}>
                    <h3 className="text-base font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {item.description}{" "}
                      <Link
                        href={getProductsIndexPath(
                          publicBasePath,
                          item.category,
                        )}
                        className="font-medium text-blue-600 underline-offset-2 hover:underline"
                      >
                        Browse {item.title.toLowerCase()}
                      </Link>
                      .
                    </p>
                  </div>
                ))}
              </article>
            )}

            {methodologyChapters.map((chapter) => (
              <article key={chapter.title}>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                  {chapter.title}
                </h2>
                {chapter.content && (
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {chapter.content}
                    <ResearchScoreSuffix
                      show={showResearchScoreLink}
                      publicBasePath={publicBasePath}
                    />
                  </p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 space-y-8">
            {(buyingGuide.sections ?? []).map((section) => (
              <article key={section.title}>
                <h2
                  className={
                    asPage
                      ? "text-xl font-semibold text-slate-900"
                      : "text-lg font-semibold text-slate-900"
                  }
                >
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {section.content}
                  <ResearchScoreSuffix
                    show={
                      showResearchScoreLink &&
                      isMethodologySection(section.title)
                    }
                    publicBasePath={publicBasePath}
                  />
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
