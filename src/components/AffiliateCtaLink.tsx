import { TrackedLink, type TrackedSource, type TrackedTarget } from "@/components/TrackedLink";
import { cn } from "@/lib/cn";

type AffiliateCtaLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  placement?: string;
  target?: TrackedTarget;
  source?: TrackedSource;
  label?: string;
};

const AFFILIATE_REL = "sponsored nofollow noopener noreferrer";

export function AffiliateCtaLink({
  href,
  children,
  className,
  placement = "affiliate-cta",
  target,
  source,
  label,
}: AffiliateCtaLinkProps) {
  return (
    <TrackedLink
      href={href}
      external
      rel={AFFILIATE_REL}
      placement={placement}
      target={target ?? { type: "external" }}
      source={source}
      label={label}
      className={cn(
        "inline-flex items-center rounded-sm bg-fwn-gold px-6 py-3 text-sm font-semibold tracking-wide text-fwn-void shadow-[0_12px_32px_-12px_rgba(196,163,106,0.7)] transition-colors hover:bg-fwn-brass",
        className,
      )}
    >
      {children}
    </TrackedLink>
  );
}
