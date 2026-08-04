import type { Product } from "@/types/site";
import { buyLinkRel, getBuyUrl } from "@/lib/product-links";

type RoundupProductHeadingProps = {
  index: number;
  heading: string;
  product?: Product;
};

function splitHeading(heading: string): { name: string; rest: string } {
  const colon = heading.indexOf(": ");
  const emDash = heading.indexOf(" — ");
  const hyphen = heading.indexOf(" - ");

  const separators = [
    { at: colon, len: 2 },
    { at: emDash, len: 3 },
    { at: hyphen, len: 3 },
  ].filter((s) => s.at >= 0);

  if (separators.length === 0) {
    return { name: heading, rest: "" };
  }

  separators.sort((a, b) => a.at - b.at);
  const first = separators[0];
  return {
    name: heading.slice(0, first.at),
    rest: heading.slice(first.at),
  };
}

export function RoundupProductHeading({
  index,
  heading,
  product,
}: RoundupProductHeadingProps) {
  const { name, rest } = splitHeading(heading);
  const headingId = `product-${index}-heading`;

  return (
    <h2
      id={headingId}
      className="text-2xl font-bold tracking-tight text-slate-900"
    >
      {index + 1}){" "}
      {product ? (
        <>
          <a
            href={getBuyUrl(product)}
            target="_blank"
            rel={buyLinkRel(product)}
            className="text-blue-600 hover:text-blue-700"
          >
            {name}
          </a>
          {rest}
        </>
      ) : (
        heading
      )}
    </h2>
  );
}
