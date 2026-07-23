import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { SiteSlug } from "@/data/sites";
import { SiteProvider } from "@/context/SiteContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdSenseScript } from "@/components/AdSenseScript";
import { JsonLd } from "@/components/JsonLd";
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "@/lib/schema";
import { getDefaultOgImage } from "@/lib/seo";
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

  const ogImage = getDefaultOgImage(siteData);

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
      images: [
        {
          url: ogImage.url,
          width: ogImage.width,
          height: ogImage.height,
          alt: ogImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteData.metaTitle,
      description: siteData.metaDescription,
      images: [
        {
          url: ogImage.url,
          alt: ogImage.alt,
        },
      ],
    },
  };
}

export default async function SiteLayout({ children, params }: SiteLayoutProps) {
  const { siteSlug } = await params;

  if (!isValidSiteSlug(siteSlug)) {
    notFound();
  }

  const siteData = getSiteBySlug(siteSlug);

  if (!siteData) {
    notFound();
  }

  return (
    <SiteProvider siteSlug={siteSlug as SiteSlug}>
      <JsonLd
        data={[buildWebSiteSchema(siteData), buildOrganizationSchema(siteData)]}
      />
      <AdSenseScript />
      <Header />
      {children}
      <Footer />
    </SiteProvider>
  );
}
