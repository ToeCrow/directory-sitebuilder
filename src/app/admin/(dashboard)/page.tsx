import Link from "next/link";
import { siteIds, sites } from "@/config/sites";

const placeholderSections = [
  { href: "/admin/products", title: "Products", description: "Manage product listings across sites." },
  { href: "/admin/faq", title: "FAQ", description: "Edit FAQ entries per directory site." },
  { href: "/admin/settings", title: "Settings", description: "Platform and site configuration." },
];

export default function AdminDashboardPage() {
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
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {siteIds.map((siteSlug) => {
            const site = sites[siteSlug];
            return (
              <li
                key={siteSlug}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <p className="font-medium text-slate-900">{site.name}</p>
                <p className="mt-1 text-sm text-slate-500">/{siteSlug}</p>
                <Link
                  href={`/${siteSlug}`}
                  className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View public site →
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="sections-heading">
        <h2 id="sections-heading" className="text-xl font-semibold text-slate-900">
          Content management
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {placeholderSections.map((section) => (
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
