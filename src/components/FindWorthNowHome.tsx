import Link from "next/link";
import type { SiteSlug } from "@/data/sites";
import {
  getDirectoryCategories,
  getDirectoryProducts,
} from "@/lib/directory-catalog";
import { getDirectoryCategoryPath, getProductsIndexPath } from "@/lib/paths";
import { getSiteData } from "@/lib/site";

type FindWorthNowHomeProps = {
  siteSlug: SiteSlug;
  publicBasePath: string;
};

export function FindWorthNowHome({
  siteSlug,
  publicBasePath,
}: FindWorthNowHomeProps) {
  const siteData = getSiteData(siteSlug);
  const categories = getDirectoryCategories(siteSlug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      {siteData.hero.eyebrow && (
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          {siteData.hero.eyebrow}
        </p>
      )}
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
        {siteData.hero.headline}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
        {siteData.hero.subheadline}
      </p>
      <p className="mt-8">
        <Link
          href={getProductsIndexPath(publicBasePath)}
          className="inline-flex items-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          Browse all products
        </Link>
      </p>

      <section className="mt-16" aria-labelledby="categories-heading">
        <h2
          id="categories-heading"
          className="text-sm font-semibold uppercase tracking-wide text-slate-500"
        >
          Categories
        </h2>
        <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const count = getDirectoryProducts(siteSlug, category.slug).length;
            return (
              <li key={category.slug}>
                <Link
                  href={getDirectoryCategoryPath(publicBasePath, category.slug)}
                  className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <h3 className="text-xl font-semibold text-slate-900">
                    {category.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {category.description}
                  </p>
                  <p className="mt-4 text-sm font-medium text-blue-700">
                    {count} {count === 1 ? "review" : "reviews"} →
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
