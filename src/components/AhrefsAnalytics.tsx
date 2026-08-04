import Script from "next/script";

export function AhrefsAnalytics() {
  return (
    <Script
      src="https://analytics.ahrefs.com/analytics.js"
      strategy="afterInteractive"
      data-key="M+SRpf6b4Nw9DEgo1gij1A"
    />
  );
}
