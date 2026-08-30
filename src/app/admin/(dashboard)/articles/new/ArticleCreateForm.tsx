"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { slugify } from "@/lib/slug";
import { createArticleAction } from "../actions";

type SiteOption = {
  id: string;
  title: string;
  slug: string;
};

type ArticleCreateFormProps = {
  sites: SiteOption[];
  initialSiteId: string;
};

const fieldClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

export function ArticleCreateForm({
  sites,
  initialSiteId,
}: ArticleCreateFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [values, setValues] = useState({
    siteId: initialSiteId,
    kind: "editorial" as "editorial" | "product-roundup",
    title: "",
    slug: "",
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createArticleAction(values);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`/admin/articles/${result.articleId}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-5">
      <label className="block text-sm font-medium text-slate-700">
        Site
        <select
          className={fieldClass}
          value={values.siteId}
          onChange={(event) =>
            setValues({ ...values, siteId: event.target.value })
          }
        >
          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.title}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-slate-700">Kind</legend>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="radio"
            name="kind"
            checked={values.kind === "editorial"}
            onChange={() => setValues({ ...values, kind: "editorial" })}
          />
          Editorial
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="radio"
            name="kind"
            checked={values.kind === "product-roundup"}
            onChange={() => setValues({ ...values, kind: "product-roundup" })}
          />
          Product roundup
        </label>
      </fieldset>

      <label className="block text-sm font-medium text-slate-700">
        Title
        <input
          className={fieldClass}
          required
          value={values.title}
          onChange={(event) => {
            const title = event.target.value;
            setValues({
              ...values,
              title,
              slug: slugTouched ? values.slug : slugify(title),
            });
          }}
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Slug
        <input
          className={fieldClass}
          required
          value={values.slug}
          onChange={(event) => {
            setSlugTouched(true);
            setValues({ ...values, slug: event.target.value });
          }}
        />
      </label>

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
        {pending ? "Creating…" : "Create draft"}
      </button>
    </form>
  );
}
