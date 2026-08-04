import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteSlugs } from "@/data/sites";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { ReviewDirectory } from "@/components/ReviewDirectory";
import {
  getSiteBySlug,
  isValidSiteSlug,
  siteHasMattressPillowNav,
  type SiteSlug,
} from "@/lib/site";
import { getPublicPath } from "@/lib/paths";
import { buildPageOpenGraph } from "@/lib/seo";
import type { ReviewCategory } from "@/types/site";

type ReviewsIndexProps = {
  params: Promise<{ siteSlug: string }>;
  searchParams: Promise<{ category?: string }>;
};

export function generateStaticParams() {
  return siteSlugs.map((siteSlug) => ({ siteSlug }));
}

export async function generateMetadata({
  params,
}: ReviewsIndexProps): Promise<Metadata> {
  const { siteSlug } = await params;
  const siteData = getSiteBySlug(siteSlug);
  if (!siteData) return { title: "Reviews" };

  const path = getPublicPath(siteSlug, "/reviews");
  const description =
    siteSlug === "side-sleeper"
      ? "Mattress reviews, pillow reviews, and science of sleep guides for side sleepers — researched from specs and owner feedback."
      : `Reviews and guides from ${siteData.title}.`;
  const ogTitle = `Reviews — ${siteData.title}`;

  return {
    title: "Reviews",
    description,
    alternates: { canonical: path },
    openGraph: buildPageOpenGraph({
      site: siteData,
      title: ogTitle,
      description,
      path,
    }),
  };
}

export default async function ReviewsIndexPage({
  params,
  searchParams,
}: ReviewsIndexProps) {
  const { siteSlug } = await params;
  const { category: categoryParam } = await searchParams;

  if (!isValidSiteSlug(siteSlug)) {
    notFound();
  }

  const siteData = getSiteBySlug(siteSlug);
  if (!siteData) {
    notFound();
  }

  const showCategoryFilters = siteHasMattressPillowNav(siteSlug);
  let category: ReviewCategory | undefined;
  if (showCategoryFilters) {
    if (
      categoryParam === "mattress" ||
      categoryParam === "pillow" ||
      categoryParam === "science"
    ) {
      category = categoryParam;
    }
  }

  const pageHeading = showCategoryFilters
    ? "Reviews for Side Sleepers"
    : "Reviews";

  return (
    <main>
      <div className="mx-auto max-w-6xl px-4 pt-12 md:pt-16">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {pageHeading}
        </h1>
        {showCategoryFilters && (
          <p className="mt-3 max-w-2xl text-slate-600">
            Mattress reviews, pillow reviews, and science of sleep — researched
            from product specs, brand policies, and recurring owner feedback.
          </p>
        )}
      </div>
      <ReviewDirectory
        siteSlug={siteSlug as SiteSlug}
        category={category}
        showCategoryFilters={showCategoryFilters}
      />
      <div className="mx-auto max-w-6xl px-4 pb-12">
        <AffiliateDisclosure siteSlug={siteSlug as SiteSlug} className="px-0" />
      </div>
    </main>
  );
}
