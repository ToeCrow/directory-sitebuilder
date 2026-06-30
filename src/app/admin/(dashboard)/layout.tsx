import Link from "next/link";

const adminNav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/sites", label: "Sites" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/admin" className="text-lg font-semibold text-slate-900">
            Admin
          </Link>
          <nav aria-label="Admin navigation">
            <ul className="flex flex-wrap gap-4">
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
