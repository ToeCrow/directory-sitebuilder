"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import type { SiteSlug } from "@/data/sites";
import { usePublicBasePath } from "@/context/SiteContext";
import { getSiteData } from "@/lib/site";
import { getArticlePath } from "@/lib/paths";
import { cn } from "@/lib/cn";

type FAQProps = {
  siteSlug: SiteSlug;
  className?: string;
};

const MARKDOWN_LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

function resolveFaqHref(href: string, publicBasePath: string): string {
  const reviewMatch = href.match(/\/reviews\/([a-z0-9-]+)\/?$/i);
  if (reviewMatch) {
    return getArticlePath(publicBasePath, reviewMatch[1]);
  }
  return href;
}

function renderInlineWithLinks(
  text: string,
  publicBasePath: string,
): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  const re = new RegExp(MARKDOWN_LINK_RE);

  for (const match of text.matchAll(re)) {
    const full = match[0];
    const label = match[1];
    const href = match[2];
    const index = match.index ?? 0;

    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }
    nodes.push(
      <Link
        key={`${index}-${href}`}
        href={resolveFaqHref(href, publicBasePath)}
        className="font-medium text-blue-600 underline-offset-2 hover:underline"
      >
        {label}
      </Link>,
    );
    lastIndex = index + full.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

function FaqAnswerBody({
  answer,
  publicBasePath,
}: {
  answer: string;
  publicBasePath: string;
}) {
  const paragraphs = answer
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={index > 0 ? "mt-3" : undefined}>
          {renderInlineWithLinks(paragraph, publicBasePath)}
        </p>
      ))}
    </>
  );
}

export function FAQ({ siteSlug, className }: FAQProps) {
  const publicBasePath = usePublicBasePath();
  const siteData = getSiteData(siteSlug);

  return (
    <section
      id="faq"
      className={cn("scroll-mt-24 py-16 md:py-20", className)}
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl px-4">
        <h2
          id="faq-heading"
          className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl"
        >
          Frequently asked questions
        </h2>
        <dl className="mt-10 space-y-4">
          {siteData.faqs.map((item) => (
            <details
              key={item.question}
              className="group rounded-lg border border-slate-200 bg-white"
            >
              <summary className="cursor-pointer px-5 py-4 font-medium text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {item.question}
                  <span
                    className="text-slate-400 transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </span>
              </summary>
              <dd className="border-t border-slate-100 px-5 py-4 text-sm leading-relaxed text-slate-600">
                <FaqAnswerBody
                  answer={item.answer}
                  publicBasePath={publicBasePath}
                />
              </dd>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}
