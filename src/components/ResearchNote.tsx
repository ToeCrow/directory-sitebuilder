import type { ReactNode } from "react";

type ResearchNoteProps = {
  title: string;
  children: ReactNode;
  headingLevel?: "h2" | "h3";
};

export function ResearchNote({
  title,
  children,
  headingLevel = "h2",
}: ResearchNoteProps) {
  const Heading = headingLevel;
  const headingId = `research-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

  return (
    <aside
      className="border-l-[3px] border-ss-teal bg-ss-teal/10 px-5 py-5"
      aria-labelledby={headingId}
    >
      <Heading
        id={headingId}
        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ss-navy"
      >
        <svg
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5 shrink-0 text-ss-teal"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M3.5 2.5h6.5v8.2c0 1.3-.8 2.3-2.2 2.3H5.7c-1.4 0-2.2-1-2.2-2.3V2.5Z" />
          <path d="M10 4.5h2.5v6.4c0 1.2-.7 2.1-2 2.1" />
          <path d="M5.5 5h3M5.5 7.5h3" strokeLinecap="round" />
        </svg>
        {title}
      </Heading>
      <div className="mt-3 text-sm leading-relaxed text-ss-ink/80">
        {children}
      </div>
    </aside>
  );
}
