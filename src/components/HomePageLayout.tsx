import type { SiteSlug } from "@/data/sites";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { ComparisonTable } from "@/components/ComparisonTable";
import { ProductDirectory } from "@/components/ProductDirectory";
import { BuyingGuide } from "@/components/BuyingGuide";
import { ArticleGrid } from "@/components/ArticleGrid";
import { FAQ } from "@/components/FAQ";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { LeadForm } from "@/components/LeadForm";
import { AdSlot } from "@/components/AdSlot";
import { BrowseCta } from "@/components/BrowseCta";
import { siteHasMattressPillowNav } from "@/lib/site";

type HomePageLayoutProps = {
  siteSlug: SiteSlug;
};

export function HomePageLayout({ siteSlug }: HomePageLayoutProps) {
  const isSideSleeperHome = siteHasMattressPillowNav(siteSlug);

  if (isSideSleeperHome) {
    return (
      <>
        <Hero siteSlug={siteSlug} />
        <AffiliateDisclosure siteSlug={siteSlug} />
        <AdSlot slotId="primary" />
        <BrowseCta siteSlug={siteSlug} />
        <BuyingGuide siteSlug={siteSlug} />
        <AdSlot slotId="secondary" />
        <FAQ siteSlug={siteSlug} />
        <ArticleGrid siteSlug={siteSlug} />
        <LeadForm />
      </>
    );
  }

  return (
    <>
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
      <LeadForm />
    </>
  );
}
