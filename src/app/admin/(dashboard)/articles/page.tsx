import Link from "next/link";
import { listAdminArticles } from "@/lib/admin/articles";
import { listAdminSites } from "@/lib/admin/sites";
import { StatusControls } from "./StatusControls";

export const dynamic = "force-dynamic";

type ArticlesPageProps = {
  searchParams: Promise<{ site?: string }>;
};

export default async function AdminArticlesPage({
  searchParams,
}: ArticlesPageProps) {
  const { site: siteFilter } = await searchParams;

  let articles: Awaited<ReturnType<typeof listAdminArticles>> = [];
  let sites: Awaited<ReturnType<typeof listAdminSites>> = [];
  let loadError: string | null = null;

  try {
    [articles, sites] = await Promise.all([
      listAdminArticles(siteFilter || undefined),
      listAdminSites(),
    ]);
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Could not load articles from the database.";
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Articles
      </h1>
      <p className="mt-2 text-slate-600">
        Edit article content, product sections, and publish status. Saving a
        published article updates the public site immediately.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/admin/articles"
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            !siteFilter
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-700 ring-1 ring-slate-200"
          }`}
        >
          All sites
        </Link>
        {sites.map((site) => (
          <Link
            key={site.id}
            href={`/admin/articles?site=${site.slug}`}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              siteFilter === site.slug
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200"
            }`}
          >
            {site.title}
          </Link>
        ))}
      </div>

      {loadError && (
        <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError} Start Postgres with <code>npm run db:up</code>, then{" "}
          <code>npm run db:migrate</code> and <code>npm run db:seed</code>.
        </p>
      )}

      {!loadError && articles.length === 0 && (
        <p className="mt-6 text-sm text-slate-600">
          No articles found. Run <code>npm run db:seed</code> if the database
          is empty.
        </p>
      )}

      {articles.length > 0 && (
        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Article</th>
                <th className="px-4 py-3 font-medium">Site</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr
                  key={article.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">
                      {article.title}
                    </p>
                    <p className="text-xs text-slate-500">/{article.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {article.siteTitle}
                  </td>
                  <td className="px-4 py-3">
                    <StatusControls
                      articleId={article.id}
                      status={article.status}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
