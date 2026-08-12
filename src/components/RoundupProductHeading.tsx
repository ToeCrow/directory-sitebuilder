import Link from "next/link";
import type { Product } from "@/types/site";
import { getProductPath } from "@/lib/paths";

type RoundupProductHeadingProps = {
  index: number;
  heading: string;
  product?: Product;
  publicBasePath: string;
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
  publicBasePath,
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
          <Link
            href={getProductPath(publicBasePath, product.slug)}
            className="text-blue-600 hover:text-blue-700"
          >
            {name}
          </Link>
          {rest}
        </>
      ) : (
        heading
      )}
    </h2>
  );
}
