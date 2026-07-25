"use client";

import { createContext, useContext } from "react";
import type { SiteData } from "@/types/site";

type SiteContextValue = {
  siteSlug: string;
  siteData: SiteData;
};

const SiteContext = createContext<SiteContextValue | null>(null);

type SiteProviderProps = {
  siteSlug: string;
  siteData: SiteData;
  children: React.ReactNode;
};

export function SiteProvider({
  siteSlug,
  siteData,
  children,
}: SiteProviderProps) {
  return (
    <SiteContext.Provider value={{ siteSlug, siteData }}>
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

export function useSiteData(): SiteData {
  return useSiteContext().siteData;
}

/** @deprecated Use useSiteData() */
export function useSiteConfig(): SiteData {
  return useSiteData();
}

export function useSiteSlug(): string {
  return useSiteContext().siteSlug;
}
