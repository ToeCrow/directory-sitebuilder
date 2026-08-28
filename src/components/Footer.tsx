"use client";

import Link from "next/link";
import { useSiteContext } from "@/context/SiteContext";
import { getSitePath } from "@/lib/paths";
import { getSiteTheme } from "@/lib/site-config";
import { getThemeClasses } from "@/lib/site-theme";

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
  const theme = getThemeClasses(getSiteTheme(siteSlug));

  return (
    <footer className={theme.footer}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className={theme.footerTitle}>{siteData.title}</p>
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
                      hoverClass={theme.footerHover}
                    />
                  </li>
                );
              })}
              <li>
                <Link
                  href={getSitePath(publicBasePath)}
                  className={theme.footerHover}
                >
                  Home
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <p id="affiliate-disclosure" className={theme.footerDisclosure}>
          © {year} {siteData.title}. {siteData.affiliateDisclosure}
        </p>
      </div>
    </footer>
  );
}
