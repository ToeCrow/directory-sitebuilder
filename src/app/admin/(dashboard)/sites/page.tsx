import Link from "next/link";
import { listAdminSites } from "@/lib/admin/sites";

export const dynamic = "force-dynamic";

export default async function AdminSitesPage() {
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

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sites</h1>
      <p className="mt-2 text-slate-600">
        Manage per-site settings, hero content, and section titles. Full site
        creation coming soon.
      </p>

      {loadError && (
        <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError} Start Postgres with <code>npm run db:up</code>, then{" "}
          <code>npm run db:migrate</code> and <code>npm run db:seed</code>.
        </p>
      )}

      {!loadError && sites.length === 0 && (
        <p className="mt-6 text-sm text-slate-600">
          No sites found. Run <code>npm run db:seed</code> if the database is
          empty.
        </p>
      )}

      {sites.length > 0 && (
        <ul className="mt-8 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {sites.map((site) => (
            <li
              key={site.id}
              className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-900">{site.title}</p>
                <p className="text-sm text-slate-500">
                  /{site.slug} ·{" "}
                  <span
                    className={
                      site.status === "published"
                        ? "text-green-700"
                        : "text-slate-500"
                    }
                  >
                    {site.status}
                  </span>
                </p>
              </div>
              <div className="flex gap-4">
                {site.status === "published" && (
                  <Link
                    href={`/${site.slug}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View site →
                  </Link>
                )}
                <Link
                  href={`/admin/sites/${site.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
