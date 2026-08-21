import Link from "next/link";
import type { SiteSlug } from "@/data/sites";
import { getDirectoryCategories } from "@/lib/directory-catalog";
import { getDirectoryCategoryPath } from "@/lib/paths";
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
    <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
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

      <section className="mt-14" aria-labelledby="categories-heading">
        <h2
          id="categories-heading"
          className="text-sm font-semibold uppercase tracking-wide text-slate-500"
        >
          Start here
        </h2>
        <ul className="mt-4 space-y-4">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={getDirectoryCategoryPath(publicBasePath, category.slug)}
                className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="text-xl font-semibold text-slate-900">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {category.description}
                </p>
                <p className="mt-4 text-sm font-medium text-blue-700">
                  Explore {category.name} →
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
