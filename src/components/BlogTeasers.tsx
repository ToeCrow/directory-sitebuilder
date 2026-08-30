import Link from "next/link";
import type { Article } from "@/types/site";
import { getBlogIndexPath, getBlogPostPath } from "@/lib/paths";

type BlogTeasersProps = {
  articles: Article[];
  publicBasePath: string;
};

export function BlogTeasers({ articles, publicBasePath }: BlogTeasersProps) {
  const posts = [...articles].sort((a, b) =>
    (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "") ||
    a.slug.localeCompare(b.slug),
  );

  if (posts.length === 0) {
    return null;
  }

  return (
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
        {posts.slice(0, 4).map((post) => (
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
  );
}
