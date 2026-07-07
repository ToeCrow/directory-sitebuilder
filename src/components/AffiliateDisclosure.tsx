import type { SiteSlug } from "@/data/sites";
import { getSiteData } from "@/lib/site";
import { cn } from "@/lib/cn";

type AffiliateDisclosureProps = {
  siteSlug: SiteSlug;
  className?: string;
};

export function AffiliateDisclosure({
  siteSlug,
  className,
}: AffiliateDisclosureProps) {
  const siteData = getSiteData(siteSlug);

  return (
    <aside
      className={cn(
        "border-y border-amber-200 bg-amber-50 py-8",
        className,
      )}
      aria-label="Affiliate disclosure"
    >
      <div className="mx-auto max-w-3xl px-4">
        <p className="text-sm leading-relaxed text-amber-900">
          {siteData.affiliateDisclosure}
        </p>
      </div>
    </aside>
  );
}
