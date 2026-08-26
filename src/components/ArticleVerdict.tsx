import type { ArticleClosingGuide } from "@/types/site";

type ArticleVerdictProps = {
  guide: ArticleClosingGuide;
};

export function ArticleVerdict({ guide }: ArticleVerdictProps) {
  return (
    <section
      className="mt-16 bg-ss-navy px-6 py-10 text-ss-paper sm:px-8 sm:py-12"
      aria-labelledby="article-verdict-heading"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ss-mist/80">
        Conclusion
      </p>
      <h2
        id="article-verdict-heading"
        className="mt-3 text-2xl font-semibold tracking-tight text-ss-paper md:text-3xl"
      >
        {guide.title}
      </h2>
      <ul className="mt-6 space-y-3">
        {guide.items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-base leading-relaxed text-ss-mist md:text-lg"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ss-blue" />
            {item}
          </li>
        ))}
      </ul>
      {guide.closing && (
        <p className="mt-8 text-lg leading-relaxed text-ss-paper/90 md:text-xl">
          {guide.closing}
        </p>
      )}
      {guide.pricingNote && (
        <p className="mt-4 text-sm leading-relaxed text-ss-mist/75">
          {guide.pricingNote}
        </p>
      )}
    </section>
  );
}
