"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import type { AdminFaqItem } from "@/lib/admin/faq";
import { addFaqAction, deleteFaqAction, updateFaqAction } from "./actions";

const fieldClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

function FaqItemForm({ faq }: { faq: AdminFaqItem }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState({
    question: faq.question,
    answer: faq.answer,
    sortOrder: faq.sortOrder,
  });

  function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await updateFaqAction(faq.id, values);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function onDelete() {
    if (!confirm("Delete this FAQ?")) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deleteFaqAction(faq.id);
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
        Question
        <input
          className={fieldClass}
          required
          value={values.question}
          onChange={(e) => setValues({ ...values, question: e.target.value })}
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Answer
        <textarea
          className={fieldClass}
          rows={3}
          required
          value={values.answer}
          onChange={(e) => setValues({ ...values, answer: e.target.value })}
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

function AddFaqForm({
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
    question: "",
    answer: "",
    sortOrder: nextSortOrder,
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await addFaqAction(siteId, values);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setValues({ question: "", answer: "", sortOrder: nextSortOrder + 1 });
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-white p-5"
    >
      <h3 className="text-sm font-semibold text-slate-900">Add a FAQ</h3>
      <label className="block text-sm font-medium text-slate-700">
        Question
        <input
          className={fieldClass}
          required
          value={values.question}
          onChange={(e) => setValues({ ...values, question: e.target.value })}
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Answer
        <textarea
          className={fieldClass}
          rows={3}
          required
          value={values.answer}
          onChange={(e) => setValues({ ...values, answer: e.target.value })}
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
        {pending ? "Adding…" : "Add FAQ"}
      </button>
    </form>
  );
}

export function FaqManager({
  siteId,
  faqs,
}: {
  siteId: string;
  faqs: AdminFaqItem[];
}) {
  const nextSortOrder =
    faqs.reduce((max, faq) => Math.max(max, faq.sortOrder), 0) + 1;

  return (
    <div className="space-y-4">
      {faqs.length === 0 && (
        <p className="text-sm text-slate-600">
          No FAQs yet for this site.
        </p>
      )}
      {faqs.map((faq) => (
        <FaqItemForm key={faq.id} faq={faq} />
      ))}
      <AddFaqForm siteId={siteId} nextSortOrder={nextSortOrder} />
    </div>
  );
}
