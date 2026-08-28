"use client";

import Link from "next/link";
import { ReviewListItem } from "@/components/ReviewListItem";
import { usePublicBasePath, useSiteData } from "@/context/SiteContext";
import { featuredHomeReviewsFrom } from "@/lib/site-view";
import { cn } from "@/lib/cn";
import { getArticlePath, getReviewsIndexPath } from "@/lib/paths";
import { getSiteTheme } from "@/lib/site-config";
import { getThemeClasses } from "@/lib/site-theme";

type ArticleGridProps = {
  siteSlug: string;
  className?: string;
};

export function ArticleGrid({ siteSlug, className }: ArticleGridProps) {
  const publicBasePath = usePublicBasePath();
  const siteData = useSiteData();
  const theme = getThemeClasses(getSiteTheme(siteSlug));
  const reviews = siteData.featuredReviewSlugs
    ? featuredHomeReviewsFrom(siteData)
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
      className={cn(theme.articleSection, className)}
      aria-labelledby="reviews-heading"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="reviews-heading" className={theme.articleHeading}>
            {heading}
          </h2>
          <Link
            href={getReviewsIndexPath(publicBasePath)}
            className={theme.articleLink}
          >
            View all reviews →
          </Link>
        </div>
        <ul className={theme.articleList}>
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
