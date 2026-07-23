import Link from "next/link";
import type { SiteSlug } from "@/data/sites";
import { getSiteData } from "@/lib/site";
import { cn } from "@/lib/cn";
import {
  RESEARCH_SCORE_HOWTO_LABEL,
  getResearchScorePath,
  siteUsesResearchScore,
} from "@/lib/research-score";

type BuyingGuideProps = {
  siteSlug: SiteSlug;
  className?: string;
};

export function BuyingGuide({ siteSlug, className }: BuyingGuideProps) {
  const siteData = getSiteData(siteSlug);
  const { buyingGuide } = siteData;
  const showResearchScoreLink = siteUsesResearchScore(siteSlug);

  return (
    <section
      id="buying-guide"
      className={cn("py-16 md:py-20", className)}
      aria-labelledby="buying-guide-heading"
    >
      <div className="mx-auto max-w-3xl px-4">
        <h2
          id="buying-guide-heading"
          className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl"
        >
          {buyingGuide.title}
        </h2>
        <div className="mt-10 space-y-8">
          {buyingGuide.sections.map((section) => (
            <article key={section.title}>
              <h3 className="text-lg font-semibold text-slate-900">
                {section.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {section.content}
                {showResearchScoreLink &&
                  section.title === "How we compare mattresses" && (
                    <>
                      {" "}
                      <Link
                        href={getResearchScorePath(siteSlug)}
                        className="font-medium text-blue-600 underline-offset-2 hover:underline"
                      >
                        {RESEARCH_SCORE_HOWTO_LABEL}
                      </Link>
                      .
                    </>
                  )}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
