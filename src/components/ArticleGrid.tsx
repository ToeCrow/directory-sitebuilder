"use client";

import Link from "next/link";
import type { SiteSlug } from "@/data/sites";
import { usePublicBasePath } from "@/context/SiteContext";
import { getSiteData } from "@/lib/site";
import { cn } from "@/lib/cn";
import { getArticlePath, getReviewsIndexPath } from "@/lib/paths";

type ArticleGridProps = {
  siteSlug: SiteSlug;
  className?: string;
};

export function ArticleGrid({ siteSlug, className }: ArticleGridProps) {
  const publicBasePath = usePublicBasePath();
  const siteData = getSiteData(siteSlug);

  return (
    <section
      id="reviews"
      className={cn(
        "border-t border-slate-200 bg-slate-50 py-16 md:py-20",
        className,
      )}
      aria-labelledby="reviews-heading"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2
            id="reviews-heading"
            className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl"
          >
            Reviews
          </h2>
          <Link
            href={getReviewsIndexPath(publicBasePath)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all reviews →
          </Link>
        </div>
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {siteData.articles.slice(0, 6).map((article) => (
            <li key={article.slug}>
              <Link
                href={getArticlePath(publicBasePath, article.slug)}
                className="block h-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="font-semibold text-slate-900 hover:text-blue-600">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {article.excerpt}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
