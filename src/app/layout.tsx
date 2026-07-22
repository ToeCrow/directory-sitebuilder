import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { headers } from "next/headers";
import { platformConfig } from "@/config/platform";
import { getSiteSlugFromHost } from "@/lib/domain-map";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const IMPACT_SITE_VERIFICATION = "55f30b2b-1340-482b-8e3b-1c531ba4b4ef";

export const metadata: Metadata = {
  title: platformConfig.metadata.title,
  description: platformConfig.metadata.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const host = (await headers()).get("host") ?? "";
  // Impact asks for the meta at the top of <head> on the homepage.
  const showImpactVerification = getSiteSlugFromHost(host) === "side-sleeper";

  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        {showImpactVerification && (
          <meta
            name="impact-site-verification"
            {...{ value: IMPACT_SITE_VERIFICATION }}
          />
        )}
      </head>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
