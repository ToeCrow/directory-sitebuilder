import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { SiteId } from "@/config/sites";
import { SiteProvider } from "@/context/SiteContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdSenseScript } from "@/components/AdSenseScript";
import { getSiteConfig, isValidSiteSlug } from "@/lib/site";

type SiteLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ siteSlug: string }>;
};

export async function generateMetadata({
  params,
}: SiteLayoutProps): Promise<Metadata> {
  const { siteSlug } = await params;

  if (!isValidSiteSlug(siteSlug)) {
    return {};
  }

  const siteConfig = getSiteConfig(siteSlug);

  return {
    title: siteConfig.metadata.title,
    description: siteConfig.metadata.description,
    metadataBase: new URL(siteConfig.url),
  };
}

export default async function SiteLayout({ children, params }: SiteLayoutProps) {
  const { siteSlug } = await params;

  if (!isValidSiteSlug(siteSlug)) {
    notFound();
  }

  return (
    <SiteProvider siteSlug={siteSlug as SiteId}>
      <AdSenseScript />
      <Header />
      {children}
      <Footer />
    </SiteProvider>
  );
}
