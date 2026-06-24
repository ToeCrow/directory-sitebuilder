import { siteConfig } from "@/config/active-site";

export function AffiliateDisclosure() {
  return (
    <aside
      className="border-y border-amber-200 bg-amber-50 py-8"
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
