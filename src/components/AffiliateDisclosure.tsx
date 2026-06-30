import { siteConfig } from "@/config/active-site";
import { cn } from "@/lib/cn";

type AffiliateDisclosureProps = {
  className?: string;
};

export function AffiliateDisclosure({ className }: AffiliateDisclosureProps) {
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
