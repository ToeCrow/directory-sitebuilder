"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { slugify } from "@/lib/slug";
import { ImageField } from "@/components/admin/ImageField";
import { createProductAction } from "../actions";

type SiteOption = {
  id: string;
  title: string;
  slug: string;
};

type ProductCreateFormProps = {
  sites: SiteOption[];
  initialSiteId: string;
  initialComparisonRank: number;
  initialDirectorySortOrder: number;
};

const fieldClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

export function ProductCreateForm({
  sites,
  initialSiteId,
  initialComparisonRank,
  initialDirectorySortOrder,
}: ProductCreateFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [siteId, setSiteId] = useState(initialSiteId);
  const [values, setValues] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    bestFor: "",
    priceFrom: "",
    featuresText: "",
    prosText: "",
    consText: "",
    affiliateUrl: "",
    hasAffiliatePartnership: false,
    badge: "",
    comparisonRank: initialComparisonRank,
    directorySortOrder: initialDirectorySortOrder,
    status: "draft" as "draft" | "published",
    imageSrc: "",
    imageAlt: "",
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createProductAction({
        siteId,
        ...values,
        badge: values.badge || null,
        comparisonRank: Number(values.comparisonRank),
        directorySortOrder: Number(values.directorySortOrder),
        imageSrc: values.imageSrc || null,
        imageAlt: values.imageAlt || values.name || null,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (result.productId) {
        router.push(`/admin/products/${result.productId}`);
      } else {
        router.push("/admin/products");
      }
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-5">
      <label className="block text-sm font-medium text-slate-700">
        Site
        <select
          className={fieldClass}
          required
          value={siteId}
          onChange={(e) => setSiteId(e.target.value)}
        >
          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.title} (/{site.slug})
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Name
        <input
          className={fieldClass}
          required
          value={values.name}
          onChange={(e) => {
            const name = e.target.value;
            setValues((prev) => ({
              ...prev,
              name,
              slug: slugTouched ? prev.slug : slugify(name),
            }));
          }}
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Slug
        <input
          className={fieldClass}
          required
          value={values.slug}
          onChange={(e) => {
            setSlugTouched(true);
            setValues({ ...values, slug: e.target.value });
          }}
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
          placeholder="https://…"
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
          <option value="draft">draft</option>
          <option value="published">published</option>
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

      <ImageField
        siteId={siteId}
        kind="products"
        label="Image"
        src={values.imageSrc}
        alt={values.imageAlt}
        showAlt
        onSrcChange={(imageSrc) => setValues({ ...values, imageSrc })}
        onAltChange={(imageAlt) => setValues({ ...values, imageAlt })}
      />

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Creating…" : "Create product"}
      </button>
    </form>
  );
}
