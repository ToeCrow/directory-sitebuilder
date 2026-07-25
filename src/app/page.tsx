import Link from "next/link";
import { platformConfig } from "@/config/platform";
import { getAllSites } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function PlatformHomePage() {
  let sites: Awaited<ReturnType<typeof getAllSites>> = [];
  try {
    sites = await getAllSites();
  } catch {
    // DB optional on the platform hub (e.g. Postgres not running).
    sites = [];
  }

  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-4 py-16">
        <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
          Directory CMS platform
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          {platformConfig.name}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
          Build and manage SEO-friendly affiliate directory sites across
          multiple niches — products, FAQ, articles and more from one platform.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/admin"
            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Open admin
          </Link>
        </div>

        <section className="mt-16" aria-labelledby="sites-heading">
          <h2
            id="sites-heading"
            className="text-xl font-semibold text-slate-900"
          >
            Published directory sites
          </h2>
          {sites.length === 0 ? (
            <p className="mt-6 text-sm text-slate-600">
              No published sites loaded. Start Postgres (
              <code>npm run db:up</code>) and seed (
              <code>npm run db:seed</code>) if this list is empty.
            </p>
          ) : (
            <ul className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
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
          )}
        </section>
      </div>
    </main>
  );
}
