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
      className="group grid gap-5 border-b border-ss-navy/10 py-8 last:border-b-0 md:grid-cols-[minmax(0,1fr)_16rem] md:items-start md:gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]"
    >
      <div className={preview ? undefined : "md:col-span-2"}>
        <h3 className="text-xl font-semibold tracking-tight text-ss-navy transition-colors group-hover:text-ss-blue md:text-2xl">
          {article.title}
        </h3>
        {blurb && (
          <p className="mt-3 text-sm leading-relaxed text-ss-ink/75 md:text-[0.95rem]">
            {blurb}
          </p>
        )}
        <span className="mt-4 inline-block text-sm font-medium text-ss-blue">
          Read review →
        </span>
      </div>
      {preview && (
        <figure className="relative order-first aspect-4/3 max-w-sm overflow-hidden bg-ss-mist md:order-0 md:max-w-none">
          <Image
            src={preview.src}
            alt={preview.alt}
            fill
            sizes="(max-width: 768px) 100vw, 18rem"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </figure>
      )}
    </Link>
  );
}
