import Link from "next/link";
import type { SiteSlug } from "@/data/sites";
import { getSiteData } from "@/lib/site";
import { cn } from "@/lib/cn";

type ArticleGridProps = {
  siteSlug: SiteSlug;
  className?: string;
};

export function ArticleGrid({ siteSlug, className }: ArticleGridProps) {
  const siteData = getSiteData(siteSlug);

  return (
    <section
      id="articles"
      className={cn("border-t border-slate-200 bg-slate-50 py-16 md:py-20", className)}
      aria-labelledby="articles-heading"
    >
      <div className="mx-auto max-w-6xl px-4">
        <h2
          id="articles-heading"
          className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl"
        >
          Related guides
        </h2>
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {siteData.articles.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/${siteSlug}/articles/${article.slug}`}
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
