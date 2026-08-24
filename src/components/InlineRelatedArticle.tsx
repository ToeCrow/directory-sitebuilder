import Link from "next/link";
import type { Article } from "@/types/site";
import { getArticlePreviewBlurb } from "@/lib/article-preview";

type InlineRelatedArticleProps = {
  article: Article;
  href: string;
};

export function InlineRelatedArticle({
  article,
  href,
}: InlineRelatedArticleProps) {
  const blurb = getArticlePreviewBlurb(article);

  return (
    <aside
      className="rounded-xl border border-slate-200 bg-slate-50 p-6"
      aria-labelledby={`related-read-${article.slug}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Related read
      </p>
      <p
        id={`related-read-${article.slug}`}
        className="mt-2 text-lg font-semibold tracking-tight text-slate-900"
      >
        <Link
          href={href}
          className="text-slate-900 underline-offset-2 hover:text-blue-600 hover:underline"
        >
          {article.title}
        </Link>
      </p>
      {blurb && (
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{blurb}</p>
      )}
      <Link
        href={href}
        className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        Read article →
      </Link>
    </aside>
  );
}
