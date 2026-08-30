import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminProductById } from "@/lib/admin/products";
import { imageFromUnknown } from "@/lib/media";
import { ProductEditForm } from "./ProductEditForm";

export const dynamic = "force-dynamic";

type ProductEditPageProps = {
  params: Promise<{ productId: string }>;
};

export default async function AdminProductEditPage({
  params,
}: ProductEditPageProps) {
  const { productId } = await params;
  const product = await getAdminProductById(productId).catch(() => null);

  if (!product) {
    notFound();
  }

  const image = imageFromUnknown(
    product.content && typeof product.content === "object"
      ? (product.content as { image?: unknown }).image
      : undefined,
  );

  return (
    <div>
      <Link
        href="/admin/products"
        className="text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        ← Back to products
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        Edit {product.name}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        {product.siteTitle} · Status:{" "}
        <span className="font-medium">{product.status}</span>
        {product.isTopPick && (
          <span className="ml-2 text-blue-700">(top pick — cannot unpublish/delete until removed)</span>
        )}
      </p>
      <div className="mt-8">
        <ProductEditForm
          productId={product.id}
          siteId={product.siteId}
          isTopPick={product.isTopPick}
          initial={{
            name: product.name,
            slug: product.slug,
            shortDescription: product.shortDescription,
            bestFor: product.bestFor,
            priceFrom: product.priceFrom,
            featuresText: product.features.join("\n"),
            prosText: product.pros.join("\n"),
            consText: product.cons.join("\n"),
            affiliateUrl: product.affiliateUrl,
            hasAffiliatePartnership: product.hasAffiliatePartnership,
            badge: product.badge ?? "",
            comparisonRank: product.comparisonRank,
            directorySortOrder: product.directorySortOrder,
            status: product.status,
            imageSrc: image.src,
            imageAlt: image.alt,
          }}
        />
      </div>
    </div>
  );
}
