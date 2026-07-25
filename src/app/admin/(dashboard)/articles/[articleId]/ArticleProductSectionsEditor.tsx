"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import type { AdminArticleProductSection } from "@/lib/admin/articles";
import { arrayToLines } from "@/lib/admin/lines";
import {
  addArticleProductSectionAction,
  deleteArticleProductSectionAction,
  updateArticleProductSectionAction,
} from "../actions";

const fieldClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

type SectionFormValues = {
  heading: string;
  intro: string;
  imageSrc: string;
  imageAlt: string;
  whatItIs: string;
  whyItEarnsASpotText: string;
  whereItFallsShortText: string;
  bestFor: string;
  skipIf: string;
  sortOrder: number;
};

function sectionToValues(
  section: AdminArticleProductSection,
): SectionFormValues {
  return {
    heading: section.heading,
    intro: section.intro ?? "",
    imageSrc: section.imageSrc ?? "",
    imageAlt: section.imageAlt ?? "",
    whatItIs: section.whatItIs,
    whyItEarnsASpotText: arrayToLines(section.whyItEarnsASpot),
    whereItFallsShortText: arrayToLines(section.whereItFallsShort),
    bestFor: section.bestFor,
    skipIf: section.skipIf,
    sortOrder: section.sortOrder,
  };
}

function SectionFields({
  values,
  onChange,
}: {
  values: SectionFormValues;
  onChange: (values: SectionFormValues) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Heading
          <input
            className={fieldClass}
            required
            value={values.heading}
            onChange={(e) => onChange({ ...values, heading: e.target.value })}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Sort order
          <input
            type="number"
            min={1}
            className={fieldClass}
            value={values.sortOrder}
            onChange={(e) =>
              onChange({ ...values, sortOrder: Number(e.target.value) })
            }
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Intro
        <textarea
          className={fieldClass}
          rows={2}
          value={values.intro}
          onChange={(e) => onChange({ ...values, intro: e.target.value })}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Image path
          <input
            className={fieldClass}
            value={values.imageSrc}
            onChange={(e) => onChange({ ...values, imageSrc: e.target.value })}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Image alt
          <input
            className={fieldClass}
            value={values.imageAlt}
            onChange={(e) => onChange({ ...values, imageAlt: e.target.value })}
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        What it is
        <textarea
          className={fieldClass}
          rows={3}
          required
          value={values.whatItIs}
          onChange={(e) => onChange({ ...values, whatItIs: e.target.value })}
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Why it earns a spot (one per line)
        <textarea
          className={fieldClass}
          rows={4}
          value={values.whyItEarnsASpotText}
          onChange={(e) =>
            onChange({ ...values, whyItEarnsASpotText: e.target.value })
          }
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Where it falls short (one per line)
        <textarea
          className={fieldClass}
          rows={4}
          value={values.whereItFallsShortText}
          onChange={(e) =>
            onChange({ ...values, whereItFallsShortText: e.target.value })
          }
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Best for
          <input
            className={fieldClass}
            required
            value={values.bestFor}
            onChange={(e) => onChange({ ...values, bestFor: e.target.value })}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Skip if
          <input
            className={fieldClass}
            required
            value={values.skipIf}
            onChange={(e) => onChange({ ...values, skipIf: e.target.value })}
          />
        </label>
      </div>
    </div>
  );
}

function ExistingSectionForm({
  section,
}: {
  section: AdminArticleProductSection;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState(sectionToValues(section));

  function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await updateArticleProductSectionAction(section.id, {
        ...values,
        intro: values.intro || null,
        imageSrc: values.imageSrc || null,
        imageAlt: values.imageAlt || null,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function onDelete() {
    if (!confirm(`Delete section "${section.heading}"?`)) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deleteArticleProductSectionAction(section.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={onSave}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-5"
    >
      <SectionFields values={values} onChange={setValues} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={onDelete}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </form>
  );
}

const emptySectionValues = (sortOrder: number): SectionFormValues => ({
  heading: "",
  intro: "",
  imageSrc: "",
  imageAlt: "",
  whatItIs: "",
  whyItEarnsASpotText: "",
  whereItFallsShortText: "",
  bestFor: "",
  skipIf: "",
  sortOrder,
});

function AddSectionForm({
  articleId,
  nextSortOrder,
}: {
  articleId: string;
  nextSortOrder: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState(emptySectionValues(nextSortOrder));

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await addArticleProductSectionAction(articleId, {
        ...values,
        intro: values.intro || null,
        imageSrc: values.imageSrc || null,
        imageAlt: values.imageAlt || null,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setValues(emptySectionValues(nextSortOrder + 1));
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-xl border border-dashed border-slate-300 bg-white p-5"
    >
      <h3 className="text-sm font-semibold text-slate-900">
        Add a product section
      </h3>
      <SectionFields values={values} onChange={setValues} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add section"}
      </button>
    </form>
  );
}

export function ArticleProductSectionsEditor({
  articleId,
  sections,
}: {
  articleId: string;
  sections: AdminArticleProductSection[];
}) {
  const nextSortOrder =
    sections.reduce((max, section) => Math.max(max, section.sortOrder), 0) +
    1;

  return (
    <div className="max-w-2xl space-y-6">
      {sections.length === 0 && (
        <p className="text-sm text-slate-600">
          No product sections yet for this article.
        </p>
      )}
      {sections.map((section) => (
        <ExistingSectionForm key={section.id} section={section} />
      ))}
      <AddSectionForm articleId={articleId} nextSortOrder={nextSortOrder} />
    </div>
  );
}
