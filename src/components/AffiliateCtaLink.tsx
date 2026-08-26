import { cn } from "@/lib/cn";

type AffiliateCtaLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

const AFFILIATE_REL = "sponsored nofollow noopener noreferrer";

export function AffiliateCtaLink({
  href,
  children,
  className,
}: AffiliateCtaLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel={AFFILIATE_REL}
      className={cn(
        "inline-flex items-center rounded-sm bg-fwn-gold px-6 py-3 text-sm font-semibold tracking-wide text-fwn-void shadow-[0_12px_32px_-12px_rgba(196,163,106,0.7)] transition-colors hover:bg-fwn-brass",
        className,
      )}
    >
      {children}
    </a>
  );
}
