"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSiteContext } from "@/context/SiteContext";
import {
  getBlogIndexPath,
  getBuyingGuidePath,
  getProductPath,
  getProductsIndexPath,
  getReviewsIndexPath,
  getSitePath,
} from "@/lib/paths";
import { getDirectoryCategories } from "@/lib/directory-catalog";
import {
  getFeaturedProducts,
  siteHasMattressPillowNav,
} from "@/lib/site";
import { HashNavLink } from "@/components/HashNavLink";
import { getHashSectionId } from "@/lib/hash-nav";

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
  const editorialCategories = getDirectoryCategories(siteSlug);
  const isEditorialCatalog = editorialCategories.length > 0;
  const showMattressProductsNav = siteHasMattressPillowNav(siteSlug);
  const showProductsNav = showMattressProductsNav || isEditorialCatalog;
  const featuredReviews = showMattressProductsNav
    ? getFeaturedProducts(siteSlug).slice(0, 3)
    : [];
  const showReviewsNav = !isEditorialCatalog && siteData.articles.length > 0;

  const buyingGuideHref = getBuyingGuidePath(publicBasePath);
  const primaryLinks = isEditorialCatalog
    ? [{ href: getBlogIndexPath(publicBasePath), label: "Blog" }]
    : showMattressProductsNav
      ? [
          { href: buyingGuideHref, label: "Buying Guide" },
          { href: `${homeHref}#faq`, label: "FAQ" },
        ]
      : [
          { href: `${homeHref}#compare`, label: "Compare" },
          { href: buyingGuideHref, label: "Buying Guide" },
          { href: `${homeHref}#faq`, label: "FAQ" },
        ];

  function closeMenu() {
    setMenuOpen(false);
    setMobileReviewsOpen(false);
    setMobileProductsOpen(false);
  }

  const productsMenu = isEditorialCatalog
    ? [
        { href: getProductsIndexPath(publicBasePath), label: "All Products" },
        ...editorialCategories.map((category) => ({
          href: getProductsIndexPath(publicBasePath, category.slug),
          label: category.name,
        })),
      ]
    : [
        { href: getProductsIndexPath(publicBasePath), label: "All Products" },
        {
          href: getProductsIndexPath(publicBasePath, "mattress"),
          label: "Mattresses",
        },
        {
          href: getProductsIndexPath(publicBasePath, "pillow"),
          label: "Pillows",
        },
        {
          href: getProductsIndexPath(publicBasePath, "topper"),
          label: "Toppers",
        },
      ];

  const reviewsMenu = showMattressProductsNav
    ? [
        {
          href: getReviewsIndexPath(publicBasePath),
          label: "All reviews",
        },
        {
          href: getReviewsIndexPath(publicBasePath, "mattress"),
          label: "Mattress reviews",
        },
        {
          href: getReviewsIndexPath(publicBasePath, "pillow"),
          label: "Pillow reviews",
        },
        {
          href: getReviewsIndexPath(publicBasePath, "science"),
          label: "Science of sleep",
        },
      ]
    : [{ href: getReviewsIndexPath(publicBasePath), label: "All reviews" }];

  const navLinkClass = showMattressProductsNav
    ? "text-sm font-medium text-ss-navy/75 transition-colors hover:text-ss-blue group-hover:text-ss-blue group-focus-within:text-ss-blue"
    : isEditorialCatalog
      ? "text-sm font-medium tracking-wide text-fwn-sand transition-colors hover:text-fwn-gold group-hover:text-fwn-gold group-focus-within:text-fwn-gold"
      : "text-sm font-medium text-slate-600 transition-colors hover:text-blue-600 group-hover:text-blue-600 group-focus-within:text-blue-600";
  const dropdownPanelClass = showMattressProductsNav
    ? "min-w-64 border border-ss-navy/10 bg-ss-paper py-2 shadow-lg"
    : isEditorialCatalog
      ? "min-w-64 border border-fwn-gold/20 bg-fwn-panel py-2 shadow-lg"
      : "min-w-64 rounded-lg border border-slate-200 bg-white py-2 shadow-lg";
  const dropdownItemClass = showMattressProductsNav
    ? "block px-4 py-2.5 text-sm text-ss-ink transition-colors hover:bg-ss-mist hover:text-ss-navy"
    : isEditorialCatalog
      ? "block px-4 py-2.5 text-sm text-fwn-ivory transition-colors hover:bg-fwn-gold/10 hover:text-fwn-gold"
      : "block px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-600";
  const mobileItemClass = showMattressProductsNav
    ? "flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium text-ss-navy transition-colors hover:bg-ss-mist hover:text-ss-blue"
    : isEditorialCatalog
      ? "flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium text-fwn-ivory transition-colors hover:bg-fwn-gold/10 hover:text-fwn-gold"
      : "flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-600";
  const mobileLinkClass = showMattressProductsNav
    ? "block rounded-lg px-3 py-3 text-sm font-medium text-ss-navy transition-colors hover:bg-ss-mist hover:text-ss-blue"
    : isEditorialCatalog
      ? "block rounded-lg px-3 py-3 text-sm font-medium text-fwn-ivory transition-colors hover:bg-fwn-gold/10 hover:text-fwn-gold"
      : "block rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-600";
  const mobileSubLinkClass = showMattressProductsNav
    ? "block rounded-lg px-3 py-2.5 text-sm text-ss-ink/80 transition-colors hover:bg-ss-mist hover:text-ss-navy"
    : isEditorialCatalog
      ? "block rounded-lg px-3 py-2.5 text-sm text-fwn-sand transition-colors hover:bg-fwn-gold/10 hover:text-fwn-gold"
      : "block rounded-lg px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600";

  return (
    <header
      className={
        showMattressProductsNav
          ? "sticky top-0 z-50 border-b border-ss-navy/10 bg-ss-paper/90 backdrop-blur-sm"
          : isEditorialCatalog
            ? "sticky top-0 z-50 border-b border-fwn-gold/20 bg-fwn-void/90 backdrop-blur-sm"
            : "sticky top-0 z-50 border-b border-slate-200 bg-white"
      }
    >
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
              width={468}
              height={80}
              priority
              className="h-9 w-auto max-w-[min(100%,280px)] bg-transparent object-contain object-left sm:h-10 sm:max-w-[320px] md:h-11 md:max-w-[380px]"
            />
          ) : (
            <span
              className={
                showMattressProductsNav
                  ? "block truncate text-lg font-semibold text-ss-navy"
                  : isEditorialCatalog
                    ? "block truncate text-lg font-semibold tracking-[0.08em] text-fwn-ivory"
                    : "block truncate text-lg font-semibold text-slate-900"
              }
            >
              {siteData.title}
            </span>
          )}
        </Link>

        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {showProductsNav && (
              <li className="group relative">
                <button
                  type="button"
                  className={`inline-flex items-center gap-1 ${navLinkClass}`}
                  aria-haspopup="true"
                >
                  Products
                  <ChevronIcon />
                </button>
                <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div
                    role="menu"
                    aria-label="Products"
                    className={dropdownPanelClass}
                  >
                    <ul>
                      {productsMenu.map((item) => (
                        <li key={item.href} role="none">
                          <Link
                            role="menuitem"
                            href={item.href}
                            className={dropdownItemClass}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {featuredReviews.length > 0 && (
                      <>
                        <p
                          className={
                            showMattressProductsNav
                              ? "mt-1 border-t border-ss-navy/10 px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-ss-navy/45"
                              : isEditorialCatalog
                                ? "mt-1 border-t border-fwn-gold/15 px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-fwn-gold/70"
                                : "mt-1 border-t border-slate-100 px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-slate-400"
                          }
                        >
                          Featured Reviews
                        </p>
                        <ul>
                          {featuredReviews.map((product) => (
                            <li key={product.slug} role="none">
                              <Link
                                role="menuitem"
                                href={getProductPath(publicBasePath, product.slug)}
                                className={dropdownItemClass}
                              >
                                {product.name}
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

            {primaryLinks.map((link) => (
              <li key={link.href}>
                {getHashSectionId(link.href) ? (
                  <HashNavLink
                    href={link.href}
                    siteSlug={siteSlug}
                    className={navLinkClass}
                  >
                    {link.label}
                  </HashNavLink>
                ) : (
                  <Link
                    href={link.href}
                    className={navLinkClass}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}

            {showReviewsNav && (
              <li className="group relative">
                <button
                  type="button"
                  className={`inline-flex items-center gap-1 ${navLinkClass}`}
                  aria-haspopup="true"
                >
                  Reviews
                  <ChevronIcon />
                </button>
                <div className="invisible absolute right-0 top-full z-50 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <ul
                    role="menu"
                    aria-label="Reviews"
                    className={dropdownPanelClass}
                  >
                    {reviewsMenu.map((item) => (
                      <li key={item.href} role="none">
                        <Link
                          role="menuitem"
                          href={item.href}
                          className={dropdownItemClass}
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
          className={
            showMattressProductsNav
              ? "inline-flex items-center justify-center rounded-lg p-2 text-ss-navy transition-colors hover:bg-ss-mist md:hidden"
              : isEditorialCatalog
                ? "inline-flex items-center justify-center rounded-lg p-2 text-fwn-ivory transition-colors hover:bg-fwn-gold/10 hover:text-fwn-gold md:hidden"
                : "inline-flex items-center justify-center rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 md:hidden"
          }
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
          className={
            showMattressProductsNav
              ? "border-t border-ss-navy/10 md:hidden"
              : isEditorialCatalog
                ? "border-t border-fwn-gold/15 md:hidden"
                : "border-t border-slate-200 md:hidden"
          }
        >
          <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {showProductsNav && (
              <li>
                <button
                  type="button"
                  className={mobileItemClass}
                  aria-expanded={mobileProductsOpen}
                  onClick={() => setMobileProductsOpen((open) => !open)}
                >
                  Products
                  <ChevronIcon open={mobileProductsOpen} />
                </button>
                {mobileProductsOpen && (
                  <ul
                    className={
                      showMattressProductsNav
                        ? "mb-2 ml-2 border-l border-ss-navy/15 pl-2"
                        : isEditorialCatalog
                          ? "mb-2 ml-2 border-l border-fwn-gold/20 pl-2"
                          : "mb-2 ml-2 border-l border-slate-200 pl-2"
                    }
                  >
                    {productsMenu.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={mobileSubLinkClass}
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

            {primaryLinks.map((link) => (
              <li key={link.href}>
                {getHashSectionId(link.href) ? (
                  <HashNavLink
                    href={link.href}
                    siteSlug={siteSlug}
                    className={mobileLinkClass}
                    onNavigate={closeMenu}
                  >
                    {link.label}
                  </HashNavLink>
                ) : (
                  <Link
                    href={link.href}
                    className={mobileLinkClass}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}

            {showReviewsNav && (
              <li>
                <button
                  type="button"
                  className={mobileItemClass}
                  aria-expanded={mobileReviewsOpen}
                  onClick={() => setMobileReviewsOpen((open) => !open)}
                >
                  Reviews
                  <ChevronIcon open={mobileReviewsOpen} />
                </button>
                {mobileReviewsOpen && (
                  <ul
                    className={
                      showMattressProductsNav
                        ? "mb-2 ml-2 border-l border-ss-navy/15 pl-2"
                        : isEditorialCatalog
                          ? "mb-2 ml-2 border-l border-fwn-gold/20 pl-2"
                          : "mb-2 ml-2 border-l border-slate-200 pl-2"
                    }
                  >
                    {reviewsMenu.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={mobileSubLinkClass}
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
