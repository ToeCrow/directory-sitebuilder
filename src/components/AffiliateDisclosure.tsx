"use client";

import Link from "next/link";
import type { SiteSlug } from "@/data/sites";
import { usePublicBasePath } from "@/context/SiteContext";
import { siteUsesEditorialCatalog } from "@/lib/directory-catalog";
import { cn } from "@/lib/cn";
import { getSitePath } from "@/lib/paths";

type AffiliateDisclosureProps = {
  siteSlug: SiteSlug;
  className?: string;
};

export function AffiliateDisclosure({
  siteSlug,
  className,
}: AffiliateDisclosureProps) {
  const publicBasePath = usePublicBasePath();
  const isEditorial = siteUsesEditorialCatalog(siteSlug);

  return (
    <p
      className={cn(
        "px-4 py-3 text-center text-xs leading-relaxed sm:text-sm",
        isEditorial ? "text-fwn-sand/80" : "text-ss-ink/70",
        className,
      )}
      aria-label="Affiliate disclosure"
    >
      When you buy with our links, we may earn a commission. See how we work
      with brands{" "}
      <Link
        href={getSitePath(
          publicBasePath,
          isEditorial ? "/affiliate-disclosure" : "/affiliate",
        )}
        className={
          isEditorial
            ? "font-medium text-fwn-gold underline-offset-2 hover:underline"
            : "font-medium text-ss-navy underline-offset-2 hover:underline"
        }
      >
        here
      </Link>
      .
    </p>
  );
}
