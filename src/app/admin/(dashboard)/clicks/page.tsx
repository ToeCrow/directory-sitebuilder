import Link from "next/link";
import { formatClickedLinkLabel, listTopClickedLinks } from "@/lib/admin/clicks";
import { listAdminSites } from "@/lib/admin/sites";

export const dynamic = "force-dynamic";

type ClicksPageProps = {
  searchParams: Promise<{ site?: string }>;
};

export default async function AdminClicksPage({
  searchParams,
}: ClicksPageProps) {
  const { site: siteFilter } = await searchParams;
  let links: Awaited<ReturnType<typeof listTopClickedLinks>> = [];
  let sites: Awaited<ReturnType<typeof listAdminSites>> = [];
  let loadError: string | null = null;

  try {
    [links, sites] = await Promise.all([
      listTopClickedLinks(siteFilter || undefined),
      listAdminSites(),
    ]);
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Could not load click totals from the database.";
  }

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Clicks
        </h1>
        <p className="mt-2 text-slate-600">
          Aggregated public link totals. First click creates the row; there is
          no per-click event log.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/admin/clicks"
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
            href={`/admin/clicks?site=${site.slug}`}
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
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </p>
      )}

      {!loadError && links.length === 0 && (
        <p className="mt-6 text-sm text-slate-600">
          No tracked clicks yet. Totals appear after the first public click.
        </p>
      )}

      {links.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-lg bg-white ring-1 ring-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Link</th>
                {!siteFilter && (
                  <th className="px-4 py-3 font-medium">Site</th>
                )}
                <th className="px-4 py-3 text-right font-medium">7d</th>
                <th className="px-4 py-3 text-right font-medium">30d</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">
                      {formatClickedLinkLabel(link)}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {link.sourceType}
                      {link.sourcePath ? ` · ${link.sourcePath}` : ""}
                    </p>
                  </td>
                  {!siteFilter && (
                    <td className="px-4 py-3 text-slate-600">{link.siteTitle}</td>
                  )}
                  <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                    {link.clicks7d}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                    {link.clicks30d}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium text-slate-900">
                    {link.totalClicks}
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
