import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DirectoryProductCard } from "@/components/DirectoryProductCard";
import { siteSlugs } from "@/data/sites";
import {
  getDirectoryBlogPost,
  getDirectoryBlogPosts,
  getRelatedDirectoryBlogPosts,
} from "@/lib/directory-blog";
import {
  getDirectoryProductBySlug,
  siteUsesEditorialCatalog,
} from "@/lib/directory-catalog";
import {
  getBlogIndexPath,
  getBlogPostPath,
  getDirectoryReviewPath,
  getPublicPath,
  getSitePath,
} from "@/lib/paths";
import { getRequestPublicBasePath } from "@/lib/request-paths";
import { buildPageOpenGraph } from "@/lib/seo";
import { getSiteBySlug, isValidSiteSlug } from "@/lib/site";

type BlogPostPageProps = {
  params: Promise<{ siteSlug: string; slug: string }>;
};

export function generateStaticParams() {
  return siteSlugs.flatMap((siteSlug) =>
    getDirectoryBlogPosts(siteSlug).map((post) => ({
      siteSlug,
      slug: post.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { siteSlug, slug } = await params;
  const siteData = getSiteBySlug(siteSlug);
  const post = getDirectoryBlogPost(siteSlug, slug);

  if (!siteData || !post) {
    return { title: "Post not found" };
  }

  const path = getPublicPath(siteSlug, `/blog/${post.slug}`);

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: path },
    openGraph: buildPageOpenGraph({
      site: siteData,
      title: `${post.metaTitle} | ${siteData.title}`,
      description: post.metaDescription,
      path,
      type: "article",
      publishedTime: post.publishedAt,
    }),
  };
}

function formatPublishedDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function DirectoryBlogPostPage({
  params,
}: BlogPostPageProps) {
  const { siteSlug, slug } = await params;

  if (!isValidSiteSlug(siteSlug) || !siteUsesEditorialCatalog(siteSlug)) {
    notFound();
  }

  const post = getDirectoryBlogPost(siteSlug, slug);
  if (!post) {
    notFound();
  }

  const siteData = getSiteBySlug(siteSlug);
  if (!siteData) {
    notFound();
  }

  const publicBasePath = await getRequestPublicBasePath(siteSlug);
  const relatedPosts = getRelatedDirectoryBlogPosts(siteSlug, post);
  const relatedProducts = post.relatedProductSlugs.flatMap((productSlug) => {
    const product = getDirectoryProductBySlug(siteSlug, productSlug);
    return product ? [product] : [];
  });
  const disclosureHref = getSitePath(publicBasePath, "/affiliate-disclosure");

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <Link
        href={getBlogIndexPath(publicBasePath)}
        className="text-sm font-medium text-fwn-gold hover:text-fwn-brass"
      >
        ← Back to blog
      </Link>

      <article className="mt-6">
        <header className="border-b border-fwn-gold/15 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fwn-gold">
            {formatPublishedDate(post.publishedAt)}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fwn-ivory md:text-4xl">
            {post.title}
          </h1>
          {post.intro.map((paragraph) => (
            <p
              key={paragraph.slice(0, 48)}
              className="mt-4 text-lg leading-relaxed text-fwn-sand"
            >
              {paragraph}
            </p>
          ))}
          <p className="mt-6 rounded-sm border border-fwn-gold/20 bg-fwn-panel px-4 py-3 text-sm leading-relaxed text-fwn-sand">
            <span className="font-semibold text-fwn-ivory">
              Affiliate disclosure:
            </span>{" "}
            We may earn a commission if you purchase through links on this page,
            at no additional cost to you.{" "}
            <Link
              href={disclosureHref}
              className="font-medium text-fwn-gold hover:text-fwn-brass"
            >
              Read the full disclosure
            </Link>
            .
          </p>
        </header>

        {post.sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="text-2xl font-semibold tracking-tight text-fwn-ivory">
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="mt-4 text-base leading-relaxed text-fwn-sand"
              >
                {paragraph}
              </p>
            ))}
            {section.bullets && section.bullets.length > 0 && (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-fwn-sand">
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </article>

      {relatedProducts.length > 0 && (
        <section className="mt-12 border-t border-fwn-gold/15 pt-8">
          <h2 className="text-2xl font-semibold tracking-tight text-fwn-ivory">
            Related overviews
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {relatedProducts.map((product) => (
              <li key={product.slug}>
                <DirectoryProductCard
                  product={product}
                  href={getDirectoryReviewPath(
                    publicBasePath,
                    product.categorySlug,
                    product.reviewSlug,
                  )}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {relatedPosts.length > 0 && (
        <section className="mt-12 border-t border-fwn-gold/15 pt-8">
          <h2 className="text-2xl font-semibold tracking-tight text-fwn-ivory">
            Related reading
          </h2>
          <ul className="mt-6 space-y-4">
            {relatedPosts.map((related) => (
              <li key={related.slug}>
                <Link
                  href={getBlogPostPath(publicBasePath, related.slug)}
                  className="group block"
                >
                  <h3 className="text-lg font-semibold text-fwn-ivory group-hover:text-fwn-gold">
                    {related.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-fwn-sand">
                    {related.excerpt}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
