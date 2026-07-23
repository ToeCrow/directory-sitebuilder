import Image from "next/image";
import type { SiteSlug } from "@/data/sites";
import { getSiteData } from "@/lib/site";
import { cn } from "@/lib/cn";

type HeroProps = {
  siteSlug: SiteSlug;
  className?: string;
};

const heroImageClassName =
  "mx-auto h-auto max-h-[min(600px,50svh)] w-auto max-w-full object-contain";

function HeroCtas({
  primaryCta,
  secondaryCta,
  secondaryCtaHref,
}: {
  primaryCta: string;
  secondaryCta?: string;
  secondaryCtaHref?: string;
}) {
  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <a
        href="#compare"
        className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
      >
        {primaryCta}
      </a>
      {secondaryCta && (
        <a
          href={secondaryCtaHref ?? "#buying-guide"}
          className="inline-flex items-center rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-white"
        >
          {secondaryCta}
        </a>
      )}
    </div>
  );
}

export function Hero({ siteSlug, className }: HeroProps) {
  const siteData = getSiteData(siteSlug);
  const { hero } = siteData;

  if (hero.image) {
    return (
      <section className={cn("border-b border-slate-200 bg-white", className)}>
        <div className="flex w-full justify-center overflow-hidden bg-slate-100">
          {hero.image.srcMobile ? (
            <>
              <Image
                src={hero.image.srcMobile}
                alt={hero.image.alt}
                width={768}
                height={403}
                priority
                sizes="100vw"
                className={cn(heroImageClassName, "md:hidden")}
              />
              <Image
                src={hero.image.src}
                alt={hero.image.alt}
                width={1200}
                height={630}
                priority
                sizes="(max-width: 1200px) 100vw, 1143px"
                className={cn(heroImageClassName, "hidden md:block")}
              />
            </>
          ) : (
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              width={1200}
              height={630}
              priority
              sizes="(max-width: 1200px) 100vw, 1143px"
              className={heroImageClassName}
            />
          )}
        </div>

        <div className="mx-auto max-w-6xl px-4 py-10 text-center md:py-14">
          <h1 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
            {hero.headline}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            {hero.subheadline}
          </p>
          <HeroCtas
            primaryCta={hero.primaryCta}
            secondaryCta={hero.secondaryCta}
            secondaryCtaHref={hero.secondaryCtaHref}
          />
        </div>
      </section>
    );
  }

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
        <HeroCtas
          primaryCta={hero.primaryCta}
          secondaryCta={hero.secondaryCta}
          secondaryCtaHref={hero.secondaryCtaHref}
        />
      </div>
    </section>
  );
}
