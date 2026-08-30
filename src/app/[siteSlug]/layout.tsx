import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { DatabaseUnavailable } from "@/components/DatabaseUnavailable";
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
import { formatDatabaseLoadError } from "@/lib/db/connection";
import { getSiteBySlug, isMissingSiteError } from "@/lib/site";
import { getSiteTheme, siteHasFeature } from "@/lib/site-config";
import { getThemeClasses } from "@/lib/site-theme";

type SiteLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ siteSlug: string }>;
};

export async function generateMetadata({
  params,
}: SiteLayoutProps): Promise<Metadata> {
  const { siteSlug } = await params;
  let siteData;
  try {
    siteData = await getSiteBySlug(siteSlug);
  } catch (error) {
    if (!isMissingSiteError(error)) {
      console.error("[db] failed to load site metadata", error);
    }
    return {};
  }

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

  let siteData;
  try {
    siteData = await getSiteBySlug(siteSlug);
  } catch (error) {
    if (isMissingSiteError(error)) {
      notFound();
    }
    console.error("[db] failed to load site layout", error);
    return <DatabaseUnavailable message={formatDatabaseLoadError(error)} />;
  }

  if (!siteData) {
    notFound();
  }

  const host = (await headers()).get("host") ?? "";
  const publicBasePath = resolvePublicBasePath(siteSlug, host);
  const isCustomDomain = publicBasePath === "";
  const theme = getThemeClasses(getSiteTheme(siteSlug));

  return (
    <SiteProvider
      siteSlug={siteSlug}
      siteData={siteData}
      publicBasePath={publicBasePath}
      isCustomDomain={isCustomDomain}
    >
      <div className={theme.shell}>
        <JsonLd
          data={[buildWebSiteSchema(siteData), buildOrganizationSchema(siteData)]}
        />
        {siteHasFeature(siteSlug, "ads") && <AdSenseScript />}
        <Header />
        {children}
        <Footer />
      </div>
    </SiteProvider>
  );
}
