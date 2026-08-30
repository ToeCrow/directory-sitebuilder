import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/site";
import {
  getArticlePreviewBlurb,
  getArticlePreviewImage,
} from "@/lib/article-preview";
import { getSiteArticlePath } from "@/lib/paths";

type RelatedArticlesProps = {
  articles: Article[];
  publicBasePath: string;
  siteSlug: string;
};

export function RelatedArticles({
  articles,
  publicBasePath,
  siteSlug,
}: RelatedArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section
      className="mt-16 border-t border-ss-navy/10 pt-12"
      aria-labelledby="related-articles-heading"
    >
      <h2
        id="related-articles-heading"
        className="text-2xl font-semibold tracking-tight text-ss-navy"
      >
        Related guides
      </h2>
      <ul className="mt-8 grid gap-10 sm:grid-cols-2">
        {articles.map((article) => {
          const href = getSiteArticlePath(siteSlug, publicBasePath, article.slug);
          const preview = getArticlePreviewImage(article);
          const blurb = getArticlePreviewBlurb(article);

          return (
            <li key={article.slug}>
              <Link href={href} className="group block">
                {preview && (
                  <figure className="relative aspect-4/3 overflow-hidden bg-ss-mist">
                    <Image
                      src={preview.src}
                      alt={preview.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 24rem"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </figure>
                )}
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-ss-navy group-hover:text-ss-blue">
                  {article.title}
                </h3>
                {blurb && (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ss-ink/75">
                    {blurb}
                  </p>
                )}
                <span className="mt-3 inline-block text-sm font-medium text-ss-blue">
                  Read guide
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
