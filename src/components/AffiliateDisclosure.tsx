"use client";

import Link from "next/link";
import { usePublicBasePath } from "@/context/SiteContext";
import { cn } from "@/lib/cn";
import { getSitePath } from "@/lib/paths";
import { getSiteTheme, siteHasFeature } from "@/lib/site-config";
import { getThemeClasses } from "@/lib/site-theme";

type AffiliateDisclosureProps = {
  siteSlug: string;
  className?: string;
};

export function AffiliateDisclosure({
  siteSlug,
  className,
}: AffiliateDisclosureProps) {
  const publicBasePath = usePublicBasePath();
  const theme = getThemeClasses(getSiteTheme(siteSlug));
  const disclosurePath = siteHasFeature(siteSlug, "affiliate-disclosure")
    ? "/affiliate-disclosure"
    : "/affiliate";

  return (
    <p
      className={cn(
        "px-4 py-3 text-center text-xs leading-relaxed sm:text-sm",
        theme.disclosureText,
        className,
      )}
      aria-label="Affiliate disclosure"
    >
      When you buy with our links, we may earn a commission. See how we work
      with brands{" "}
      <Link
        href={getSitePath(publicBasePath, disclosurePath)}
        className={theme.disclosureLink}
      >
        here
      </Link>
      .
    </p>
  );
}
