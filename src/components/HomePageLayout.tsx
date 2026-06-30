import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { ComparisonTable } from "@/components/ComparisonTable";
import { FAQ } from "@/components/FAQ";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { LeadForm } from "@/components/LeadForm";
import { AdSlot } from "@/components/AdSlot";

export function HomePageLayout() {
  return (
    <>
      <Hero />
      <ProductGrid />
      <AdSlot slotId="primary" />
      <ComparisonTable />
      <AdSlot slotId="secondary" />
      <FAQ />
      <AffiliateDisclosure />
      <LeadForm />
    </>
  );
}
