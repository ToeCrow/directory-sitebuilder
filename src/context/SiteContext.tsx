"use client";

import { createContext, useContext } from "react";
import type { SiteData } from "@/types/site";

type SiteContextValue = {
  siteSlug: string;
  siteData: SiteData;
  /** "" on mapped custom domain; "/{siteSlug}" on platform. */
  publicBasePath: string;
  isCustomDomain: boolean;
};

const SiteContext = createContext<SiteContextValue | null>(null);

type SiteProviderProps = {
  siteSlug: string;
  siteData: SiteData;
  publicBasePath: string;
  isCustomDomain: boolean;
  children: React.ReactNode;
};

export function SiteProvider({
  siteSlug,
  siteData,
  publicBasePath,
  isCustomDomain,
  children,
}: SiteProviderProps) {
  return (
    <SiteContext.Provider
      value={{ siteSlug, siteData, publicBasePath, isCustomDomain }}
    >
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

export function usePublicBasePath(): string {
  return useSiteContext().publicBasePath;
}
