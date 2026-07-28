import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteSlugs } from "@/data/sites";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductDirectory } from "@/components/ProductDirectory";
import {
  getSiteBySlug,
  isValidSiteSlug,
  siteHasMattressPillowNav,
  type SiteSlug,
} from "@/lib/site";
import { getPublicPath } from "@/lib/paths";
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
  const description = siteData.productDirectory.description ?? "";
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

  const showCategoryFilters = siteHasMattressPillowNav(siteSlug);
  let category: "mattress" | "pillow" | undefined;
  if (showCategoryFilters) {
    if (categoryParam === "mattress" || categoryParam === "pillow") {
      category = categoryParam;
    }
  }

  const titleOverride = showCategoryFilters ? "Top Mattress Picks" : undefined;
  const pageHeading = showCategoryFilters
    ? "Mattress and Pillow Reviews for Side Sleepers"
    : siteData.productDirectory.title;

  return (
    <main>
      <div className="mx-auto max-w-6xl px-4 pt-12 md:pt-16">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
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
