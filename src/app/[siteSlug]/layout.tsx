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
    title: {
      default: siteData.metaTitle,
      template: `%s | ${siteData.title}`,
    },
    description: siteData.metaDescription,
    metadataBase: new URL(siteData.siteUrl),
    applicationName: siteData.title,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: siteData.title,
      title: siteData.metaTitle,
      description: siteData.metaDescription,
      url: siteData.siteUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: siteData.metaTitle,
      description: siteData.metaDescription,
    },
  };
}

export default async function SiteLayout({ children, params }: SiteLayoutProps) {
  const { siteSlug } = await params;

  if (!isValidSiteSlug(siteSlug)) {
    notFound();
  }

  return (
    <SiteProvider siteSlug={siteSlug as SiteSlug}>
      <AdSenseScript />
      <Header />
      {children}
      <Footer />
    </SiteProvider>
  );
}
