"use client";

import Link from "next/link";
import { ReviewListItem } from "@/components/ReviewListItem";
import { usePublicBasePath, useSiteData } from "@/context/SiteContext";
import { articlesByReviewCategoryFrom } from "@/lib/site-view";
import type { ReviewCategory } from "@/types/site";
import { cn } from "@/lib/cn";
import { getArticlePath, getReviewsIndexPath } from "@/lib/paths";

type ReviewDirectoryProps = {
  siteSlug: string;
  className?: string;
  category?: ReviewCategory;
  showCategoryFilters?: boolean;
};

export function ReviewDirectory({
  siteSlug,
  className,
  category,
  showCategoryFilters = false,
}: ReviewDirectoryProps) {
  const publicBasePath = usePublicBasePath();
  const siteData = useSiteData();
  const reviews = articlesByReviewCategoryFrom(siteData, category);

  const filters = [
    { key: undefined, label: "All", href: getReviewsIndexPath(publicBasePath) },
    {
      key: "mattress" as const,
      label: "Mattress reviews",
      href: getReviewsIndexPath(publicBasePath, "mattress"),
    },
    {
      key: "pillow" as const,
      label: "Pillow reviews",
      href: getReviewsIndexPath(publicBasePath, "pillow"),
    },
    {
      key: "science" as const,
      label: "Science of sleep",
      href: getReviewsIndexPath(publicBasePath, "science"),
    },
  ];

  return (
    <section
      id="directory"
      className={cn("py-10 md:py-12", className)}
      aria-labelledby="reviews-directory-heading"
    >
      <div className="mx-auto max-w-6xl px-4">
        <h2 id="reviews-directory-heading" className="sr-only">
          Review directory
        </h2>

        {showCategoryFilters && (
          <div
            className="flex flex-wrap gap-2"
            role="navigation"
            aria-label="Review categories"
          >
            {filters.map((filter) => {
              const active = category === filter.key;
              return (
                <Link
                  key={filter.label}
                  href={filter.href}
                  scroll={false}
                  className={cn(
                    "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-ss-navy text-ss-paper"
                      : "border border-ss-navy/15 bg-ss-paper text-ss-navy hover:bg-ss-mist",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {filter.label}
                </Link>
              );
            })}
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="mt-10 text-ss-ink/75">No reviews in this category yet.</p>
        ) : (
          <ul className="mt-6 divide-y-0 border-t border-ss-navy/10">
            {reviews.map((article) => (
              <li key={article.slug}>
                <ReviewListItem
                  article={article}
                  href={getArticlePath(publicBasePath, article.slug)}
                />
              </li>
            ))}
          </ul>
        )}

        {!showCategoryFilters && siteData.articles.length === 0 && (
          <p className="mt-10 text-ss-ink/75">No reviews published yet.</p>
        )}
      </div>
    </section>
  );
}
