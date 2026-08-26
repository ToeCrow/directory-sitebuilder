import Link from "next/link";
import {
  getDirectoryCategories,
  getDirectoryProducts,
} from "@/lib/directory-catalog";
import {
  getDirectoryCategoryPath,
  getBlogIndexPath,
  getBlogPostPath,
  getProductsIndexPath,
} from "@/lib/paths";
import { getDirectoryBlogPosts } from "@/lib/directory-blog";
import { getSiteData } from "@/lib/site";

type FindWorthNowHomeProps = {
  siteSlug: string;
  publicBasePath: string;
};

export async function FindWorthNowHome({
  siteSlug,
  publicBasePath,
}: FindWorthNowHomeProps) {
  const siteData = await getSiteData(siteSlug);
  const categories = getDirectoryCategories(siteSlug);
  const posts = getDirectoryBlogPosts(siteSlug);

  return (
    <div className="relative mx-auto max-w-6xl overflow-hidden px-4 py-16 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-fwn-gold/12 blur-3xl"
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
        <Link
          href={getProductsIndexPath(publicBasePath)}
          className="inline-flex items-center rounded-sm bg-fwn-gold px-6 py-3 text-sm font-semibold tracking-wide text-fwn-void shadow-[0_12px_32px_-12px_rgba(196,163,106,0.7)] transition-colors hover:bg-fwn-brass"
        >
          Browse all products
        </Link>
      </p>

      <section className="relative mt-20" aria-labelledby="categories-heading">
        <h2
          id="categories-heading"
          className="text-xs font-semibold uppercase tracking-[0.22em] text-fwn-gold"
        >
          Categories
        </h2>
        <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const count = getDirectoryProducts(siteSlug, category.slug).length;
            return (
              <li key={category.slug}>
                <Link
                  href={getDirectoryCategoryPath(publicBasePath, category.slug)}
                  className="flex h-full flex-col rounded-sm border border-fwn-gold/20 bg-fwn-panel p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-fwn-gold/50 hover:shadow-[0_24px_48px_-24px_rgba(196,163,106,0.45)]"
                >
                  <h3 className="text-xl font-semibold text-fwn-ivory">
                    {category.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-fwn-sand">
                    {category.description}
                  </p>
                  <p className="mt-4 text-sm font-medium tracking-wide text-fwn-gold">
                    {count} {count === 1 ? "review" : "reviews"} →
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {posts.length > 0 && (
        <section className="relative mt-20" aria-labelledby="blog-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2
              id="blog-heading"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-fwn-gold"
            >
              From the blog
            </h2>
            <Link
              href={getBlogIndexPath(publicBasePath)}
              className="text-sm font-medium text-fwn-gold hover:text-fwn-brass"
            >
              View all posts →
            </Link>
          </div>
          <ul className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={getBlogPostPath(publicBasePath, post.slug)}
                  className="flex h-full flex-col rounded-sm border border-fwn-gold/20 bg-fwn-panel p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-fwn-gold/50 hover:shadow-[0_24px_48px_-24px_rgba(196,163,106,0.45)]"
                >
                  <h3 className="text-xl font-semibold text-fwn-ivory">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-fwn-sand">
                    {post.excerpt}
                  </p>
                  <p className="mt-4 text-sm font-medium tracking-wide text-fwn-gold">
                    Read post →
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
