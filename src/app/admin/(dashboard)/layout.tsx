import Link from "next/link";
import { requireAdminUser } from "@/lib/admin/session";

const adminNav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/sites", label: "Sites" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/top-picks", label: "Top picks" },
  { href: "/admin/comparison", label: "Comparison" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/buying-guide", label: "Buying guide" },
  { href: "/admin/footer", label: "Footer" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/clicks", label: "Clicks" },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdminUser();

  return (
    <div className="flex min-h-full flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/admin" className="text-lg font-semibold text-slate-900">
            Admin
          </Link>
          <nav aria-label="Admin navigation">
            <ul className="flex flex-wrap items-center gap-4">
              {adminNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-slate-600 hover:text-blue-600"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/admin/settings"
                  className="text-sm font-medium text-slate-600 hover:text-blue-600"
                >
                  {user.displayName}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        {children}
      </main>
    </div>
  );
}
