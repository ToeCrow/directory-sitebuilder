"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import {
  deleteProductAction,
  updateProductAction,
} from "../actions";

type ProductFormValues = {
  name: string;
  slug: string;
  shortDescription: string;
  bestFor: string;
  priceFrom: string;
  featuresText: string;
  prosText: string;
  consText: string;
  affiliateUrl: string;
  hasAffiliatePartnership: boolean;
  rating: number;
  badge: string;
  comparisonRank: number;
  directorySortOrder: number;
  status: "draft" | "published";
};

type ProductEditFormProps = {
  productId: string;
  ratingScale: number;
  isTopPick: boolean;
  initial: ProductFormValues;
};

const fieldClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

export function ProductEditForm({
  productId,
  ratingScale,
  isTopPick,
  initial,
}: ProductEditFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [values, setValues] = useState(initial);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await updateProductAction(productId, {
        ...values,
        badge: values.badge || null,
        rating: Number(values.rating),
        comparisonRank: Number(values.comparisonRank),
        directorySortOrder: Number(values.directorySortOrder),
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setSuccess("Saved. Published content is live immediately.");
      router.refresh();
    });
  }

  function onDelete() {
    if (!confirm("Delete this product permanently?")) {
      return;
    }
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await deleteProductAction(productId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/admin/products");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-5">
      <label className="block text-sm font-medium text-slate-700">
        Name
        <input
          className={fieldClass}
          required
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Slug
        <input
          className={fieldClass}
          required
          value={values.slug}
          onChange={(e) => setValues({ ...values, slug: e.target.value })}
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Short description
        <textarea
          className={fieldClass}
          rows={3}
          required
          value={values.shortDescription}
          onChange={(e) =>
            setValues({ ...values, shortDescription: e.target.value })
          }
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Best for
        <input
          className={fieldClass}
          required
          value={values.bestFor}
          onChange={(e) => setValues({ ...values, bestFor: e.target.value })}
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Price from
        <input
          className={fieldClass}
          required
          value={values.priceFrom}
          onChange={(e) => setValues({ ...values, priceFrom: e.target.value })}
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Rating (0–{ratingScale})
        <input
          className={fieldClass}
          type="number"
          step="0.1"
          min={0}
          max={ratingScale}
          required
          value={values.rating}
          onChange={(e) =>
            setValues({ ...values, rating: Number(e.target.value) })
          }
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Badge
        <input
          className={fieldClass}
          value={values.badge}
          onChange={(e) => setValues({ ...values, badge: e.target.value })}
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Affiliate URL
        <input
          className={fieldClass}
          type="url"
          required
          value={values.affiliateUrl}
          onChange={(e) =>
            setValues({ ...values, affiliateUrl: e.target.value })
          }
        />
      </label>

      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={values.hasAffiliatePartnership}
          onChange={(e) =>
            setValues({
              ...values,
              hasAffiliatePartnership: e.target.checked,
            })
          }
        />
        Active affiliate partnership
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Status
        <select
          className={fieldClass}
          value={values.status}
          onChange={(e) =>
            setValues({
              ...values,
              status: e.target.value as "draft" | "published",
            })
          }
        >
          <option value="published">published</option>
          <option value="draft">draft</option>
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Comparison rank
          <input
            className={fieldClass}
            type="number"
            min={1}
            required
            value={values.comparisonRank}
            onChange={(e) =>
              setValues({
                ...values,
                comparisonRank: Number(e.target.value),
              })
            }
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Directory sort order
          <input
            className={fieldClass}
            type="number"
            min={1}
            required
            value={values.directorySortOrder}
            onChange={(e) =>
              setValues({
                ...values,
                directorySortOrder: Number(e.target.value),
              })
            }
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Features (one per line)
        <textarea
          className={fieldClass}
          rows={5}
          value={values.featuresText}
          onChange={(e) =>
            setValues({ ...values, featuresText: e.target.value })
          }
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Pros (one per line)
        <textarea
          className={fieldClass}
          rows={4}
          value={values.prosText}
          onChange={(e) => setValues({ ...values, prosText: e.target.value })}
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Cons (one per line)
        <textarea
          className={fieldClass}
          rows={4}
          value={values.consText}
          onChange={(e) => setValues({ ...values, consText: e.target.value })}
        />
      </label>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-green-700" role="status">
          {success}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          disabled={pending || isTopPick}
          title={
            isTopPick
              ? "Remove from top picks before deleting"
              : undefined
          }
          onClick={onDelete}
          className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </form>
  );
}
