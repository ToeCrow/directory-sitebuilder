"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { useSiteSlug } from "@/context/SiteContext";
import { useTrackingSource } from "@/context/TrackingSourceContext";
import { isTrackableClick } from "@/lib/click-tracking";
import { cn } from "@/lib/cn";

export type TrackedTarget = {
  type: string;
  id?: string;
};

export type TrackedSource = {
  type: string;
  id?: string;
  path?: string;
};

type TrackedLinkProps = {
  href: string;
  placement: string;
  children: ReactNode;
  className?: string;
  target?: TrackedTarget;
  source?: TrackedSource;
  label?: string;
  external?: boolean;
  rel?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  "aria-label"?: string;
};

function sendClick(payload: Record<string, unknown>) {
  try {
    void fetch("/api/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Navigation must not depend on analytics.
  }
}

export function TrackedLink({
  href,
  placement,
  children,
  className,
  target,
  source,
  label,
  external = false,
  rel,
  onClick,
  "aria-label": ariaLabel,
}: TrackedLinkProps) {
  const siteSlug = useSiteSlug();
  const pathname = usePathname();
  const contextSource = useTrackingSource();
  const sourceType = source?.type ?? contextSource?.type ?? "page";
  const sourceId = source?.id ?? contextSource?.id;
  const sourcePath = source?.path ?? contextSource?.path ?? pathname;
  const isHttpExternal = /^https?:\/\//.test(href);
  const isMailto = href.startsWith("mailto:");
  const useAnchor = external || isHttpExternal || isMailto;
  const openInNewTab = external || isHttpExternal;

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (isTrackableClick(event)) {
      sendClick({
        siteSlug,
        sourceType,
        sourceId: sourceId ?? null,
        sourcePath: sourcePath || null,
        placement,
        targetType: target?.type ?? (useAnchor ? "external" : "path"),
        targetId: target?.id ?? null,
        targetUrl: href,
        label: label ?? (typeof children === "string" ? children : null),
      });
    }
    onClick?.(event);
  }

  const classNames = cn(className);

  if (useAnchor) {
    return (
      <a
        href={href}
        className={classNames}
        onClick={handleClick}
        aria-label={ariaLabel}
        {...(openInNewTab
          ? { target: "_blank", rel: rel ?? "noopener noreferrer" }
          : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={classNames}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}
