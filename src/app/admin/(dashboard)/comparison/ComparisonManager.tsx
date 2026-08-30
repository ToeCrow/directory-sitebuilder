"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import type { AdminComparisonRow, AdminComparisonSection } from "@/lib/admin/comparison";
import {
  addComparisonRowAction,
  deleteComparisonRowAction,
  updateComparisonRowAction,
  updateComparisonSectionAction,
} from "./actions";

const fieldClass =
  "rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

function SectionForm({
  siteId,
  section,
}: {
  siteId: string;
  section: AdminComparisonSection;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [values, setValues] = useState(section);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await updateComparisonSectionAction(siteId, {
        title: values.title,
        description: values.description || null,
        rowHeaderLabel: values.rowHeaderLabel || null,
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
      className="max-w-2xl space-y-4 rounded-xl border border-slate-200 bg-white p-5"
    >
      <label className="block text-sm font-medium text-slate-700">
        Title
        <input
          className={`mt-1 w-full ${fieldClass}`}
          required
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Description
        <textarea
          className={`mt-1 w-full ${fieldClass}`}
          rows={2}
          value={values.description}
          onChange={(e) =>
            setValues({ ...values, description: e.target.value })
          }
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Row header label
        <input
          className={`mt-1 w-full ${fieldClass}`}
          placeholder="e.g. Product"
          value={values.rowHeaderLabel}
          onChange={(e) =>
            setValues({ ...values, rowHeaderLabel: e.target.value })
          }
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-700">{success}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save section"}
      </button>
    </form>
  );
}

function RowForm({ row }: { row: AdminComparisonRow }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState({
    key: row.key,
    label: row.label,
    type: row.type,
    sortOrder: row.sortOrder,
  });

  function onSave() {
    setError(null);
    startTransition(async () => {
      const result = await updateComparisonRowAction(row.id, values);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function onDelete() {
    if (!confirm(`Delete comparison row "${row.label}"?`)) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deleteComparisonRowAction(row.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-4 py-3">
        <input
          className={`${fieldClass} w-32`}
          value={values.key}
          onChange={(e) => setValues({ ...values, key: e.target.value })}
        />
      </td>
      <td className="px-4 py-3">
        <input
          className={`${fieldClass} w-40`}
          value={values.label}
          onChange={(e) => setValues({ ...values, label: e.target.value })}
        />
      </td>
      <td className="px-4 py-3">
        <select
          className={fieldClass}
          value={values.type}
          onChange={(e) =>
            setValues({
              ...values,
              type: e.target.value as "text" | "boolean",
            })
          }
        >
          <option value="text">text</option>
          <option value="boolean">boolean</option>
        </select>
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          min={1}
          className={`${fieldClass} w-20`}
          value={values.sortOrder}
          onChange={(e) =>
            setValues({ ...values, sortOrder: Number(e.target.value) })
          }
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={pending}
            onClick={onSave}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            Save
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={onDelete}
            className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </td>
    </tr>
  );
}

function AddRowForm({
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
    key: "",
    label: "",
    type: "text" as "text" | "boolean",
    sortOrder: nextSortOrder,
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await addComparisonRowAction(siteId, values);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setValues({ key: "", label: "", type: "text", sortOrder: nextSortOrder + 1 });
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-5"
    >
      <label className="text-sm font-medium text-slate-700">
        Key
        <input
          className={`mt-1 block ${fieldClass}`}
          required
          placeholder="e.g. cooling"
          value={values.key}
          onChange={(e) => setValues({ ...values, key: e.target.value })}
        />
      </label>
      <label className="text-sm font-medium text-slate-700">
        Label
        <input
          className={`mt-1 block ${fieldClass}`}
          required
          placeholder="e.g. Cooling"
          value={values.label}
          onChange={(e) => setValues({ ...values, label: e.target.value })}
        />
      </label>
      <label className="text-sm font-medium text-slate-700">
        Type
        <select
          className={`mt-1 block ${fieldClass}`}
          value={values.type}
          onChange={(e) =>
            setValues({ ...values, type: e.target.value as "text" | "boolean" })
          }
        >
          <option value="text">text</option>
          <option value="boolean">boolean</option>
        </select>
      </label>
      <label className="text-sm font-medium text-slate-700">
        Sort order
        <input
          type="number"
          min={1}
          className={`mt-1 block w-20 ${fieldClass}`}
          value={values.sortOrder}
          onChange={(e) =>
            setValues({ ...values, sortOrder: Number(e.target.value) })
          }
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add row"}
      </button>
      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}

export function ComparisonManager({
  siteId,
  section,
  rows,
}: {
  siteId: string;
  section: AdminComparisonSection;
  rows: AdminComparisonRow[];
}) {
  const nextSortOrder =
    rows.reduce((max, row) => Math.max(max, row.sortOrder), 0) + 1;

  return (
    <div className="space-y-8">
      <SectionForm siteId={siteId} section={section} />

      <div>
        <h2 className="text-xl font-semibold text-slate-900">Rows</h2>
        {rows.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">
            No comparison rows yet for this site.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Key</th>
                  <th className="px-4 py-3 font-medium">Label</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Sort order</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <RowForm key={row.id} row={row} />
                ))}
              </tbody>
            </table>
          </div>
        )}
        <AddRowForm siteId={siteId} nextSortOrder={nextSortOrder} />
      </div>
    </div>
  );
}
