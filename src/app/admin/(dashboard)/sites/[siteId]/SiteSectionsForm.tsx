"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { updateSiteSectionsAction } from "../actions";

type SiteSectionsValues = {
  topPicksTitle: string;
  topPicksDescription: string;
  productDirectoryTitle: string;
  productDirectoryDescription: string;
  comparisonTitle: string;
  comparisonDescription: string;
  comparisonRowHeaderLabel: string;
  buyingGuideTitle: string;
  footerTagline: string;
};

type SiteSectionsFormProps = {
  siteId: string;
  initial: SiteSectionsValues;
};

const fieldClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

export function SiteSectionsForm({ siteId, initial }: SiteSectionsFormProps) {
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
      const result = await updateSiteSectionsAction(siteId, {
        ...values,
        topPicksDescription: values.topPicksDescription || null,
        productDirectoryDescription:
          values.productDirectoryDescription || null,
        comparisonDescription: values.comparisonDescription || null,
        comparisonRowHeaderLabel: values.comparisonRowHeaderLabel || null,
        footerTagline: values.footerTagline || null,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setSuccess("Saved. Published content is live immediately.");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
      <fieldset className="space-y-3 rounded-lg border border-slate-200 p-4">
        <legend className="px-1 text-sm font-semibold text-slate-900">
          Top picks
        </legend>
        <label className="block text-sm font-medium text-slate-700">
          Title
          <input
            className={fieldClass}
            required
            value={values.topPicksTitle}
            onChange={(e) =>
              setValues({ ...values, topPicksTitle: e.target.value })
            }
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Description
          <textarea
            className={fieldClass}
            rows={2}
            value={values.topPicksDescription}
            onChange={(e) =>
              setValues({ ...values, topPicksDescription: e.target.value })
            }
          />
        </label>
      </fieldset>

      <fieldset className="space-y-3 rounded-lg border border-slate-200 p-4">
        <legend className="px-1 text-sm font-semibold text-slate-900">
          Product directory
        </legend>
        <label className="block text-sm font-medium text-slate-700">
          Title
          <input
            className={fieldClass}
            required
            value={values.productDirectoryTitle}
            onChange={(e) =>
              setValues({
                ...values,
                productDirectoryTitle: e.target.value,
              })
            }
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Description
          <textarea
            className={fieldClass}
            rows={2}
            value={values.productDirectoryDescription}
            onChange={(e) =>
              setValues({
                ...values,
                productDirectoryDescription: e.target.value,
              })
            }
          />
        </label>
      </fieldset>

      <fieldset className="space-y-3 rounded-lg border border-slate-200 p-4">
        <legend className="px-1 text-sm font-semibold text-slate-900">
          Comparison table
        </legend>
        <label className="block text-sm font-medium text-slate-700">
          Title
          <input
            className={fieldClass}
            required
            value={values.comparisonTitle}
            onChange={(e) =>
              setValues({ ...values, comparisonTitle: e.target.value })
            }
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Description
          <textarea
            className={fieldClass}
            rows={2}
            value={values.comparisonDescription}
            onChange={(e) =>
              setValues({
                ...values,
                comparisonDescription: e.target.value,
              })
            }
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Row header label
          <input
            className={fieldClass}
            placeholder="e.g. Product"
            value={values.comparisonRowHeaderLabel}
            onChange={(e) =>
              setValues({
                ...values,
                comparisonRowHeaderLabel: e.target.value,
              })
            }
          />
        </label>
      </fieldset>

      <fieldset className="space-y-3 rounded-lg border border-slate-200 p-4">
        <legend className="px-1 text-sm font-semibold text-slate-900">
          Buying guide
        </legend>
        <label className="block text-sm font-medium text-slate-700">
          Title
          <input
            className={fieldClass}
            required
            value={values.buyingGuideTitle}
            onChange={(e) =>
              setValues({ ...values, buyingGuideTitle: e.target.value })
            }
          />
        </label>
      </fieldset>

      <fieldset className="space-y-3 rounded-lg border border-slate-200 p-4">
        <legend className="px-1 text-sm font-semibold text-slate-900">
          Footer
        </legend>
        <label className="block text-sm font-medium text-slate-700">
          Tagline
          <input
            className={fieldClass}
            value={values.footerTagline}
            onChange={(e) =>
              setValues({ ...values, footerTagline: e.target.value })
            }
          />
        </label>
      </fieldset>

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

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save section titles"}
      </button>
    </form>
  );
}
