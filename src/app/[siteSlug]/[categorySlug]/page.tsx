import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DirectoryProductCard } from "@/components/DirectoryProductCard";
import { siteSlugs } from "@/data/sites";
import {
  getDirectoryCategories,
  getDirectoryCategory,
  getDirectoryProducts,
  siteUsesEditorialCatalog,
} from "@/lib/directory-catalog";
import {
  getDirectoryCategoryPath,
  getDirectoryReviewPath,
  getProductsIndexPath,
  getPublicPath,
  getSitePath,
} from "@/lib/paths";
import { getRequestPublicBasePath } from "@/lib/request-paths";
import { buildPageOpenGraph } from "@/lib/seo";
import { getSiteBySlug, isValidSiteSlug } from "@/lib/site";
import { cn } from "@/lib/cn";

type CategoryPageProps = {
  params: Promise<{ siteSlug: string; categorySlug: string }>;
};

export function generateStaticParams() {
  return siteSlugs.flatMap((siteSlug) =>
    getDirectoryCategories(siteSlug).map((category) => ({
      siteSlug,
      categorySlug: category.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { siteSlug, categorySlug } = await params;
  const siteData = getSiteBySlug(siteSlug);
  const category = getDirectoryCategory(siteSlug, categorySlug);

  if (!siteData || !category) {
    return { title: "Category not found" };
  }

  const path = getPublicPath(siteSlug, `/${category.slug}`);

  return {
    title: category.metaTitle,
    description: category.metaDescription,
    alternates: { canonical: path },
    openGraph: buildPageOpenGraph({
      site: siteData,
      title: `${category.metaTitle} | ${siteData.title}`,
      description: category.metaDescription,
      path,
    }),
  };
}

export default async function DirectoryCategoryPage({
  params,
}: CategoryPageProps) {
  const { siteSlug, categorySlug } = await params;

  if (!isValidSiteSlug(siteSlug) || !siteUsesEditorialCatalog(siteSlug)) {
    notFound();
  }

  const category = getDirectoryCategory(siteSlug, categorySlug);
  if (!category) {
    notFound();
  }

  const publicBasePath = await getRequestPublicBasePath(siteSlug);
  const products = getDirectoryProducts(siteSlug, category.slug);
  const categories = getDirectoryCategories(siteSlug);

  return (
    <main className="py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <Link
          href={getSitePath(publicBasePath)}
          className="text-sm font-medium text-blue-700 hover:text-blue-800"
        >
          ← Back to home
        </Link>

        <header className="mt-6 max-w-3xl border-b border-slate-200 pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {category.name}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            {category.intro}
          </p>
        </header>

        <div
          className="mt-8 flex flex-wrap gap-2"
          role="navigation"
          aria-label="Product categories"
        >
          <Link
            href={getProductsIndexPath(publicBasePath)}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            All
          </Link>
          {categories.map((item) => {
            const active = item.slug === category.slug;
            return (
              <Link
                key={item.slug}
                href={getDirectoryCategoryPath(publicBasePath, item.slug)}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        <section className="mt-10" aria-labelledby="products-heading">
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <li key={product.slug} className="h-full">
                <DirectoryProductCard
                  product={product}
                  href={getDirectoryReviewPath(
                    publicBasePath,
                    product.categorySlug,
                    product.reviewSlug,
                  )}
                />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
