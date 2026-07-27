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
  return {
    title: "Products",
    description: siteData.productDirectory.description,
    alternates: { canonical: path },
    openGraph: {
      url: path,
      title: `Products — ${siteData.title}`,
      description: siteData.productDirectory.description,
    },
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

  const showCategoryFilters = siteHasMattressPillowNav(siteSlug);
  let category: "mattress" | "pillow" | undefined;
  if (showCategoryFilters) {
    if (categoryParam === "mattress" || categoryParam === "pillow") {
      category = categoryParam;
    }
  }

  const titleOverride =
    showCategoryFilters ? "Top Mattress Picks" : undefined;

  return (
    <main>
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
