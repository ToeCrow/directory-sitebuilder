import Link from "next/link";
import {
  getDirectoryCategories,
  getDirectoryProducts,
} from "@/lib/directory-catalog";
import { getDirectoryCategoryPath } from "@/lib/paths";

type CategoryGridProps = {
  siteSlug: string;
  publicBasePath: string;
};

export function CategoryGrid({ siteSlug, publicBasePath }: CategoryGridProps) {
  const categories = getDirectoryCategories(siteSlug);

  return (
    <section className="relative mt-20" aria-labelledby="categories-heading">
      <h2
        id="categories-heading"
        className="text-xs font-semibold uppercase tracking-[0.22em] text-fwn-gold"
      >
        Categories
      </h2>
      <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const count = getDirectoryProducts(siteSlug, category.slug).length;
          return (
            <li key={category.slug}>
              <Link
                href={getDirectoryCategoryPath(publicBasePath, category.slug)}
                className="flex h-full flex-col rounded-sm border border-fwn-gold/20 bg-fwn-panel p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-fwn-gold/50 hover:shadow-[0_24px_48px_-24px_rgba(196,163,106,0.45)]"
              >
                <h3 className="text-xl font-semibold text-fwn-ivory">
                  {category.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-fwn-sand">
                  {category.description}
                </p>
                <p className="mt-4 text-sm font-medium tracking-wide text-fwn-gold">
                  {count} {count === 1 ? "review" : "reviews"} →
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
