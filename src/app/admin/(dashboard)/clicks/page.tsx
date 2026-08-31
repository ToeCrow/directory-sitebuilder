import Link from "next/link";
import {
  formatClickedLinkLabel,
  listTopClickedLinks,
  TOP_CLICKED_LINKS_LIMIT,
  type AdminClickedLink,
} from "@/lib/admin/clicks";
import {
  CLICK_PERIODS,
  CLICK_VIEWS,
  clicksAdminHref,
  filterClickedLinks,
  formatClickSource,
  formatClickTarget,
  formatClickTargetDetail,
  getClickCategoryLabel,
  parseClickPeriod,
  parseClickView,
  sortClickedLinks,
  type ClickPeriod,
  type ClickView,
} from "@/lib/admin/click-categories";
import { requireAdminUser } from "@/lib/admin/session";
import { listAdminSites } from "@/lib/admin/sites";

export const dynamic = "force-dynamic";

type ClicksPageProps = {
  searchParams: Promise<{ site?: string; view?: string; period?: string }>;
};

export default async function AdminClicksPage({
  searchParams,
}: ClicksPageProps) {
  const params = await searchParams;
  const siteFilter = params.site || undefined;
  const view = parseClickView(params.view);
  const period = parseClickPeriod(params.period);
  const user = await requireAdminUser();
  let links: Awaited<ReturnType<typeof listTopClickedLinks>> = [];
  let sites: Awaited<ReturnType<typeof listAdminSites>> = [];
  let loadError: string | null = null;

  try {
    [links, sites] = await Promise.all([
      listTopClickedLinks(user, siteFilter),
      listAdminSites(user),
    ]);
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Could not load click totals from the database.";
  }

  const visible = sortClickedLinks(filterClickedLinks(links, view), period);
  const href = (next: { site?: string; view?: ClickView; period?: ClickPeriod }) =>
    clicksAdminHref({
      site: next.site !== undefined ? next.site || undefined : siteFilter,
      view: next.view ?? view,
      period: next.period ?? period,
    });

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Clicks
        </h1>
        <p className="mt-2 text-slate-600">
          Aggregated public link totals, grouped by what the click means.
          Commercial is the default. First click creates the row; there is no
          per-click event log.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {CLICK_VIEWS.map((item) => {
          const count =
            item === "all"
              ? links.length
              : filterClickedLinks(links, item).length;
          return (
            <FilterLink key={item} href={href({ view: item })} active={view === item}>
              {getClickCategoryLabel(item)}
              <span className="ml-1.5 tabular-nums opacity-70">{count}</span>
            </FilterLink>
          );
        })}
      </div>

      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Site
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <FilterLink href={href({ site: "" })} active={!siteFilter}>
            All
          </FilterLink>
          {sites.map((site) => (
            <FilterLink
              key={site.id}
              href={href({ site: site.slug })}
              active={siteFilter === site.slug}
            >
              {site.title}
            </FilterLink>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Period
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {CLICK_PERIODS.map((item) => (
            <FilterLink key={item} href={href({ period: item })} active={period === item}>
              {periodLabel(item)}
            </FilterLink>
          ))}
        </div>
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

      {!loadError && links.length > 0 && visible.length === 0 && (
        <p className="mt-6 text-sm text-slate-600">
          No {getClickCategoryLabel(view).toLowerCase()} clicks in the current
          result set.
        </p>
      )}

      {visible.length > 0 && (
        <ClicksTable
          links={visible}
          view={view}
          period={period}
          showSite={!siteFilter}
        />
      )}

      {links.length > 0 && (
        <p className="mt-4 text-xs text-slate-500">
          Based on the top {TOP_CLICKED_LINKS_LIMIT} links by all-time total.
          Categories and period sort are applied in this page, not in the
          database.
        </p>
      )}
    </div>
  );
}

function periodLabel(period: ClickPeriod): string {
  if (period === "7d") {
    return "7 days";
  }
  if (period === "30d") {
    return "30 days";
  }
  return "Total";
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
        active
          ? "bg-slate-900 text-white"
          : "bg-white text-slate-700 ring-1 ring-slate-200"
      }`}
    >
      {children}
    </Link>
  );
}

function ClicksTable({
  links,
  view,
  period,
  showSite,
}: {
  links: AdminClickedLink[];
  view: ClickView;
  period: ClickPeriod;
  showSite: boolean;
}) {
  return (
    <div className="mt-6 overflow-x-auto rounded-lg bg-white ring-1 ring-slate-200">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            {view === "all" || view === "navigation" ? (
              <th className="px-4 py-3 font-medium">Link</th>
            ) : view === "engagement" ? (
              <>
                <th className="px-4 py-3 font-medium">From</th>
                <th className="px-4 py-3 font-medium">To</th>
              </>
            ) : (
              <>
                <th className="px-4 py-3 font-medium">
                  {view === "commercial" ? "Product / Target" : "Product"}
                </th>
                <th className="px-4 py-3 font-medium">From</th>
              </>
            )}
            {view !== "all" && view !== "navigation" && (
              <th className="px-4 py-3 font-medium">Placement</th>
            )}
            {showSite && <th className="px-4 py-3 font-medium">Site</th>}
            <CountHeader period={period} id="7d">
              7d
            </CountHeader>
            <CountHeader period={period} id="30d">
              30d
            </CountHeader>
            <CountHeader period={period} id="total">
              Total
            </CountHeader>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link.id} className="border-b border-slate-100 last:border-0">
              {view === "all" || view === "navigation" ? (
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">
                    {formatClickedLinkLabel(link)}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {link.sourceType}
                    {link.sourcePath ? ` · ${link.sourcePath}` : ""}
                  </p>
                </td>
              ) : view === "engagement" ? (
                <>
                  <td className="px-4 py-3 text-slate-700">
                    {formatClickSource(link)}
                  </td>
                  <td className="px-4 py-3">
                    <ClickTargetCell link={link} />
                  </td>
                </>
              ) : (
                <>
                  <td className="px-4 py-3">
                    <ClickTargetCell link={link} />
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {formatClickSource(link)}
                  </td>
                </>
              )}
              {view !== "all" && view !== "navigation" && (
                <td className="px-4 py-3 text-slate-600">{link.placement}</td>
              )}
              {showSite && (
                <td className="px-4 py-3 text-slate-600">{link.siteTitle}</td>
              )}
              <CountCell period={period} id="7d" value={link.clicks7d} />
              <CountCell period={period} id="30d" value={link.clicks30d} />
              <CountCell period={period} id="total" value={link.totalClicks} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ClickTargetCell({ link }: { link: AdminClickedLink }) {
  const detail = formatClickTargetDetail(link);
  return (
    <>
      <p className="font-medium text-slate-900">{formatClickTarget(link)}</p>
      {detail && <p className="mt-0.5 text-xs text-slate-500">{detail}</p>}
    </>
  );
}

function CountHeader({
  period,
  id,
  children,
}: {
  period: ClickPeriod;
  id: ClickPeriod;
  children: React.ReactNode;
}) {
  return (
    <th
      className={`px-4 py-3 text-right font-medium ${
        period === id ? "text-slate-900" : ""
      }`}
    >
      {children}
    </th>
  );
}

function CountCell({
  period,
  id,
  value,
}: {
  period: ClickPeriod;
  id: ClickPeriod;
  value: number;
}) {
  const active = period === id;
  return (
    <td
      className={`px-4 py-3 text-right tabular-nums ${
        active ? "font-medium text-slate-900" : "text-slate-700"
      }`}
    >
      {value}
    </td>
  );
}
