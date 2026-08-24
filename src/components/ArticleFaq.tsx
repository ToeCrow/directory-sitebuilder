import type { FAQ } from "@/types/site";

type ArticleFaqProps = {
  faqs: FAQ[];
};

export function ArticleFaq({ faqs }: ArticleFaqProps) {
  if (faqs.length === 0) {
    return null;
  }

  return (
    <section
      className="mt-16 border-t border-ss-navy/10 pt-12"
      aria-labelledby="article-faq-heading"
    >
      <h2
        id="article-faq-heading"
        className="text-2xl font-semibold tracking-tight text-ss-navy"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-6 divide-y divide-ss-navy/10 border-y border-ss-navy/10">
        {faqs.map((faq) => (
          <details key={faq.question} className="group py-4">
            <summary className="cursor-pointer list-none font-medium text-ss-navy marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-4">
                {faq.question}
                <span
                  className="mt-0.5 shrink-0 text-ss-blue transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ss-ink/80">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
