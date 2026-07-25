import Link from "next/link";
import { listAdminSites } from "@/lib/admin/sites";
import { getFooterTagline, listFooterLinks } from "@/lib/admin/footer";
import { FooterManager } from "./FooterManager";

export const dynamic = "force-dynamic";

type FooterPageProps = {
  searchParams: Promise<{ site?: string }>;
};

export default async function AdminFooterPage({
  searchParams,
}: FooterPageProps) {
  const { site: siteSlug } = await searchParams;

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

  const activeSite =
    (siteSlug ? sites.find((s) => s.slug === siteSlug) : sites[0]) ?? null;

  let tagline = "";
  let links: Awaited<ReturnType<typeof listFooterLinks>> = [];

  if (activeSite && !loadError) {
    try {
      [tagline, links] = await Promise.all([
        getFooterTagline(activeSite.id),
        listFooterLinks(activeSite.id),
      ]);
    } catch (error) {
      loadError =
        error instanceof Error
          ? error.message
          : "Could not load footer data from the database.";
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Footer
      </h1>
      <p className="mt-2 text-slate-600">
        Manage the footer tagline and links per site.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {sites.map((site) => (
          <Link
            key={site.id}
            href={`/admin/footer?site=${site.slug}`}
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
          <FooterManager siteId={activeSite.id} tagline={tagline} links={links} />
        </div>
      )}
    </div>
  );
}
