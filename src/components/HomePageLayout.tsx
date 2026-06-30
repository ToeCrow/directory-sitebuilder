import type { SiteId } from "@/config/sites";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { ComparisonTable } from "@/components/ComparisonTable";
import { FAQ } from "@/components/FAQ";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { LeadForm } from "@/components/LeadForm";
import { AdSlot } from "@/components/AdSlot";

type HomePageLayoutProps = {
  siteSlug: SiteId;
};

export function HomePageLayout({ siteSlug }: HomePageLayoutProps) {
  return (
    <>
      <Hero siteSlug={siteSlug} />
      <ProductGrid siteSlug={siteSlug} />
      <AdSlot slotId="primary" />
      <ComparisonTable siteSlug={siteSlug} />
      <AdSlot slotId="secondary" />
      <FAQ siteSlug={siteSlug} />
      <AffiliateDisclosure siteSlug={siteSlug} />
      <LeadForm />
    </>
  );
}
