type BestForSkipIfProps = {
  bestFor: string;
  skipIf: string;
};

export function BestForSkipIf({ bestFor, skipIf }: BestForSkipIfProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="border-l-[3px] border-ss-green bg-ss-green/10 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ss-ink">
          Best for
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ss-ink/85">{bestFor}</p>
      </div>
      <div className="border-l-[3px] border-ss-terracotta bg-ss-terracotta/10 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ss-ink">
          Skip if
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ss-ink/85">{skipIf}</p>
      </div>
    </div>
  );
}
