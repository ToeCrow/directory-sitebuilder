import { BlogTeasers } from "@/components/BlogTeasers";
import { CategoryGrid } from "@/components/CategoryGrid";
import { TrackedLink } from "@/components/TrackedLink";
import { getProductsIndexPath } from "@/lib/paths";
import { getSiteData } from "@/lib/site";
import { siteHasHomepageSection } from "@/lib/site-config";

type FindWorthNowHomeProps = {
  siteSlug: string;
  publicBasePath: string;
};

export async function FindWorthNowHome({
  siteSlug,
  publicBasePath,
}: FindWorthNowHomeProps) {
  const siteData = await getSiteData(siteSlug);

  return (
    <div className="relative mx-auto max-w-6xl overflow-hidden px-4 py-16 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-80 w-160 -translate-x-1/2 rounded-full bg-fwn-gold/12 blur-3xl"
      />
      {siteData.hero.eyebrow && (
        <p className="relative text-xs font-semibold uppercase tracking-[0.28em] text-fwn-gold">
          {siteData.hero.eyebrow}
        </p>
      )}
      <h1 className="relative mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-fwn-ivory md:text-6xl">
        {siteData.hero.headline}
      </h1>
      <p className="relative mt-6 max-w-2xl text-lg leading-relaxed text-fwn-sand">
        {siteData.hero.subheadline}
      </p>
      <p className="relative mt-10">
        <TrackedLink
          href={getProductsIndexPath(publicBasePath)}
          placement="hero-cta"
          target={{ type: "path" }}
          source={{ type: "page" }}
          label="Browse all products"
          className="inline-flex items-center rounded-sm bg-fwn-gold px-6 py-3 text-sm font-semibold tracking-wide text-fwn-void shadow-[0_12px_32px_-12px_rgba(196,163,106,0.7)] transition-colors hover:bg-fwn-brass"
        >
          Browse all products
        </TrackedLink>
      </p>

      {siteHasHomepageSection(siteSlug, "category-grid") && (
        <CategoryGrid siteSlug={siteSlug} publicBasePath={publicBasePath} />
      )}
      {siteHasHomepageSection(siteSlug, "blog-teasers") && (
        <BlogTeasers
          articles={siteData.articles}
          publicBasePath={publicBasePath}
        />
      )}
    </div>
  );
}
