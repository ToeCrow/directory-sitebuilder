import type { SiteSlug } from "@/data/sites";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { ComparisonTable } from "@/components/ComparisonTable";
import { BuyingGuide } from "@/components/BuyingGuide";
import { ArticleGrid } from "@/components/ArticleGrid";
import { FAQ } from "@/components/FAQ";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { LeadForm } from "@/components/LeadForm";
import { AdSlot } from "@/components/AdSlot";

type HomePageLayoutProps = {
  siteSlug: SiteSlug;
};

export function HomePageLayout({ siteSlug }: HomePageLayoutProps) {
  return (
    <>
      <Hero siteSlug={siteSlug} />
      <ProductGrid siteSlug={siteSlug} />
      <AdSlot slotId="primary" />
      <ComparisonTable siteSlug={siteSlug} />
      <AdSlot slotId="secondary" />
      <BuyingGuide siteSlug={siteSlug} />
      <ArticleGrid siteSlug={siteSlug} />
      <FAQ siteSlug={siteSlug} />
      <AffiliateDisclosure siteSlug={siteSlug} />
      <LeadForm />
    </>
  );
}
