import Link from "next/link";
import { listAdminSites } from "@/lib/admin/sites";
import { getArticleConfig } from "@/lib/site-config";
import { ArticleCreateForm } from "./ArticleCreateForm";

export const dynamic = "force-dynamic";

type NewArticlePageProps = {
  searchParams: Promise<{ site?: string }>;
};

export default async function AdminNewArticlePage({
  searchParams,
}: NewArticlePageProps) {
  const { site: siteSlugFilter } = await searchParams;
  let sites: Awaited<ReturnType<typeof listAdminSites>> = [];
  let loadError: string | null = null;

  try {
    sites = await listAdminSites();
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Could not load sites from the database.";
  }

  const initialSite =
    sites.find((site) => site.slug === siteSlugFilter) ?? sites[0] ?? null;
  const articleLabel = initialSite
    ? (getArticleConfig(initialSite.slug)?.label ?? "Articles")
    : "Articles";

  return (
    <div>
      <Link
        href={
          siteSlugFilter
            ? `/admin/articles?site=${siteSlugFilter}`
            : "/admin/articles"
        }
        className="text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        ← Back to {articleLabel.toLowerCase()}
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        New {articleLabel.toLowerCase().replace(/s$/, "")}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Create an editorial post or a product roundup. New rows start as drafts.
      </p>

      {loadError && (
        <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError}
        </p>
      )}

      {!loadError && sites.length === 0 && (
        <p className="mt-6 text-sm text-slate-600">
          No sites found. Seed the database first.
        </p>
      )}

      {!loadError && initialSite && (
        <div className="mt-8">
          <ArticleCreateForm
            sites={sites.map((site) => ({
              id: site.id,
              title: site.title,
              slug: site.slug,
            }))}
            initialSiteId={initialSite.id}
          />
        </div>
      )}
    </div>
  );
}
