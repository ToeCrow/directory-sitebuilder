import type { Product } from "@/types/site";
import { buyLinkRel, getBuyUrl } from "@/lib/product-links";

type RoundupProductPageCtaProps = {
  product: Product;
};

export function RoundupProductPageCta({ product }: RoundupProductPageCtaProps) {
  return (
    <p className="mt-6">
      <a
        href={getBuyUrl(product)}
        target="_blank"
        rel={buyLinkRel(product)}
        className="text-sm font-medium text-ss-navy hover:text-ss-blue"
      >
        Check price & availability for {product.name}
      </a>
    </p>
  );
}
