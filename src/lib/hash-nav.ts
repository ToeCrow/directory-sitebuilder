/** Scroll to an in-page section by id (without leading #). */
export function scrollToSectionId(sectionId: string): boolean {
  const el = document.getElementById(sectionId);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

/** Extract `#section` id from an href like `/side-sleeper#faq` or `#faq`. */
export function getHashSectionId(href: string): string | null {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return null;
  const id = href.slice(hashIndex + 1);
  return id || null;
}

export function isSiteHomePath(pathname: string, siteSlug: string): boolean {
  return (
    pathname === "/" ||
    pathname === `/${siteSlug}` ||
    pathname === `/${siteSlug}/`
  );
}
