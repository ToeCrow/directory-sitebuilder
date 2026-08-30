import Link from "next/link";
import { requireAdminUser } from "@/lib/admin/session";
import { listAdminSites } from "@/lib/admin/sites";
import { getBuyingGuideTitle, listBuyingGuideSections } from "@/lib/admin/buying-guide";
import { BuyingGuideManager } from "./BuyingGuideManager";

export const dynamic = "force-dynamic";

type BuyingGuidePageProps = {
  searchParams: Promise<{ site?: string }>;
};

export default async function AdminBuyingGuidePage({
  searchParams,
}: BuyingGuidePageProps) {
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

  let title = "";
  let sections: Awaited<ReturnType<typeof listBuyingGuideSections>> = [];

  if (activeSite && !loadError) {
    try {
      [title, sections] = await Promise.all([
        getBuyingGuideTitle(activeSite.id),
        listBuyingGuideSections(activeSite.id),
      ]);
    } catch (error) {
      loadError =
        error instanceof Error
          ? error.message
          : "Could not load buying guide data from the database.";
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Buying guide
      </h1>
      <p className="mt-2 text-slate-600">
        Manage the buying guide title and sections per site.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {sites.map((site) => (
          <Link
            key={site.id}
            href={`/admin/buying-guide?site=${site.slug}`}
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
          <BuyingGuideManager
            siteId={activeSite.id}
            title={title}
            sections={sections}
          />
        </div>
      )}
    </div>
  );
}
