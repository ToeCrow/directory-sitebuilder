import type { ReactNode } from "react";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { ComparisonTable } from "@/components/ComparisonTable";
import { ProductDirectory } from "@/components/ProductDirectory";
import { ArticleGrid } from "@/components/ArticleGrid";
import { FAQ } from "@/components/FAQ";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { AdSlot } from "@/components/AdSlot";
import { HashScrollOnLoad } from "@/components/HashScrollOnLoad";
import { FindWorthNowHome } from "@/components/FindWorthNowHome";
import { getRequestPublicBasePath } from "@/lib/request-paths";
import {
  getEnabledHomepageSections,
  siteHasHomepageSection,
  type HomepageSection,
} from "@/lib/site-config";

type HomePageLayoutProps = {
  siteSlug: string;
};

export async function HomePageLayout({ siteSlug }: HomePageLayoutProps) {
  if (siteHasHomepageSection(siteSlug, "category-grid")) {
    const publicBasePath = await getRequestPublicBasePath(siteSlug);
    return (
      <FindWorthNowHome siteSlug={siteSlug} publicBasePath={publicBasePath} />
    );
  }

  const sections = getEnabledHomepageSections(siteSlug);

  return (
    <>
      <HashScrollOnLoad siteSlug={siteSlug} />
      {sections.map((section) => (
        <HomeSection key={section} section={section} siteSlug={siteSlug} />
      ))}
    </>
  );
}

function HomeSection({
  section,
  siteSlug,
}: {
  section: HomepageSection;
  siteSlug: string;
}): ReactNode {
  switch (section) {
    case "hero":
      return <Hero siteSlug={siteSlug} />;
    case "affiliate-disclosure":
      return <AffiliateDisclosure siteSlug={siteSlug} />;
    case "top-picks":
      return <ProductGrid siteSlug={siteSlug} />;
    case "ad-primary":
      return <AdSlot slotId="primary" />;
    case "comparison":
      return <ComparisonTable siteSlug={siteSlug} />;
    case "product-directory":
      return <ProductDirectory siteSlug={siteSlug} />;
    case "ad-secondary":
      return <AdSlot slotId="secondary" />;
    case "faq":
      return <FAQ siteSlug={siteSlug} />;
    case "featured-reviews":
      return <ArticleGrid siteSlug={siteSlug} />;
    default:
      return null;
  }
}
