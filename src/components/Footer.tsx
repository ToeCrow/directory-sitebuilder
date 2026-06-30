"use client";

import Link from "next/link";
import { useSiteContext } from "@/context/SiteContext";

export function Footer() {
  const { siteSlug, siteConfig } = useSiteContext();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-900 py-10 text-slate-400">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-base font-semibold text-white">
              {siteConfig.name}
            </p>
            <p className="mt-1 text-sm">
              Independent software comparisons for contractors.
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-6 text-sm">
              <li>
                <a href="#compare" className="hover:text-white">
                  Compare
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#newsletter" className="hover:text-white">
                  Newsletter
                </a>
              </li>
              <li>
                <Link href={`/${siteSlug}`} className="hover:text-white">
                  Home
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <p className="mt-8 border-t border-slate-800 pt-6 text-xs leading-relaxed">
          © {year} {siteConfig.name}. {siteConfig.affiliateDisclosure}
        </p>
      </div>
    </footer>
  );
}
