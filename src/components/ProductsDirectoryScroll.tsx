"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { scrollToSectionId } from "@/lib/hash-nav";

/**
 * When landing on /products with a category filter (from nav), scroll to the
 * directory section instead of leaving the user at the top featured grid.
 */
export function ProductsDirectoryScroll() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    if (!category) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      scrollToSectionId("directory");
    });
    return () => window.cancelAnimationFrame(frame);
  }, [category]);

  return null;
}
