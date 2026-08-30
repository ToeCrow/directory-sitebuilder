"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSiteContext } from "@/context/SiteContext";
import { getSitePath } from "@/lib/paths";
import { getDirectoryCategories } from "@/lib/directory-catalog";
import { featuredProductsFrom } from "@/lib/site-view";
import { HashNavLink } from "@/components/HashNavLink";
import { TrackedLink } from "@/components/TrackedLink";
import { getHashSectionId } from "@/lib/hash-nav";
import { getSiteTheme } from "@/lib/site-config";
import { getSiteNavigation } from "@/lib/site-navigation";
import { getThemeClasses } from "@/lib/site-theme";

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
  const { siteSlug, siteData, publicBasePath } = useSiteContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileReviewsOpen, setMobileReviewsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  const homeHref = getSitePath(publicBasePath);
  const theme = getThemeClasses(getSiteTheme(siteSlug));
  const nav = getSiteNavigation({
    site: siteSlug,
    publicBasePath,
    hasArticles: siteData.articles.length > 0,
    catalogCategories: getDirectoryCategories(siteSlug).map((category) => ({
      slug: category.slug,
      name: category.name,
    })),
    featuredProducts: featuredProductsFrom(siteData).slice(0, 3),
  });
  const productsNav = nav.products;
  const articlesNav = nav.articles;

  function closeMenu() {
    setMenuOpen(false);
    setMobileReviewsOpen(false);
    setMobileProductsOpen(false);
  }

  return (
    <header className={theme.header}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:py-4">
        <TrackedLink
          href={homeHref}
          placement="header-home"
          source={{ type: "nav", path: "" }}
          target={{ type: "path" }}
          label={siteData.title}
          className="min-w-0 shrink"
          aria-label={siteData.title}
        >
          {siteData.headerBrandImage ? (
            <Image
              src={siteData.headerBrandImage}
              alt={siteData.title}
              width={468}
              height={80}
              priority
              className="h-9 w-auto max-w-[min(100%,280px)] bg-transparent object-contain object-left sm:h-10 sm:max-w-[320px] md:h-11 md:max-w-95"
            />
          ) : (
            <span className={theme.headerBrand}>{siteData.title}</span>
          )}
        </TrackedLink>

        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {productsNav && (
              <li className="group relative">
                <button
                  type="button"
                  className={`inline-flex items-center gap-1 ${theme.navLink}`}
                  aria-haspopup="true"
                >
                  {productsNav.label}
                  <ChevronIcon />
                </button>
                <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div
                    role="menu"
                    aria-label={productsNav.label}
                    className={theme.dropdownPanel}
                  >
                    <ul>
                      {productsNav.children.map((item) => (
                        <li key={item.href} role="none">
                          <Link
                            role="menuitem"
                            href={item.href}
                            className={theme.dropdownItem}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {productsNav.featuredProducts.length > 0 && (
                      <>
                        <p className={theme.dropdownSectionLabel}>
                          Featured Reviews
                        </p>
                        <ul>
                          {productsNav.featuredProducts.map((product) => (
                            <li key={product.href} role="none">
                              <Link
                                role="menuitem"
                                href={product.href}
                                className={theme.dropdownItem}
                              >
                                {product.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </li>
            )}

            {nav.primaryLinks.map((link) => (
              <li key={link.href}>
                {getHashSectionId(link.href) ? (
                  <HashNavLink
                    href={link.href}
                    siteSlug={siteSlug}
                    className={theme.navLink}
                  >
                    {link.label}
                  </HashNavLink>
                ) : (
                  <TrackedLink
                    href={link.href}
                    placement="header-nav"
                    source={{ type: "nav", path: "" }}
                    target={{ type: "path" }}
                    label={link.label}
                    className={theme.navLink}
                  >
                    {link.label}
                  </TrackedLink>
                )}
              </li>
            ))}

            {articlesNav?.children && (
              <li className="group relative">
                <button
                  type="button"
                  className={`inline-flex items-center gap-1 ${theme.navLink}`}
                  aria-haspopup="true"
                >
                  {articlesNav.label}
                  <ChevronIcon />
                </button>
                <div className="invisible absolute right-0 top-full z-50 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <ul
                    role="menu"
                    aria-label={articlesNav.label}
                    className={theme.dropdownPanel}
                  >
                    {articlesNav.children.map((item) => (
                      <li key={item.href} role="none">
                        <Link
                          role="menuitem"
                          href={item.href}
                          className={theme.dropdownItem}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            )}
          </ul>
        </nav>

        <button
          type="button"
          className={theme.menuButton}
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
          className={theme.mobileBorder}
        >
          <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {productsNav && (
              <li>
                <button
                  type="button"
                  className={theme.mobileItem}
                  aria-expanded={mobileProductsOpen}
                  onClick={() => setMobileProductsOpen((open) => !open)}
                >
                  {productsNav.label}
                  <ChevronIcon open={mobileProductsOpen} />
                </button>
                {mobileProductsOpen && (
                  <ul className={theme.mobileSubBorder}>
                    {productsNav.children.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={theme.mobileSubLink}
                          onClick={closeMenu}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )}

            {nav.primaryLinks.map((link) => (
              <li key={link.href}>
                {getHashSectionId(link.href) ? (
                  <HashNavLink
                    href={link.href}
                    siteSlug={siteSlug}
                    className={theme.mobileLink}
                    onNavigate={closeMenu}
                  >
                    {link.label}
                  </HashNavLink>
                ) : (
                  <TrackedLink
                    href={link.href}
                    placement="header-nav"
                    source={{ type: "nav", path: "" }}
                    target={{ type: "path" }}
                    label={link.label}
                    className={theme.mobileLink}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </TrackedLink>
                )}
              </li>
            ))}

            {articlesNav?.children && (
              <li>
                <button
                  type="button"
                  className={theme.mobileItem}
                  aria-expanded={mobileReviewsOpen}
                  onClick={() => setMobileReviewsOpen((open) => !open)}
                >
                  {articlesNav.label}
                  <ChevronIcon open={mobileReviewsOpen} />
                </button>
                {mobileReviewsOpen && (
                  <ul className={theme.mobileSubBorder}>
                    {articlesNav.children.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={theme.mobileSubLink}
                          onClick={closeMenu}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
