"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSiteContext } from "@/context/SiteContext";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      {open ? (
        <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
      ) : (
        <>
          <path strokeLinecap="round" d="M4 7h16" />
          <path strokeLinecap="round" d="M4 12h16" />
          <path strokeLinecap="round" d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

function ChevronIcon({ open }: { open?: boolean }) {
  return (
    <svg
      className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function Header() {
  const { siteSlug, siteData } = useSiteContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileArticlesOpen, setMobileArticlesOpen] = useState(false);

  const homeHref = `/${siteSlug}`;
  const primaryLinks = [
    { href: `${homeHref}#compare`, label: "Compare" },
    { href: `${homeHref}#buying-guide`, label: "Buying Guide" },
    { href: `${homeHref}#faq`, label: "FAQ" },
  ];
  const newsletterLink = {
    href: `${homeHref}#newsletter`,
    label: "Newsletter",
  };
  const articles = siteData.articles;

  function closeMenu() {
    setMenuOpen(false);
    setMobileArticlesOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:py-4">
        <Link
          href={homeHref}
          className="min-w-0 shrink"
          aria-label={siteData.title}
        >
          {siteData.headerBrandImage ? (
            <Image
              src={siteData.headerBrandImage}
              alt={siteData.title}
              width={540}
              height={105}
              priority
              className="h-9 w-auto max-w-[min(100%,280px)] object-contain object-left sm:h-10 sm:max-w-[320px] md:h-11 md:max-w-[380px]"
            />
          ) : (
            <span className="block truncate text-lg font-semibold text-slate-900">
              {siteData.title}
            </span>
          )}
        </Link>

        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {primaryLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {articles.length > 0 && (
              <li className="group relative">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-blue-600 group-hover:text-blue-600 group-focus-within:text-blue-600"
                  aria-haspopup="true"
                >
                  Articles
                  <ChevronIcon />
                </button>
                <div className="invisible absolute right-0 top-full z-50 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <ul
                    role="menu"
                    aria-label="Articles"
                    className="min-w-64 rounded-lg border border-slate-200 bg-white py-2 shadow-lg"
                  >
                    {articles.map((article) => (
                      <li key={article.slug} role="none">
                        <Link
                          role="menuitem"
                          href={`${homeHref}/articles/${article.slug}`}
                          className="block px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-600"
                        >
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            )}

            <li>
              <Link
                href={newsletterLink.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
              >
                {newsletterLink.label}
              </Link>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">
            {menuOpen ? "Close menu" : "Open menu"}
          </span>
          <MenuIcon open={menuOpen} />
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="border-t border-slate-200 md:hidden"
        >
          <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {primaryLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-600"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {articles.length > 0 && (
              <li>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-600"
                  aria-expanded={mobileArticlesOpen}
                  onClick={() => setMobileArticlesOpen((open) => !open)}
                >
                  Articles
                  <ChevronIcon open={mobileArticlesOpen} />
                </button>
                {mobileArticlesOpen && (
                  <ul className="mb-2 ml-2 border-l border-slate-200 pl-2">
                    {articles.map((article) => (
                      <li key={article.slug}>
                        <Link
                          href={`${homeHref}/articles/${article.slug}`}
                          className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600"
                          onClick={closeMenu}
                        >
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )}

            <li>
              <Link
                href={newsletterLink.href}
                className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-600"
                onClick={closeMenu}
              >
                {newsletterLink.label}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
