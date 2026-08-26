"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isSiteHomePath, scrollToSectionId } from "@/lib/hash-nav";

type HashScrollOnLoadProps = {
  siteSlug: string;
};

/**
 * When landing on the home page with a hash (e.g. /#faq from another page),
 * ensure we scroll to the target after render.
 */
export function HashScrollOnLoad({ siteSlug }: HashScrollOnLoadProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!isSiteHomePath(pathname, siteSlug)) return;

    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;

    // Wait a tick for layout/sticky header.
    const frame = window.requestAnimationFrame(() => {
      scrollToSectionId(hash);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, siteSlug]);

  return null;
}
