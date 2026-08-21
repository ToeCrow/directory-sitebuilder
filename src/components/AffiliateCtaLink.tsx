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
        "inline-flex items-center rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800",
        className,
      )}
    >
      {children}
    </a>
  );
}
