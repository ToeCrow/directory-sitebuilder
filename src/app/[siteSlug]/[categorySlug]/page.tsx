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
  getDirectoryReviewPath,
  getPublicPath,
  getSitePath,
} from "@/lib/paths";
import { getRequestPublicBasePath } from "@/lib/request-paths";
import { buildPageOpenGraph } from "@/lib/seo";
import { getSiteBySlug, isValidSiteSlug } from "@/lib/site";

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

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <Link
        href={getSitePath(publicBasePath)}
        className="text-sm font-medium text-blue-700 hover:text-blue-800"
      >
        ← Back to home
      </Link>

      <header className="mt-6 border-b border-slate-200 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {category.name}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600">
          {category.intro}
        </p>
      </header>

      <section className="mt-10" aria-labelledby="products-heading">
        <h2 id="products-heading" className="sr-only">
          Products
        </h2>
        <ul className="space-y-4">
          {products.map((product) => (
            <li key={product.slug}>
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
    </main>
  );
}
