import Link from "next/link";
import { requireAdminUser } from "@/lib/admin/session";
import { listAdminSites } from "@/lib/admin/sites";
import { getComparisonSection, listComparisonRows } from "@/lib/admin/comparison";
import { ComparisonManager } from "./ComparisonManager";

export const dynamic = "force-dynamic";

type ComparisonPageProps = {
  searchParams: Promise<{ site?: string }>;
};

export default async function AdminComparisonPage({
  searchParams,
}: ComparisonPageProps) {
  const { site: siteSlug } = await searchParams;
  const user = await requireAdminUser();

  let sites: Awaited<ReturnType<typeof listAdminSites>> = [];
  let loadError: string | null = null;

  try {
    sites = await listAdminSites(user);
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Could not load sites from the database.";
  }

  const activeSite =
    (siteSlug ? sites.find((s) => s.slug === siteSlug) : sites[0]) ?? null;

  let section: Awaited<ReturnType<typeof getComparisonSection>> = {
    title: "",
    description: "",
    rowHeaderLabel: "",
  };
  let rows: Awaited<ReturnType<typeof listComparisonRows>> = [];

  if (activeSite && !loadError) {
    try {
      [section, rows] = await Promise.all([
        getComparisonSection(activeSite.id),
        listComparisonRows(activeSite.id),
      ]);
    } catch (error) {
      loadError =
        error instanceof Error
          ? error.message
          : "Could not load comparison data from the database.";
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Comparison table
      </h1>
      <p className="mt-2 text-slate-600">
        Edit the comparison table title and rows shown on the site.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {sites.map((site) => (
          <Link
            key={site.id}
            href={`/admin/comparison?site=${site.slug}`}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              activeSite?.id === site.id
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

      {!loadError && !activeSite && (
        <p className="mt-6 text-sm text-slate-600">
          No sites found. Run <code>npm run db:seed</code> if the database is
          empty.
        </p>
      )}

      {!loadError && activeSite && (
        <div className="mt-8">
          <ComparisonManager
            siteId={activeSite.id}
            section={section}
            rows={rows}
          />
        </div>
      )}
    </div>
  );
}
