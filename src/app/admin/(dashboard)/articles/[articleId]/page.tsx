import Link from "next/link";
import { notFound } from "next/navigation";
import { userCanAccessSite } from "@/lib/admin-access";
import {
  getAdminArticleById,
  listAdminArticlePickerItems,
} from "@/lib/admin/articles";
import { arrayToLines } from "@/lib/admin/lines";
import {
  getNextProductSortOrders,
  listAdminProducts,
} from "@/lib/admin/products";
import { getArticleConfig } from "@/lib/site-config";
import { imageFromUnknown } from "@/lib/media";
import { requireAdminUser } from "@/lib/admin/session";
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
  const user = await requireAdminUser();
  const article = await getAdminArticleById(articleId).catch(() => null);

  if (!article || !userCanAccessSite(user, article.siteSlug)) {
    notFound();
  }

  const [pickerItems, siteProducts, sortOrders] = await Promise.all([
    listAdminArticlePickerItems(article.siteId, article.id),
    listAdminProducts(user, article.siteSlug),
    getNextProductSortOrders(article.siteId),
  ]);

  const articleLabel = getArticleConfig(article.siteSlug)?.label ?? "Articles";

  return (
    <div>
      <Link
        href={`/admin/articles?site=${article.siteSlug}`}
        className="text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        ← Back to {articleLabel.toLowerCase()}
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        Edit {article.title}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        {article.siteTitle} ·{" "}
        {article.kind === "product-roundup" ? "Product roundup" : "Editorial"} ·
        Status: <span className="font-medium">{article.status}</span>
      </p>

      <div className="mt-8">
        <ArticleEditForm
          articleId={article.id}
          siteId={article.siteId}
          kind={article.kind}
          relatedArticles={pickerItems}
          initialRelatedIds={article.relatedArticleIds}
          initialBody={article.body}
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
            introImageSrc: imageFromUnknown(article.content.introImage).src,
            introImageAlt: imageFromUnknown(article.content.introImage).alt,
            status: article.status,
            publishedAt: toDateInputValue(article.publishedAt),
            updatedAtContent: toDateInputValue(article.updatedAtContent),
          }}
        />
      </div>

      {article.kind === "product-roundup" && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-slate-900">
            Review products
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Pick a central product, then write the review copy for this
            roundup. Images and buy links come from the product.
          </p>
          <div className="mt-6">
            <ArticleProductSectionsEditor
              articleId={article.id}
              siteId={article.siteId}
              sections={article.productSections}
              products={siteProducts.map((product) => ({
                id: product.id,
                name: product.name,
                slug: product.slug,
                status: product.status,
              }))}
              nextComparisonRank={sortOrders.comparisonRank}
              nextDirectorySortOrder={sortOrders.directorySortOrder}
            />
          </div>
        </div>
      )}
    </div>
  );
}
