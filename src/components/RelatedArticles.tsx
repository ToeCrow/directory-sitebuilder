import { ReviewListItem } from "@/components/ReviewListItem";
import type { Article } from "@/types/site";
import { getArticlePath } from "@/lib/paths";

type RelatedArticlesProps = {
  articles: Article[];
  publicBasePath: string;
};

export function RelatedArticles({
  articles,
  publicBasePath,
}: RelatedArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section
      className="mt-16 border-t border-slate-200 pt-12"
      aria-labelledby="related-articles-heading"
    >
      <h2
        id="related-articles-heading"
        className="text-2xl font-bold tracking-tight text-slate-900"
      >
        Related articles
      </h2>
      <ul className="mt-2">
        {articles.map((article) => (
          <li key={article.slug}>
            <ReviewListItem
              article={article}
              href={getArticlePath(publicBasePath, article.slug)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
