import type { SiteSlug } from "@/data/sites";
import { getSiteData } from "@/lib/site";
import { cn } from "@/lib/cn";

type HeroProps = {
  siteSlug: SiteSlug;
  className?: string;
};

export function Hero({ siteSlug, className }: HeroProps) {
  const siteData = getSiteData(siteSlug);
  const { hero } = siteData;

  return (
    <section
      className={cn(
        "border-b border-slate-200 bg-slate-50 py-16 md:py-24",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-4 text-center">
        {hero.eyebrow && (
          <p className="mb-4 text-sm font-medium uppercase tracking-wide text-blue-600">
            {hero.eyebrow}
          </p>
        )}
        <h1 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
          {hero.headline}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
          {hero.subheadline}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#compare"
            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {hero.primaryCta}
          </a>
          {hero.secondaryCta && (
            <a
              href={hero.secondaryCtaHref ?? "#buying-guide"}
              className="inline-flex items-center rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-white"
            >
              {hero.secondaryCta}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
