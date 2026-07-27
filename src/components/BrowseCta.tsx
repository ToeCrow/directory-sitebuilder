import Link from "next/link";
import type { SiteSlug } from "@/data/sites";
import { getComparisonsPath, getProductsIndexPath } from "@/lib/paths";
import { siteHasMattressPillowNav } from "@/lib/site";
import { cn } from "@/lib/cn";

type BrowseCtaProps = {
  siteSlug: SiteSlug;
  className?: string;
};

export function BrowseCta({ siteSlug, className }: BrowseCtaProps) {
  if (!siteHasMattressPillowNav(siteSlug)) {
    return null;
  }

  const links = [
    {
      href: getProductsIndexPath(siteSlug, "mattress"),
      label: "Browse Mattresses",
    },
    {
      href: getProductsIndexPath(siteSlug, "pillow"),
      label: "Browse Pillows",
    },
    {
      href: getComparisonsPath(siteSlug),
      label: "Compare Mattresses",
    },
  ];

  return (
    <section
      className={cn("border-y border-slate-200 bg-slate-50 py-12 md:py-14", className)}
      aria-labelledby="browse-cta-heading"
    >
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2
          id="browse-cta-heading"
          className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl"
        >
          Explore products
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
          Browse mattress and pillow reviews, or jump straight to the comparison
          table.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
