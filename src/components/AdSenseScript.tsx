"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { isPrivacyPolicyPath } from "@/lib/privacy-policy";

const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export function AdSenseScript() {
  const pathname = usePathname();

  if (!clientId || isPrivacyPolicyPath(pathname)) {
    return null;
  }

  return (
    <Script
      id="adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
