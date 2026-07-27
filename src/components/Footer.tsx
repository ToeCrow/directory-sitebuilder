"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiteContext } from "@/context/SiteContext";
import { PrivacyCookieSettingsButton } from "@/components/PrivacyCookieSettingsButton";
import {
  RESEARCH_SCORE_LABEL,
  getResearchScorePath,
  siteUsesResearchScore,
} from "@/lib/research-score";
import { isPrivacyPolicyPath } from "@/lib/privacy-policy";
import { getSitePath } from "@/lib/paths";

const PRIVACY_COOKIE_SETTINGS_LABEL = "Privacy and cookie settings";

function FooterNavLink({ href, label }: { href: string; label: string }) {
  const isExternal =
    href.startsWith("mailto:") ||
    href.startsWith("http://") ||
    href.startsWith("https://");

  if (isExternal) {
    return (
      <a href={href} className="hover:text-white">
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className="hover:text-white">
      {label}
    </Link>
  );
}

export function Footer() {
  const { siteSlug, siteData } = useSiteContext();
  const pathname = usePathname();
  const year = new Date().getFullYear();
  const hidePrivacyCookieSettings = isPrivacyPolicyPath(pathname);

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-900 py-10 text-slate-400">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-base font-semibold text-white">
              {siteData.title}
            </p>
            {siteData.footer.tagline && (
              <p className="mt-1 text-sm">{siteData.footer.tagline}</p>
            )}
          </div>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-6 text-sm">
              {siteData.footer.links.map((link) => {
                if (link.label === PRIVACY_COOKIE_SETTINGS_LABEL) {
                  if (hidePrivacyCookieSettings) {
                    return null;
                  }

                  return (
                    <li key={link.label}>
                      <PrivacyCookieSettingsButton label={link.label} />
                    </li>
                  );
                }

                const href =
                  link.label === RESEARCH_SCORE_LABEL &&
                  siteUsesResearchScore(siteSlug)
                    ? getResearchScorePath(siteSlug)
                    : link.href.startsWith("/")
                      ? getSitePath(siteSlug, link.href)
                      : link.href;

                return (
                  <li key={link.label}>
                    <FooterNavLink href={href} label={link.label} />
                  </li>
                );
              })}
              <li>
                <Link href={getSitePath(siteSlug)} className="hover:text-white">
                  Home
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <p
          id="affiliate-disclosure"
          className="mt-8 border-t border-slate-800 pt-6 text-xs leading-relaxed"
        >
          © {year} {siteData.title}. {siteData.affiliateDisclosure}
        </p>
      </div>
    </footer>
  );
}
