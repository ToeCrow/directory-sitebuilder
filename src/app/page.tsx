import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { ComparisonTable } from "@/components/ComparisonTable";
import { FAQ } from "@/components/FAQ";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { LeadForm } from "@/components/LeadForm";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProductGrid />
      <ComparisonTable />
      <FAQ />
      <AffiliateDisclosure />
      <LeadForm />
    </main>
  );
}
