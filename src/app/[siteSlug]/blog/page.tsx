import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostPath, getPublicPath } from "@/lib/paths";
import { getRequestPublicBasePath } from "@/lib/request-paths";
import { buildPageOpenGraph } from "@/lib/seo";
import { getSiteBySlug, isValidSiteSlug } from "@/lib/site";
import { canAccessRoute, getStaticParamSiteSlugsForRoute } from "@/lib/site-routes";

type BlogIndexProps = {
  params: Promise<{ siteSlug: string }>;
};

export function generateStaticParams() {
  return getStaticParamSiteSlugsForRoute("blog").map((siteSlug) => ({
    siteSlug,
  }));
}

export async function generateMetadata({
  params,
}: BlogIndexProps): Promise<Metadata> {
  const { siteSlug } = await params;
  const siteData = await getSiteBySlug(siteSlug);
  if (!siteData || !canAccessRoute(siteSlug, "blog")) {
    return { title: "Blog" };
  }

  const path = getPublicPath(siteSlug, "/blog");
  const description =
    "Short reads from FindWorthNow on sleep, supplements, programs, and what is worth considering — without treating any of it as medical advice.";

  return {
    title: "Blog",
    description,
    alternates: { canonical: path },
    openGraph: buildPageOpenGraph({
      site: siteData,
      title: `Blog | ${siteData.title}`,
      description,
      path,
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

export default async function DirectoryBlogIndexPage({
  params,
}: BlogIndexProps) {
  const { siteSlug } = await params;

  if (!(await isValidSiteSlug(siteSlug)) || !canAccessRoute(siteSlug, "blog")) {
    notFound();
  }

  const siteData = await getSiteBySlug(siteSlug);
  if (!siteData) {
    notFound();
  }

  const publicBasePath = await getRequestPublicBasePath(siteSlug);
  const posts = [...siteData.articles].sort(
    (a, b) =>
      (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "") ||
      a.slug.localeCompare(b.slug),
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-fwn-ivory md:text-4xl">
        Blog
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-fwn-sand">
        Short reads on products, programs, and ideas we already cover. These
        posts are not medical advice, and they are not hands-on tests.
      </p>

      {posts.length === 0 ? (
        <p className="mt-10 text-fwn-sand">No posts published yet.</p>
      ) : (
        <ul className="mt-10 divide-y divide-fwn-gold/15 border-t border-fwn-gold/15">
          {posts.map((post) => (
            <li key={post.slug} className="py-8">
              {post.publishedAt && (
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fwn-gold">
                  {formatPublishedDate(post.publishedAt)}
                </p>
              )}
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-fwn-ivory">
                <Link
                  href={getBlogPostPath(publicBasePath, post.slug)}
                  className="hover:text-fwn-gold"
                >
                  {post.title}
                </Link>
              </h2>
              {post.excerpt && (
                <p className="mt-3 text-base leading-relaxed text-fwn-sand">
                  {post.excerpt}
                </p>
              )}
              <Link
                href={getBlogPostPath(publicBasePath, post.slug)}
                className="mt-4 inline-block text-sm font-medium tracking-wide text-fwn-gold hover:text-fwn-brass"
              >
                Read post →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
