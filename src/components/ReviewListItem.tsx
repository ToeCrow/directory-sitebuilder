import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/site";
import {
  getArticlePreviewBlurb,
  getArticlePreviewImage,
} from "@/lib/article-preview";

type ReviewListItemProps = {
  article: Article;
  href: string;
};

export function ReviewListItem({ article, href }: ReviewListItemProps) {
  const preview = getArticlePreviewImage(article);
  const blurb = getArticlePreviewBlurb(article);

  return (
    <Link
      href={href}
      className="group grid gap-5 border-b border-slate-200 py-8 last:border-b-0 md:grid-cols-[minmax(0,1fr)_16rem] md:items-start md:gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]"
    >
      <div className={preview ? undefined : "md:col-span-2"}>
        <h3 className="text-xl font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-blue-600 md:text-2xl">
          {article.title}
        </h3>
        {blurb && (
          <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-[0.95rem]">
            {blurb}
          </p>
        )}
        <span className="mt-4 inline-block text-sm font-medium text-blue-600 group-hover:text-blue-700">
          Read review →
        </span>
      </div>
      {preview && (
        <figure className="order-first max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-slate-50 md:order-none md:max-w-none">
          <Image
            src={preview.src}
            alt={preview.alt}
            width={640}
            height={480}
            className="aspect-[4/3] h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </figure>
      )}
    </Link>
  );
}
