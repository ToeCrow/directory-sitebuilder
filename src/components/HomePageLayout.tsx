import type { SiteSlug } from "@/data/sites";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { ComparisonTable } from "@/components/ComparisonTable";
import { ProductDirectory } from "@/components/ProductDirectory";
import { BuyingGuide } from "@/components/BuyingGuide";
import { ArticleGrid } from "@/components/ArticleGrid";
import { FAQ } from "@/components/FAQ";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { AdSlot } from "@/components/AdSlot";
import { HashScrollOnLoad } from "@/components/HashScrollOnLoad";
import { siteHasMattressPillowNav } from "@/lib/site";

type HomePageLayoutProps = {
  siteSlug: SiteSlug;
};

export function HomePageLayout({ siteSlug }: HomePageLayoutProps) {
  const isSideSleeperHome = siteHasMattressPillowNav(siteSlug);

  if (isSideSleeperHome) {
    // AdSlots intentionally omitted until AdSense approval.
    // Re-enable with: <AdSlot slotId="primary" /> / <AdSlot slotId="secondary" />
    return (
      <>
        <HashScrollOnLoad siteSlug={siteSlug} />
        <Hero siteSlug={siteSlug} />
        <AffiliateDisclosure siteSlug={siteSlug} />
        <ArticleGrid siteSlug={siteSlug} />
        <BuyingGuide siteSlug={siteSlug} />
        <FAQ siteSlug={siteSlug} />
      </>
    );
  }

  return (
    <>
      <HashScrollOnLoad siteSlug={siteSlug} />
      <Hero siteSlug={siteSlug} />
      <AffiliateDisclosure siteSlug={siteSlug} />
      <ProductGrid siteSlug={siteSlug} />
      <AdSlot slotId="primary" />
      <ComparisonTable siteSlug={siteSlug} />
      <ProductDirectory siteSlug={siteSlug} />
      <AdSlot slotId="secondary" />
      <BuyingGuide siteSlug={siteSlug} />
      <FAQ siteSlug={siteSlug} />
      <ArticleGrid siteSlug={siteSlug} />
    </>
  );
}
