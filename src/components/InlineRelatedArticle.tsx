import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/site";
import {
  getArticlePreviewBlurb,
  getArticlePreviewImage,
} from "@/lib/article-preview";

type InlineRelatedArticleProps = {
  article: Article;
  href: string;
};

export function InlineRelatedArticle({
  article,
  href,
}: InlineRelatedArticleProps) {
  const blurb = getArticlePreviewBlurb(article);
  const preview = getArticlePreviewImage(article);

  return (
    <aside
      className="border-y border-ss-blue/30 py-6"
      aria-labelledby={`related-read-${article.slug}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ss-blue">
        Related read
      </p>
      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start">
        {preview && (
          <Link
            href={href}
            className="relative aspect-4/3 w-full shrink-0 overflow-hidden sm:w-44"
          >
            <Image
              src={preview.src}
              alt={preview.alt}
              fill
              sizes="(max-width: 640px) 100vw, 11rem"
              className="object-cover"
            />
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <p
            id={`related-read-${article.slug}`}
            className="text-xl font-semibold tracking-tight text-ss-navy"
          >
            <Link href={href} className="hover:text-ss-blue">
              {article.title}
            </Link>
          </p>
          {blurb && (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ss-ink/75">
              {blurb}
            </p>
          )}
          <Link
            href={href}
            className="mt-3 inline-block text-sm font-medium text-ss-navy underline decoration-ss-blue/50 underline-offset-4 hover:text-ss-blue"
          >
            Continue reading
          </Link>
        </div>
      </div>
    </aside>
  );
}
