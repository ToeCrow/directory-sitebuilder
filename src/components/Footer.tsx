"use client";

import Link from "next/link";
import { useSiteContext } from "@/context/SiteContext";
import { getSitePath } from "@/lib/paths";
import { siteHasMattressPillowNav } from "@/lib/site";
import { siteUsesEditorialCatalog } from "@/lib/directory-catalog";

function FooterNavLink({
  href,
  label,
  hoverClass,
}: {
  href: string;
  label: string;
  hoverClass: string;
}) {
  const isExternal =
    href.startsWith("mailto:") ||
    href.startsWith("http://") ||
    href.startsWith("https://");

  if (isExternal) {
    return (
      <a href={href} className={hoverClass}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={hoverClass}>
      {label}
    </Link>
  );
}

export function Footer() {
  const { siteSlug, siteData, publicBasePath } = useSiteContext();
  const year = new Date().getFullYear();
  const isSideSleeper = siteHasMattressPillowNav(siteSlug);
  const isEditorial = siteUsesEditorialCatalog(siteSlug);
  const hoverClass = isEditorial ? "hover:text-fwn-gold" : "hover:text-white";

  return (
    <footer
      className={
        isSideSleeper
          ? "mt-auto bg-ss-navy py-10 text-ss-mist/70"
          : isEditorial
            ? "mt-auto border-t border-fwn-gold/20 bg-fwn-void py-10 text-fwn-sand"
            : "mt-auto border-t border-slate-200 bg-slate-900 py-10 text-slate-400"
      }
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p
              className={
                isEditorial
                  ? "text-base font-semibold tracking-[0.08em] text-fwn-ivory"
                  : "text-base font-semibold text-white"
              }
            >
              {siteData.title}
            </p>
            {siteData.footer.tagline && (
              <p className="mt-1 text-sm">{siteData.footer.tagline}</p>
            )}
          </div>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-6 text-sm">
              {siteData.footer.links.map((link) => {
                const href = link.href.startsWith("/")
                  ? getSitePath(publicBasePath, link.href)
                  : link.href;

                return (
                  <li key={link.label}>
                    <FooterNavLink
                      href={href}
                      label={link.label}
                      hoverClass={hoverClass}
                    />
                  </li>
                );
              })}
              <li>
                <Link
                  href={getSitePath(publicBasePath)}
                  className={hoverClass}
                >
                  Home
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <p
          id="affiliate-disclosure"
          className={
            isEditorial
              ? "mt-8 border-t border-fwn-gold/15 pt-6 text-xs leading-relaxed text-fwn-sand/80"
              : "mt-8 border-t border-slate-800 pt-6 text-xs leading-relaxed"
          }
        >
          © {year} {siteData.title}. {siteData.affiliateDisclosure}
        </p>
      </div>
    </footer>
  );
}
