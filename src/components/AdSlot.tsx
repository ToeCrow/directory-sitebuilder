"use client";

import { useEffect } from "react";
import { useSiteConfig } from "@/context/SiteContext";
import { cn } from "@/lib/cn";
import type { AdSlotId } from "@/types/site";

type AdSlotProps = {
  slotId: AdSlotId;
  className?: string;
};

const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export function AdSlot({ slotId, className }: AdSlotProps) {
  const siteConfig = useSiteConfig();
  const adUnitId = siteConfig.ads?.slots[slotId];
  const isConfigured = Boolean(clientId && adUnitId);

  useEffect(() => {
    if (!isConfigured) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense may not be loaded yet in development
    }
  }, [isConfigured]);

  return (
    <section
      aria-label="Advertisement"
      className={cn(
        "flex items-center justify-center overflow-hidden py-8",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-3xl px-4">
        {isConfigured ? (
          <ins
            className="adsbygoogle block w-full"
            style={{ display: "block" }}
            data-ad-client={clientId}
            data-ad-slot={adUnitId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <div className="flex h-[250px] w-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400">
            Advertisement
          </div>
        )}
      </div>
    </section>
  );
}
