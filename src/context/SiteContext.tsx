"use client";

import { createContext, useContext } from "react";
import type { SiteId } from "@/config/sites";
import { getSiteConfig } from "@/lib/site";
import type { SiteConfig } from "@/types/site";

type SiteContextValue = {
  siteSlug: SiteId;
  siteConfig: SiteConfig;
};

const SiteContext = createContext<SiteContextValue | null>(null);

type SiteProviderProps = {
  siteSlug: SiteId;
  children: React.ReactNode;
};

export function SiteProvider({ siteSlug, children }: SiteProviderProps) {
  const siteConfig = getSiteConfig(siteSlug);

  return (
    <SiteContext.Provider value={{ siteSlug, siteConfig }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteContext(): SiteContextValue {
  const context = useContext(SiteContext);

  if (!context) {
    throw new Error("useSiteContext must be used within a SiteProvider");
  }

  return context;
}

export function useSiteConfig(): SiteConfig {
  return useSiteContext().siteConfig;
}

export function useSiteSlug(): SiteId {
  return useSiteContext().siteSlug;
}
