"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { updateSiteHeroAction } from "../actions";

type SiteHeroValues = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
  secondaryCtaHref: string;
  imageSrc: string;
  imageSrcMobile: string;
  imageAlt: string;
};

type SiteHeroFormProps = {
  siteId: string;
  initial: SiteHeroValues;
};

const fieldClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

export function SiteHeroForm({ siteId, initial }: SiteHeroFormProps) {
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
      const result = await updateSiteHeroAction(siteId, {
        eyebrow: values.eyebrow || null,
        headline: values.headline,
        subheadline: values.subheadline,
        primaryCta: values.primaryCta,
        secondaryCta: values.secondaryCta || null,
        secondaryCtaHref: values.secondaryCtaHref || null,
        imageSrc: values.imageSrc || null,
        imageSrcMobile: values.imageSrcMobile || null,
        imageAlt: values.imageAlt || null,
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
    <form onSubmit={onSubmit} className="max-w-2xl space-y-5">
      <label className="block text-sm font-medium text-slate-700">
        Eyebrow
        <input
          className={fieldClass}
          value={values.eyebrow}
          onChange={(e) => setValues({ ...values, eyebrow: e.target.value })}
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Headline
        <input
          className={fieldClass}
          required
          value={values.headline}
          onChange={(e) => setValues({ ...values, headline: e.target.value })}
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Subheadline
        <textarea
          className={fieldClass}
          rows={3}
          required
          value={values.subheadline}
          onChange={(e) =>
            setValues({ ...values, subheadline: e.target.value })
          }
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Primary CTA
          <input
            className={fieldClass}
            required
            value={values.primaryCta}
            onChange={(e) =>
              setValues({ ...values, primaryCta: e.target.value })
            }
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Secondary CTA
          <input
            className={fieldClass}
            value={values.secondaryCta}
            onChange={(e) =>
              setValues({ ...values, secondaryCta: e.target.value })
            }
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Secondary CTA link
        <input
          className={fieldClass}
          value={values.secondaryCtaHref}
          onChange={(e) =>
            setValues({ ...values, secondaryCtaHref: e.target.value })
          }
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Image (desktop path)
          <input
            className={fieldClass}
            value={values.imageSrc}
            onChange={(e) =>
              setValues({ ...values, imageSrc: e.target.value })
            }
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Image (mobile path)
          <input
            className={fieldClass}
            value={values.imageSrcMobile}
            onChange={(e) =>
              setValues({ ...values, imageSrcMobile: e.target.value })
            }
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Image alt text
        <input
          className={fieldClass}
          value={values.imageAlt}
          onChange={(e) => setValues({ ...values, imageAlt: e.target.value })}
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

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save hero"}
      </button>
    </form>
  );
}
