import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { DirectoryCatalogDirectory } from "@/components/DirectoryCatalogDirectory";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductDirectory } from "@/components/ProductDirectory";
import { ProductsDirectoryScroll } from "@/components/ProductsDirectoryScroll";
import {
  getDirectoryCategories,
  getDirectoryProducts,
  siteUsesEditorialCatalog,
} from "@/lib/directory-catalog";
import {
  getSiteBySlug,
  isValidSiteSlug,
  siteHasMattressPillowNav,
  siteSlugs,
  type SiteSlug,
} from "@/lib/site";
import { getPublicPath } from "@/lib/paths";
import { getRequestPublicBasePath } from "@/lib/request-paths";
import { buildPageOpenGraph } from "@/lib/seo";

type ProductsIndexProps = {
  params: Promise<{ siteSlug: string }>;
  searchParams: Promise<{ category?: string }>;
};

export function generateStaticParams() {
  return siteSlugs.map((siteSlug) => ({ siteSlug }));
}

export async function generateMetadata({
  params,
}: ProductsIndexProps): Promise<Metadata> {
  const { siteSlug } = await params;
  const siteData = getSiteBySlug(siteSlug);
  if (!siteData) return { title: "Products" };

  const path = getPublicPath(siteSlug, "/products");
  const description = siteUsesEditorialCatalog(siteSlug)
    ? (siteData.productDirectory.description ??
      "Browse product reviews and filter by category.")
    : (siteData.productDirectory.description ?? "");
  const ogTitle = `Products — ${siteData.title}`;

  return {
    title: "Products",
    description,
    alternates: { canonical: path },
    openGraph: buildPageOpenGraph({
      site: siteData,
      title: ogTitle,
      description,
      path,
    }),
  };
}

export default async function ProductsIndexPage({
  params,
  searchParams,
}: ProductsIndexProps) {
  const { siteSlug } = await params;
  const { category: categoryParam } = await searchParams;

  if (!isValidSiteSlug(siteSlug)) {
    notFound();
  }

  const siteData = getSiteBySlug(siteSlug);
  if (!siteData) {
    notFound();
  }

  if (siteUsesEditorialCatalog(siteSlug)) {
    const publicBasePath = await getRequestPublicBasePath(siteSlug);
    const categories = getDirectoryCategories(siteSlug);
    const activeCategory = categories.find(
      (category) => category.slug === categoryParam,
    );
    const products = getDirectoryProducts(siteSlug, activeCategory?.slug);
    const heading = activeCategory
      ? `${activeCategory.name} reviews`
      : siteData.productDirectory.title;

    return (
      <main>
        <Suspense fallback={null}>
          <ProductsDirectoryScroll />
        </Suspense>
        <div className="mx-auto max-w-6xl px-4 pt-12 md:pt-16">
          <h1 className="text-3xl font-bold tracking-tight text-ss-navy md:text-4xl">
            {heading}
          </h1>
          {activeCategory ? (
            <p className="mt-3 max-w-2xl text-slate-600">{activeCategory.intro}</p>
          ) : (
            siteData.productDirectory.description && (
              <p className="mt-3 max-w-2xl text-slate-600">
                {siteData.productDirectory.description}
              </p>
            )
          )}
        </div>
        <DirectoryCatalogDirectory
          publicBasePath={publicBasePath}
          categories={categories}
          products={products}
          activeCategorySlug={activeCategory?.slug}
          title=""
        />
        <div className="mx-auto max-w-6xl px-4 pb-12">
          <AffiliateDisclosure siteSlug={siteSlug as SiteSlug} className="px-0" />
        </div>
      </main>
    );
  }

  const showCategoryFilters = siteHasMattressPillowNav(siteSlug);
  let category: "mattress" | "pillow" | "topper" | undefined;
  if (showCategoryFilters) {
    if (
      categoryParam === "mattress" ||
      categoryParam === "pillow" ||
      categoryParam === "topper"
    ) {
      category = categoryParam;
    }
  }

  const titleOverride = showCategoryFilters ? "Top Mattress Picks" : undefined;
  const pageHeading = showCategoryFilters
    ? "Products Featured in Our Reviews"
    : siteData.productDirectory.title;

  return (
    <main>
      {showCategoryFilters && (
        <Suspense fallback={null}>
          <ProductsDirectoryScroll />
        </Suspense>
      )}
      <div className="mx-auto max-w-6xl px-4 pt-12 md:pt-16">
        <h1 className="text-3xl font-bold tracking-tight text-ss-navy md:text-4xl">
          {pageHeading}
        </h1>
      </div>
      <ProductGrid
        siteSlug={siteSlug as SiteSlug}
        titleOverride={titleOverride}
      />
      <ProductDirectory
        siteSlug={siteSlug as SiteSlug}
        category={category}
        showCategoryFilters={showCategoryFilters}
      />
      <div className="mx-auto max-w-6xl px-4 pb-12">
        <AffiliateDisclosure siteSlug={siteSlug as SiteSlug} className="px-0" />
      </div>
    </main>
  );
}
