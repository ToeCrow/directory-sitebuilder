import type { Metadata } from "next";
import { headers } from "next/headers";
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
import { resolvePublicBasePath } from "@/lib/paths";
import { getDefaultOgImage } from "@/lib/seo";
import { getSiteBySlug, isValidSiteSlug } from "@/lib/site";
import { siteUsesEditorialCatalog } from "@/lib/directory-catalog";

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
      default: siteData.title,
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
      images: ogImage
        ? [
            {
              url: ogImage.url,
              width: ogImage.width,
              height: ogImage.height,
              alt: ogImage.alt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: siteData.metaTitle,
      description: siteData.metaDescription,
      images: ogImage
        ? [
            {
              url: ogImage.url,
              alt: ogImage.alt,
            },
          ]
        : undefined,
    },
    icons: siteData.favicon
      ? {
          icon: [{ url: siteData.favicon, type: "image/png" }],
          apple: [{ url: siteData.favicon, type: "image/png" }],
        }
      : undefined,
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

  const host = (await headers()).get("host") ?? "";
  const publicBasePath = resolvePublicBasePath(siteSlug, host);
  const isCustomDomain = publicBasePath === "";

  return (
    <SiteProvider
      siteSlug={siteSlug as SiteSlug}
      publicBasePath={publicBasePath}
      isCustomDomain={isCustomDomain}
    >
      <JsonLd
        data={[buildWebSiteSchema(siteData), buildOrganizationSchema(siteData)]}
      />
      {!siteUsesEditorialCatalog(siteSlug) && <AdSenseScript />}
      <Header />
      {children}
      <Footer />
    </SiteProvider>
  );
}
