import Script from "next/script";

const clientId =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "ca-pub-5955637768174044";

export function AdSenseScript() {
  return (
    <Script
      id="adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="beforeInteractive"
    />
  );
}
