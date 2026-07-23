import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteSlugs } from "@/data/sites";
import {
  getSiteBySlug,
  isValidSiteSlug,
} from "@/lib/site";
import {
  RESEARCH_SCORE_HOWTO_LABEL,
  RESEARCH_SCORE_LABEL,
  getResearchScorePath,
  siteUsesResearchScore,
} from "@/lib/research-score";

type ResearchScorePageProps = {
  params: Promise<{ siteSlug: string }>;
};

export function generateStaticParams() {
  return siteSlugs
    .filter((siteSlug) => siteUsesResearchScore(siteSlug))
    .map((siteSlug) => ({ siteSlug }));
}

export async function generateMetadata({
  params,
}: ResearchScorePageProps): Promise<Metadata> {
  const { siteSlug } = await params;

  if (!siteUsesResearchScore(siteSlug)) {
    return { title: RESEARCH_SCORE_LABEL };
  }

  return {
    title: {
      absolute: RESEARCH_SCORE_HOWTO_LABEL,
    },
    description:
      "How Side Sleeper Guide calculates Research Score — our review criteria, sources, and 5-star scale for side-sleeper suitability.",
    alternates: {
      canonical: getResearchScorePath(siteSlug),
    },
  };
}

export default async function ResearchScorePage({
  params,
}: ResearchScorePageProps) {
  const { siteSlug } = await params;

  if (!isValidSiteSlug(siteSlug) || !siteUsesResearchScore(siteSlug)) {
    notFound();
  }

  const siteData = getSiteBySlug(siteSlug);
  if (!siteData) {
    notFound();
  }

  return (
    <main className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4">
        <Link
          href={`/${siteSlug}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to home
        </Link>

        <header className="mt-6 border-b border-slate-200 pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {RESEARCH_SCORE_HOWTO_LABEL}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            {RESEARCH_SCORE_LABEL} is {siteData.title}&apos;s scoring system for
            side-sleeper suitability — a named way we summarize our product
            research, similar in spirit to familiar scores you see elsewhere on
            the web.
          </p>
        </header>

        <div className="mt-10 space-y-10 text-base leading-relaxed text-slate-700">
          <section aria-labelledby="what-is-heading">
            <h2
              id="what-is-heading"
              className="text-xl font-semibold text-slate-900"
            >
              What {RESEARCH_SCORE_LABEL} is
            </h2>
            <p className="mt-3">
              Each product we cover receives an overall {RESEARCH_SCORE_LABEL}{" "}
              on a 5-star scale (shown with one decimal, such as 4.8 / 5). The
              score reflects how well the product fits side sleepers based on
              our review criteria — not a single lab measurement or a paid
              placement ranking.
            </p>
          </section>

          <section aria-labelledby="how-we-research-heading">
            <h2
              id="how-we-research-heading"
              className="text-xl font-semibold text-slate-900"
            >
              How we research
            </h2>
            <p className="mt-3">
              At {siteData.title}, we review product specifications and
              manufacturer information, then look for recurring patterns in
              verifiable customer feedback from reviews, forums, social media,
              and retailers. We compare what matters most for side sleepers and
              summarize that work in our reviews and {RESEARCH_SCORE_LABEL}.
            </p>
            <p className="mt-3 text-slate-600">
              Unless explicitly stated, we do not perform hands-on laboratory
              testing or physical measurements.
            </p>
          </section>

          <section aria-labelledby="criteria-heading">
            <h2
              id="criteria-heading"
              className="text-xl font-semibold text-slate-900"
            >
              Criteria we weigh today
            </h2>
            <p className="mt-3">
              We weigh several factors together when forming a{" "}
              {RESEARCH_SCORE_LABEL}. These are editorial judgment factors — not
              fixed percentages or a published formula:
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2">
              <li>Pressure relief for shoulders and hips</li>
              <li>Cooling and temperature-related owner feedback</li>
              <li>Support and alignment notes relevant to side sleeping</li>
              <li>Trial period and return policies</li>
              <li>Warranty terms</li>
              <li>Price and overall value</li>
              <li>Consistency of recurring owner feedback versus marketing claims</li>
            </ul>
            <p className="mt-4 text-slate-600">
              Comparison columns such as Cooling and Pressure Relief are
              research notes drawn from the same sources. They support the
              overall {RESEARCH_SCORE_LABEL}; they are not separate lab grades.
            </p>
          </section>

          <section aria-labelledby="levels-heading">
            <h2
              id="levels-heading"
              className="text-xl font-semibold text-slate-900"
            >
              What the score levels mean
            </h2>
            <ul className="mt-4 space-y-3">
              <li>
                <span className="font-medium text-slate-900">4.5 – 5.0</span> —
                Strong match for many side sleepers based on our research;
                recurring feedback and policies line up well with side-sleeper
                needs.
              </li>
              <li>
                <span className="font-medium text-slate-900">4.0 – 4.4</span> —
                Solid option with clear strengths; expect trade-offs depending
                on body type, budget, or sleep preferences.
              </li>
              <li>
                <span className="font-medium text-slate-900">Below 4.0</span> —
                More compromises for side sleepers in our research, or weaker
                alignment between claims and recurring owner feedback.
              </li>
            </ul>
          </section>

          <section aria-labelledby="why-five-heading">
            <h2
              id="why-five-heading"
              className="text-xl font-semibold text-slate-900"
            >
              Why a 5-star scale
            </h2>
            <p className="mt-3">
              A 5-star {RESEARCH_SCORE_LABEL} matches the familiar star ratings
              people already use online. It keeps scores easy to scan on product
              cards and comparison tables while still allowing one decimal of
              differentiation between close picks.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
