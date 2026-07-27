"use client";

import type { MouseEvent, ReactNode } from "react";
import { getHashSectionId, scrollToSectionId } from "@/lib/hash-nav";

type InPageHashAnchorProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

/**
 * Anchor that scrolls to an in-page hash even when the URL hash is already set.
 */
export function InPageHashAnchor({
  href,
  className,
  children,
}: InPageHashAnchorProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const sectionId = getHashSectionId(href);
    if (!sectionId || !href.startsWith("#")) return;
    event.preventDefault();
    if (scrollToSectionId(sectionId)) {
      window.history.pushState(null, "", `#${sectionId}`);
    }
  }

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
