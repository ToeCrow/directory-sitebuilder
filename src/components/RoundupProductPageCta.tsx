import { TrackedLink } from "@/components/TrackedLink";
import type { Product } from "@/types/site";
import { buyLinkRel, getBuyUrl } from "@/lib/product-links";

type RoundupProductPageCtaProps = {
  product: Product;
};

export function RoundupProductPageCta({ product }: RoundupProductPageCtaProps) {
  const label = `Check price & availability for ${product.name}`;

  return (
    <p className="mt-6">
      <TrackedLink
        href={getBuyUrl(product)}
        external
        rel={buyLinkRel(product)}
        placement="roundup-product-cta"
        target={
          product.id
            ? { type: "product", id: product.id }
            : { type: "external" }
        }
        label={label}
        className="text-sm font-medium text-ss-navy hover:text-ss-blue"
      >
        {label}
      </TrackedLink>
    </p>
  );
}
