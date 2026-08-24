"use client";

import Link from "next/link";
import type { SiteSlug } from "@/data/sites";
import { usePublicBasePath } from "@/context/SiteContext";
import { cn } from "@/lib/cn";
import { getSitePath } from "@/lib/paths";

type AffiliateDisclosureProps = {
  siteSlug: SiteSlug;
  className?: string;
};

export function AffiliateDisclosure({
  className,
}: AffiliateDisclosureProps) {
  const publicBasePath = usePublicBasePath();

  return (
    <p
      className={cn(
        "px-4 py-3 text-center text-xs leading-relaxed text-ss-ink/70 sm:text-sm",
        className,
      )}
      aria-label="Affiliate disclosure"
    >
      When you buy with our links, we may earn a commission. See how we work
      with brands{" "}
      <Link
        href={getSitePath(publicBasePath, "/affiliate")}
        className="font-medium text-ss-navy underline-offset-2 hover:underline"
      >
        here
      </Link>
      .
    </p>
  );
}
