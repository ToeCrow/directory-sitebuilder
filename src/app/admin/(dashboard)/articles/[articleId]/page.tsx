import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminArticleById } from "@/lib/admin/articles";
import { arrayToLines } from "@/lib/admin/lines";
import { ArticleEditForm } from "./ArticleEditForm";
import { ArticleProductSectionsEditor } from "./ArticleProductSectionsEditor";

export const dynamic = "force-dynamic";

type ArticleEditPageProps = {
  params: Promise<{ articleId: string }>;
};

function toDateInputValue(value: Date | null): string {
  if (!value) {
    return "";
  }
  return value.toISOString().slice(0, 10);
}

export default async function AdminArticleEditPage({
  params,
}: ArticleEditPageProps) {
  const { articleId } = await params;
  const article = await getAdminArticleById(articleId).catch(() => null);

  if (!article) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/articles"
        className="text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        ← Back to articles
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        Edit {article.title}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        {article.siteTitle} · Status:{" "}
        <span className="font-medium">{article.status}</span>
      </p>

      <div className="mt-8">
        <ArticleEditForm
          articleId={article.id}
          initial={{
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt ?? "",
            introText: arrayToLines(article.intro),
            researchNoteTitle: article.researchNoteTitle,
            researchNoteContent: article.researchNoteContent,
            author: article.author ?? "",
            ogImageSrc: article.ogImageSrc ?? "",
            ogImageAlt: article.ogImageAlt ?? "",
            status: article.status,
            publishedAt: toDateInputValue(article.publishedAt),
            updatedAtContent: toDateInputValue(article.updatedAtContent),
          }}
        />
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold text-slate-900">
          Product sections
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Sections shown within the article body, in order.
        </p>
        <div className="mt-6">
          <ArticleProductSectionsEditor
            articleId={article.id}
            sections={article.productSections}
          />
        </div>
      </div>
    </div>
  );
}
