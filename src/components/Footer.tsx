"use client";

import Link from "next/link";
import { useSiteContext } from "@/context/SiteContext";

export function Footer() {
  const { siteSlug, siteData } = useSiteContext();
  const year = new Date().getFullYear();

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
              {siteData.footer.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link href={`/${siteSlug}`} className="hover:text-white">
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
        {/* Temporary: remove after Impact verifies ownership */}
        {siteSlug === "side-sleeper" && (
          <p className="mt-4 text-xs text-slate-600">
            Impact-Site-Verification: 55f30b2b-1340-482b-8e3b-1c531ba4b4ef
          </p>
        )}
      </div>
    </footer>
  );
}
