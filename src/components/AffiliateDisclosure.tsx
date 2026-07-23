import Link from "next/link";
import type { SiteSlug } from "@/data/sites";
import { cn } from "@/lib/cn";

type AffiliateDisclosureProps = {
  siteSlug: SiteSlug;
  className?: string;
};

export function AffiliateDisclosure({
  siteSlug,
  className,
}: AffiliateDisclosureProps) {
  return (
    <p
      className={cn(
        "px-4 py-3 text-center text-xs leading-relaxed text-slate-600 sm:text-sm",
        className,
      )}
      aria-label="Affiliate disclosure"
    >
      When you buy with our links, we may earn a commission. See how we work
      with brands{" "}
      <Link
        href={`/${siteSlug}/affiliate`}
        className="font-medium text-blue-600 underline-offset-2 hover:underline"
      >
        here
      </Link>
      .
    </p>
  );
}
