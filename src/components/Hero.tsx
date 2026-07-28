"use client";

import Image from "next/image";
import Link from "next/link";
import type { SiteSlug } from "@/data/sites";
import { usePublicBasePath } from "@/context/SiteContext";
import { getSiteData, siteHasMattressPillowNav } from "@/lib/site";
import { getProductsIndexPath } from "@/lib/paths";
import { InPageHashAnchor } from "@/components/InPageHashAnchor";
import { cn } from "@/lib/cn";

type HeroProps = {
  siteSlug: SiteSlug;
  className?: string;
};

/** Portrait: full width. Landscape: capped height, side margins, max 1536px wide. */
const heroImageClassName = cn(
  "h-auto w-full max-w-[1536px] bg-[#F6F8FC] object-contain",
  "portrait:w-full",
  "landscape:mx-auto landscape:max-h-[min(600px,45svh)] landscape:w-auto",
);

const primaryCtaClassName =
  "inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700";

const secondaryCtaClassName =
  "inline-flex items-center rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-white";

function SideSleeperHeroCtas({
  publicBasePath,
  buyingGuideLabel,
  buyingGuideHref,
}: {
  publicBasePath: string;
  buyingGuideLabel: string;
  buyingGuideHref: string;
}) {
  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <Link
        href={getProductsIndexPath(publicBasePath, "mattress")}
        className={primaryCtaClassName}
      >
        Browse Mattresses
      </Link>
      <Link
        href={getProductsIndexPath(publicBasePath, "pillow")}
        className={primaryCtaClassName}
      >
        Browse Pillows
      </Link>
      <InPageHashAnchor href={buyingGuideHref} className={primaryCtaClassName}>
        {buyingGuideLabel}
      </InPageHashAnchor>
    </div>
  );
}

function DefaultHeroCtas({
  primaryCta,
  primaryCtaHref,
  secondaryCta,
  secondaryCtaHref,
}: {
  primaryCta: string;
  primaryCtaHref: string;
  secondaryCta?: string;
  secondaryCtaHref?: string;
}) {
  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <InPageHashAnchor href={primaryCtaHref} className={primaryCtaClassName}>
        {primaryCta}
      </InPageHashAnchor>
      {secondaryCta && (
        <InPageHashAnchor
          href={secondaryCtaHref ?? "#buying-guide"}
          className={secondaryCtaClassName}
        >
          {secondaryCta}
        </InPageHashAnchor>
      )}
    </div>
  );
}

function HeroCtaGroup({ siteSlug }: { siteSlug: SiteSlug }) {
  const publicBasePath = usePublicBasePath();
  const { hero } = getSiteData(siteSlug);

  if (siteHasMattressPillowNav(siteSlug)) {
    return (
      <SideSleeperHeroCtas
        publicBasePath={publicBasePath}
        buyingGuideLabel={hero.secondaryCta ?? "Read Buying Guide"}
        buyingGuideHref={hero.secondaryCtaHref ?? "#buying-guide"}
      />
    );
  }

  return (
    <DefaultHeroCtas
      primaryCta={hero.primaryCta}
      primaryCtaHref="#compare"
      secondaryCta={hero.secondaryCta}
      secondaryCtaHref={hero.secondaryCtaHref}
    />
  );
}

export function Hero({ siteSlug, className }: HeroProps) {
  const siteData = getSiteData(siteSlug);
  const { hero } = siteData;

  if (hero.image) {
    return (
      <section
        className={cn(
          "border-b border-slate-200 bg-white pt-[30px]",
          className,
        )}
      >
        <div className="mx-auto flex w-full justify-center overflow-hidden bg-[#F6F8FC] px-4 md:px-6">
          {hero.image.srcMobile ? (
            <>
              <Image
                src={hero.image.srcMobile}
                alt={hero.image.alt}
                width={768}
                height={300}
                priority
                sizes="100vw"
                className={cn(heroImageClassName, "md:hidden")}
              />
              <Image
                src={hero.image.src}
                alt={hero.image.alt}
                width={1536}
                height={600}
                priority
                sizes="(max-width: 1536px) calc(100vw - 2rem), 1536px"
                className={cn(heroImageClassName, "hidden md:block")}
              />
            </>
          ) : (
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              width={1536}
              height={600}
              priority
              sizes="(max-width: 1536px) calc(100vw - 2rem), 1536px"
              className={heroImageClassName}
            />
          )}
        </div>

        <div className="mx-auto max-w-6xl bg-white px-4 py-10 text-center md:py-14">
          <h1 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
            {hero.headline}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            {hero.subheadline}
          </p>
          <HeroCtaGroup siteSlug={siteSlug} />
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
        <HeroCtaGroup siteSlug={siteSlug} />
      </div>
    </section>
  );
}
