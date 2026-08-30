"use client";

import { createContext, useContext, type ReactNode } from "react";

export type TrackingSourceValue = {
  type: string;
  id?: string;
  path?: string;
};

const TrackingSourceContext = createContext<TrackingSourceValue | null>(null);

export function TrackingSourceProvider({
  source,
  children,
}: {
  source: TrackingSourceValue;
  children: ReactNode;
}) {
  return (
    <TrackingSourceContext.Provider value={source}>
      {children}
    </TrackingSourceContext.Provider>
  );
}

export function useTrackingSource(): TrackingSourceValue | null {
  return useContext(TrackingSourceContext);
}
