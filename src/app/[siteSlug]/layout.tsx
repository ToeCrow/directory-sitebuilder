import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { SiteSlug } from "@/data/sites";
import { siteSlugs } from "@/data/sites";
import { SiteProvider } from "@/context/SiteContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdSenseScript } from "@/components/AdSenseScript";
import { getSiteBySlug, isValidSiteSlug } from "@/lib/site";

type SiteLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ siteSlug: string }>;
};

export async function generateMetadata({
  params,
}: SiteLayoutProps): Promise<Metadata> {
  const { siteSlug } = await params;
  const siteData = getSiteBySlug(siteSlug);

  if (!siteData) {
    return {};
  }

  return {
    title: siteData.metaTitle,
    description: siteData.metaDescription,
    metadataBase: new URL(siteData.siteUrl),
  };
}

export default async function SiteLayout({ children, params }: SiteLayoutProps) {
  const { siteSlug } = await params;

  if (!isValidSiteSlug(siteSlug)) {
    notFound();
  }

  return (
    <SiteProvider siteSlug={siteSlug as SiteSlug}>
      {siteSlug === "side-sleeper" && (
        <meta
          name="impact-site-verification"
          // Impact verifies via the non-standard `value` attribute (not content).
          {...{ value: "55f30b2b-1340-482b-8e3b-1c531ba4b4ef" }}
        />
      )}
      <AdSenseScript />
      <Header />
      {children}
      <Footer />
    </SiteProvider>
  );
}
