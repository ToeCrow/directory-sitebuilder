"use client";

import Link from "next/link";
import type { SiteSlug } from "@/data/sites";
import { ReviewListItem } from "@/components/ReviewListItem";
import { usePublicBasePath } from "@/context/SiteContext";
import { getFeaturedHomeReviews, getSiteData, siteHasMattressPillowNav } from "@/lib/site";
import { cn } from "@/lib/cn";
import { getArticlePath, getReviewsIndexPath } from "@/lib/paths";

type ArticleGridProps = {
  siteSlug: SiteSlug;
  className?: string;
};

export function ArticleGrid({ siteSlug, className }: ArticleGridProps) {
  const publicBasePath = usePublicBasePath();
  const siteData = getSiteData(siteSlug);
  const isSideSleeper = siteHasMattressPillowNav(siteSlug);
  const reviews = siteData.featuredReviewSlugs
    ? getFeaturedHomeReviews(siteSlug)
    : siteData.articles.slice(0, 6);
  const heading = siteData.featuredReviewSlugs
    ? "Featured Reviews"
    : "Reviews";

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section
      id="reviews"
      className={cn(
        isSideSleeper
          ? "border-t border-ss-navy/10 bg-ss-mist/60 py-16 md:py-20"
          : "border-t border-slate-200 bg-slate-50 py-16 md:py-20",
        className,
      )}
      aria-labelledby="reviews-heading"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2
            id="reviews-heading"
            className={
              isSideSleeper
                ? "text-2xl font-bold tracking-tight text-ss-navy md:text-3xl"
                : "text-2xl font-bold tracking-tight text-slate-900 md:text-3xl"
            }
          >
            {heading}
          </h2>
          <Link
            href={getReviewsIndexPath(publicBasePath)}
            className={
              isSideSleeper
                ? "text-sm font-medium text-ss-navy hover:text-ss-blue"
                : "text-sm font-medium text-blue-600 hover:text-blue-700"
            }
          >
            View all reviews →
          </Link>
        </div>
        <ul
          className={
            isSideSleeper
              ? "mt-6 border-t border-ss-navy/10"
              : "mt-6 border-t border-slate-200"
          }
        >
          {reviews.map((article) => (
            <li key={article.slug}>
              <ReviewListItem
                article={article}
                href={getArticlePath(publicBasePath, article.slug)}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
