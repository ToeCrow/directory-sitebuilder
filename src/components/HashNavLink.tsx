"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import {
  getHashSectionId,
  isSiteHomePath,
  scrollToSectionId,
} from "@/lib/hash-nav";

type HashNavLinkProps = {
  href: string;
  siteSlug: string;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
};

/**
 * Link that scrolls to in-page anchors even when already on the home page
 * (Next.js soft navigation often skips same-route hash scrolling).
 */
export function HashNavLink({
  href,
  siteSlug,
  className,
  children,
  onNavigate,
}: HashNavLinkProps) {
  const pathname = usePathname();
  const sectionId = getHashSectionId(href);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!sectionId) {
      onNavigate?.();
      return;
    }

    if (!isSiteHomePath(pathname, siteSlug)) {
      onNavigate?.();
      return;
    }

    event.preventDefault();
    const scrolled = scrollToSectionId(sectionId);
    if (scrolled) {
      window.history.pushState(null, "", `#${sectionId}`);
    }
    onNavigate?.();
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
