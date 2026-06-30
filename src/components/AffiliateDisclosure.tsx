import type { SiteId } from "@/config/sites";
import { getSiteConfig } from "@/lib/site";
import { cn } from "@/lib/cn";

type AffiliateDisclosureProps = {
  siteSlug: SiteId;
  className?: string;
};

export function AffiliateDisclosure({
  siteSlug,
  className,
}: AffiliateDisclosureProps) {
  const siteConfig = getSiteConfig(siteSlug);

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
          {siteConfig.affiliateDisclosure}
        </p>
      </div>
    </aside>
  );
}
