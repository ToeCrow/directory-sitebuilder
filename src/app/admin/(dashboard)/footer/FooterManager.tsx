"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import type { AdminFooterLink } from "@/lib/admin/footer";
import {
  addFooterLinkAction,
  deleteFooterLinkAction,
  updateFooterLinkAction,
  updateFooterTaglineAction,
} from "./actions";

const fieldClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";
const inlineFieldClass =
  "rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

function TaglineForm({ siteId, tagline }: { siteId: string; tagline: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [value, setValue] = useState(tagline);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await updateFooterTaglineAction(siteId, {
        tagline: value || null,
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
        Footer tagline
        <input
          className={fieldClass}
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
        {pending ? "Saving…" : "Save tagline"}
      </button>
    </form>
  );
}

function LinkRow({ link }: { link: AdminFooterLink }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState({
    label: link.label,
    href: link.href,
    sortOrder: link.sortOrder,
  });

  function onSave() {
    setError(null);
    startTransition(async () => {
      const result = await updateFooterLinkAction(link.id, values);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function onDelete() {
    if (!confirm(`Delete footer link "${link.label}"?`)) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deleteFooterLinkAction(link.id);
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
          className={`${inlineFieldClass} w-40`}
          value={values.label}
          onChange={(e) => setValues({ ...values, label: e.target.value })}
        />
      </td>
      <td className="px-4 py-3">
        <input
          className={`${inlineFieldClass} w-56`}
          value={values.href}
          onChange={(e) => setValues({ ...values, href: e.target.value })}
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          min={1}
          className={`${inlineFieldClass} w-20`}
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

function AddLinkForm({
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
    label: "",
    href: "",
    sortOrder: nextSortOrder,
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await addFooterLinkAction(siteId, values);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setValues({ label: "", href: "", sortOrder: nextSortOrder + 1 });
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-5"
    >
      <label className="text-sm font-medium text-slate-700">
        Label
        <input
          className={`mt-1 block ${inlineFieldClass}`}
          required
          value={values.label}
          onChange={(e) => setValues({ ...values, label: e.target.value })}
        />
      </label>
      <label className="text-sm font-medium text-slate-700">
        Link
        <input
          className={`mt-1 block w-56 ${inlineFieldClass}`}
          required
          placeholder="/site/page or https://..."
          value={values.href}
          onChange={(e) => setValues({ ...values, href: e.target.value })}
        />
      </label>
      <label className="text-sm font-medium text-slate-700">
        Sort order
        <input
          type="number"
          min={1}
          className={`mt-1 block w-20 ${inlineFieldClass}`}
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
        {pending ? "Adding…" : "Add link"}
      </button>
      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}

export function FooterManager({
  siteId,
  tagline,
  links,
}: {
  siteId: string;
  tagline: string;
  links: AdminFooterLink[];
}) {
  const nextSortOrder =
    links.reduce((max, link) => Math.max(max, link.sortOrder), 0) + 1;

  return (
    <div className="space-y-8">
      <TaglineForm siteId={siteId} tagline={tagline} />

      <div>
        <h2 className="text-xl font-semibold text-slate-900">Links</h2>
        {links.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">
            No footer links yet for this site.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Label</th>
                  <th className="px-4 py-3 font-medium">Link</th>
                  <th className="px-4 py-3 font-medium">Sort order</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <LinkRow key={link.id} link={link} />
                ))}
              </tbody>
            </table>
          </div>
        )}
        <AddLinkForm siteId={siteId} nextSortOrder={nextSortOrder} />
      </div>
    </div>
  );
}
