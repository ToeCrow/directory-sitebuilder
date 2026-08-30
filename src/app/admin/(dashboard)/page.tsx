import Link from "next/link";
import { requireAdminUser } from "@/lib/admin/session";
import { listAdminSites } from "@/lib/admin/sites";

export const dynamic = "force-dynamic";

const contentSections = [
  {
    href: "/admin/products",
    title: "Products",
    description: "Manage product listings and affiliate flags.",
  },
  {
    href: "/admin/top-picks",
    title: "Top picks",
    description: "Feature published products and control sort order.",
  },
  {
    href: "/admin/comparison",
    title: "Comparison",
    description: "Edit the comparison table title and rows.",
  },
  {
    href: "/admin/faq",
    title: "FAQ",
    description: "Edit FAQ entries per directory site.",
  },
  {
    href: "/admin/buying-guide",
    title: "Buying guide",
    description: "Manage buying guide title and sections.",
  },
  {
    href: "/admin/footer",
    title: "Footer",
    description: "Edit footer tagline and links.",
  },
  {
    href: "/admin/articles",
    title: "Articles",
    description: "Write and publish long-form articles.",
  },
  {
    href: "/admin/clicks",
    title: "Clicks",
    description: "See which public links get clicks.",
  },
];

export default async function AdminDashboardPage() {
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

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Dashboard
      </h1>
      <p className="mt-2 text-slate-600">
        Manage your directory sites from one place.
      </p>

      <section className="mt-10" aria-labelledby="sites-heading">
        <div className="flex items-center justify-between gap-4">
          <h2 id="sites-heading" className="text-xl font-semibold text-slate-900">
            Sites
          </h2>
          <Link
            href="/admin/sites"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Manage sites
          </Link>
        </div>

        {loadError && (
          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {loadError} Start Postgres with <code>npm run db:up</code>, then{" "}
            <code>npm run db:migrate</code> and <code>npm run db:seed</code>.
          </p>
        )}

        {!loadError && (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {sites.map((site) => (
              <li
                key={site.id}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <p className="font-medium text-slate-900">{site.title}</p>
                <p className="mt-1 text-sm text-slate-500">
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
                <div className="mt-4 flex gap-4">
                  {site.status === "published" && (
                    <Link
                      href={`/${site.slug}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      View public site →
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
      </section>

      <section className="mt-10" aria-labelledby="sections-heading">
        <h2 id="sections-heading" className="text-xl font-semibold text-slate-900">
          Content management
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {contentSections.map((section) => (
            <li key={section.href}>
              <Link
                href={section.href}
                className="block rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm"
              >
                <p className="font-medium text-slate-900">{section.title}</p>
                <p className="mt-2 text-sm text-slate-600">
                  {section.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
