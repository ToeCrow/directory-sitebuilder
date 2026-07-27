import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteSlugs } from "@/data/sites";
import { getSiteBySlug, isValidSiteSlug } from "@/lib/site";
import { getPublicPath, getSitePath } from "@/lib/paths";
import { siteUsesAboutPage } from "@/lib/about";
import {
  RESEARCH_SCORE_LABEL,
  getResearchScorePath,
} from "@/lib/research-score";

const PAGE_TITLE = "About | Side Sleeper Guide";
const PAGE_DESCRIPTION =
  "Meet Thomas and George, the lifelong friends behind Side Sleeper Guide — how we research mattresses and pillows for side sleepers.";

type AboutPageProps = {
  params: Promise<{ siteSlug: string }>;
};

export function generateStaticParams() {
  return siteSlugs
    .filter((siteSlug) => siteUsesAboutPage(siteSlug))
    .map((siteSlug) => ({ siteSlug }));
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { siteSlug } = await params;

  if (!siteUsesAboutPage(siteSlug)) {
    return { title: "About" };
  }

  const path = getPublicPath(siteSlug, "/about");

  return {
    title: {
      absolute: PAGE_TITLE,
    },
    description: PAGE_DESCRIPTION,
    alternates: {
      canonical: path,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      url: path,
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      type: "website",
    },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { siteSlug } = await params;

  if (!isValidSiteSlug(siteSlug) || !siteUsesAboutPage(siteSlug)) {
    notFound();
  }

  const siteData = getSiteBySlug(siteSlug);
  if (!siteData) {
    notFound();
  }

  const researchScoreHref = getResearchScorePath(siteSlug);

  return (
    <main className="py-12 md:py-16">
      <article className="mx-auto max-w-3xl px-4">
        <Link
          href={getSitePath(siteSlug)}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to home
        </Link>

        <header className="mt-6 border-b border-slate-200 pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            About Side Sleeper Guide
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Side Sleeper Guide is run by Thomas and George, two lifelong friends
            who have known each other since fourth grade. Over the years, we have
            been classmates, neighbors, friends, and collaborators.
          </p>
        </header>

        <div className="mt-10 space-y-6 text-base leading-relaxed text-slate-700">
          <p>
            As we got closer to fifty, both of us began experiencing more
            sleep-related discomfort. Shoulder pressure, neck stiffness, hip
            pain, and waking up feeling less rested made choosing the right
            mattress and pillow feel increasingly important.
          </p>
          <p>
            What started as a shared interest in finding better sleep developed
            into Side Sleeper Guide.
          </p>
          <p>
            Our different skills make the project work. Thomas is a developer and
            handles the website, product structure, comparison tools, technical
            quality, and keeping information organized and accessible.
          </p>
          <p>
            George focuses on writing and editorial work. He turns detailed
            product research, specifications, policies, pricing, and recurring
            owner feedback into clear and practical guidance.
          </p>
          <p>
            Together, we research mattresses, pillows, and sleep products through
            the specific needs of side sleepers. We focus on factors such as
            pressure relief, spinal support, cooling, body weight, materials,
            trial periods, warranties, and overall value.
          </p>

          <section aria-labelledby="our-approach" className="pt-4">
            <h2
              id="our-approach"
              className="text-xl font-semibold text-slate-900"
            >
              Our approach
            </h2>
            <p className="mt-3">
              We do not claim to physically test every product featured on the
              site. Unless explicitly stated otherwise, our reviews are based on
              product research, manufacturer specifications, brand policies,
              pricing, and recurring patterns in owner feedback.
            </p>
            <p className="mt-3">
              Our{" "}
              <Link
                href={researchScoreHref}
                className="font-medium text-blue-600 underline-offset-2 hover:underline"
              >
                {RESEARCH_SCORE_LABEL}
              </Link>{" "}
              explains the criteria we use to evaluate and compare products.
            </p>
          </section>

          <section aria-labelledby="how-supported" className="pt-4">
            <h2
              id="how-supported"
              className="text-xl font-semibold text-slate-900"
            >
              How the site is supported
            </h2>
            <p className="mt-3">
              Side Sleeper Guide may earn a commission when readers purchase
              products through certain links. This does not increase the price
              paid by the reader, and it does not change our research criteria or
              product ratings.
            </p>
            <p className="mt-3">
              Our goal is simple: to make it easier for side sleepers to
              understand their options and find products that better match their
              comfort needs, sleeping habits, and budget.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
