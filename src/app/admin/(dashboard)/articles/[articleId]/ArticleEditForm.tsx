"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { deleteArticleAction, updateArticleAction } from "../actions";

type ArticleFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  introText: string;
  researchNoteTitle: string;
  researchNoteContent: string;
  author: string;
  ogImageSrc: string;
  ogImageAlt: string;
  status: "draft" | "published";
  publishedAt: string;
  updatedAtContent: string;
};

type ArticleEditFormProps = {
  articleId: string;
  initial: ArticleFormValues;
};

const fieldClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

export function ArticleEditForm({ articleId, initial }: ArticleEditFormProps) {
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
      const result = await updateArticleAction(articleId, {
        ...values,
        excerpt: values.excerpt || null,
        author: values.author || null,
        ogImageSrc: values.ogImageSrc || null,
        ogImageAlt: values.ogImageAlt || null,
        publishedAt: values.publishedAt || null,
        updatedAtContent: values.updatedAtContent || null,
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
    if (!confirm("Delete this article permanently?")) {
      return;
    }
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await deleteArticleAction(articleId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/admin/articles");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-5">
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
        Slug
        <input
          className={fieldClass}
          required
          value={values.slug}
          onChange={(e) => setValues({ ...values, slug: e.target.value })}
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Excerpt
        <textarea
          className={fieldClass}
          rows={2}
          value={values.excerpt}
          onChange={(e) => setValues({ ...values, excerpt: e.target.value })}
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Intro (one paragraph per line)
        <textarea
          className={fieldClass}
          rows={5}
          value={values.introText}
          onChange={(e) =>
            setValues({ ...values, introText: e.target.value })
          }
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Research note title
        <input
          className={fieldClass}
          required
          value={values.researchNoteTitle}
          onChange={(e) =>
            setValues({ ...values, researchNoteTitle: e.target.value })
          }
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Research note content
        <textarea
          className={fieldClass}
          rows={3}
          required
          value={values.researchNoteContent}
          onChange={(e) =>
            setValues({ ...values, researchNoteContent: e.target.value })
          }
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Author
        <input
          className={fieldClass}
          value={values.author}
          onChange={(e) => setValues({ ...values, author: e.target.value })}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          OG image path
          <input
            className={fieldClass}
            value={values.ogImageSrc}
            onChange={(e) =>
              setValues({ ...values, ogImageSrc: e.target.value })
            }
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          OG image alt
          <input
            className={fieldClass}
            value={values.ogImageAlt}
            onChange={(e) =>
              setValues({ ...values, ogImageAlt: e.target.value })
            }
          />
        </label>
      </div>

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
          Published date
          <input
            className={fieldClass}
            type="date"
            value={values.publishedAt}
            onChange={(e) =>
              setValues({ ...values, publishedAt: e.target.value })
            }
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Content updated date
          <input
            className={fieldClass}
            type="date"
            value={values.updatedAtContent}
            onChange={(e) =>
              setValues({ ...values, updatedAtContent: e.target.value })
            }
          />
        </label>
      </div>

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
          disabled={pending}
          onClick={onDelete}
          className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </form>
  );
}
