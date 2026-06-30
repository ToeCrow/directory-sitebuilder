import { siteConfig } from "@/config/active-site";
import { cn } from "@/lib/cn";

type HeroProps = {
  className?: string;
};

export function Hero({ className }: HeroProps) {
  return (
    <section
      className={cn(
        "border-b border-slate-200 bg-slate-50 py-16 md:py-24",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-4 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-wide text-blue-600">
          Independent comparison guide
        </p>
        <h1 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
          {siteConfig.hero.headline}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
          {siteConfig.hero.subheadline}
        </p>
        <a
          href="#compare"
          className="mt-8 inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          {siteConfig.hero.ctaText}
        </a>
      </div>
    </section>
  );
}
