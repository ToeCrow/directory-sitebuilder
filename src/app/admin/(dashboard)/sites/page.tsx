import Link from "next/link";
import { getAllSites } from "@/data/sites";

export default function AdminSitesPage() {
  const sites = getAllSites();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sites</h1>
      <p className="mt-2 text-slate-600">
        Manage directory sites. Full site creation coming soon.
      </p>
      <ul className="mt-8 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {sites.map((site) => (
          <li
            key={site.slug}
            className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-slate-900">{site.title}</p>
              <p className="text-sm text-slate-500">/{site.slug}</p>
            </div>
            <Link
              href={`/${site.slug}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View site →
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-slate-500">
        Coming soon: create new sites from admin without touching code.
      </p>
    </div>
  );
}
