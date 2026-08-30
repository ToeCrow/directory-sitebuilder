"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import type { AdminBuyingGuideSection } from "@/lib/admin/buying-guide";
import {
  addBuyingGuideSectionAction,
  deleteBuyingGuideSectionAction,
  updateBuyingGuideSectionAction,
  updateBuyingGuideTitleAction,
} from "./actions";

const fieldClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

function TitleForm({ siteId, title }: { siteId: string; title: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [value, setValue] = useState(title);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await updateBuyingGuideTitleAction(siteId, {
        title: value,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSuccess("Saved.");
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-2xl space-y-3 rounded-xl border border-slate-200 bg-white p-5"
    >
      <label className="block text-sm font-medium text-slate-700">
        Buying guide title
        <input
          className={fieldClass}
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-700">{success}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save title"}
      </button>
    </form>
  );
}

function SectionForm({ section }: { section: AdminBuyingGuideSection }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState({
    title: section.title,
    content: section.content,
    sortOrder: section.sortOrder,
  });

  function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await updateBuyingGuideSectionAction(
        section.id,
        values,
      );
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function onDelete() {
    if (!confirm(`Delete buying guide section "${section.title}"?`)) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deleteBuyingGuideSectionAction(section.id);
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
      className="space-y-3 rounded-xl border border-slate-200 bg-white p-5"
    >
      <label className="block text-sm font-medium text-slate-700">
        Title
        <input
          className={fieldClass}
          required
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Content
        <textarea
          className={fieldClass}
          rows={4}
          required
          value={values.content}
          onChange={(e) => setValues({ ...values, content: e.target.value })}
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Sort order
        <input
          type="number"
          min={1}
          className={`${fieldClass} w-24`}
          value={values.sortOrder}
          onChange={(e) =>
            setValues({ ...values, sortOrder: Number(e.target.value) })
          }
        />
      </label>
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

function AddSectionForm({
  siteId,
  nextSortOrder,
}: {
  siteId: string;
  nextSortOrder: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState({
    title: "",
    content: "",
    sortOrder: nextSortOrder,
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await addBuyingGuideSectionAction(siteId, values);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setValues({ title: "", content: "", sortOrder: nextSortOrder + 1 });
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-white p-5"
    >
      <h3 className="text-sm font-semibold text-slate-900">Add a section</h3>
      <label className="block text-sm font-medium text-slate-700">
        Title
        <input
          className={fieldClass}
          required
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Content
        <textarea
          className={fieldClass}
          rows={4}
          required
          value={values.content}
          onChange={(e) => setValues({ ...values, content: e.target.value })}
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Sort order
        <input
          type="number"
          min={1}
          className={`${fieldClass} w-24`}
          value={values.sortOrder}
          onChange={(e) =>
            setValues({ ...values, sortOrder: Number(e.target.value) })
          }
        />
      </label>
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

export function BuyingGuideManager({
  siteId,
  title,
  sections,
}: {
  siteId: string;
  title: string;
  sections: AdminBuyingGuideSection[];
}) {
  const nextSortOrder =
    sections.reduce((max, section) => Math.max(max, section.sortOrder), 0) +
    1;

  return (
    <div className="space-y-6">
      <TitleForm siteId={siteId} title={title} />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Sections</h2>
        {sections.length === 0 && (
          <p className="text-sm text-slate-600">
            No buying guide sections yet for this site.
          </p>
        )}
        {sections.map((section) => (
          <SectionForm key={section.id} section={section} />
        ))}
        <AddSectionForm siteId={siteId} nextSortOrder={nextSortOrder} />
      </div>
    </div>
  );
}
