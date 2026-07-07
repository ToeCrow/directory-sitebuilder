import type { SiteSlug } from "@/data/sites";
import { getSiteData } from "@/lib/site";
import { cn } from "@/lib/cn";

type FAQProps = {
  siteSlug: SiteSlug;
  className?: string;
};

export function FAQ({ siteSlug, className }: FAQProps) {
  const siteData = getSiteData(siteSlug);

  return (
    <section
      id="faq"
      className={cn("py-16 md:py-20", className)}
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
                {item.answer}
              </dd>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}
