"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { updateSiteSettingsAction } from "../actions";
import { ImageField } from "@/components/admin/ImageField";

type SiteSettingsValues = {
  title: string;
  metaTitle: string;
  metaDescription: string;
  niche: string;
  siteUrl: string;
  headerBrandImage: string;
  favicon: string;
  affiliateDisclosure: string;
  newsletterTitle: string;
  newsletterDescription: string;
  newsletterButtonText: string;
  newsletterSuccessMessage: string;
  adsPrimary: string;
  adsSecondary: string;
  status: "draft" | "published";
  researchScorePage: boolean;
};

type SiteSettingsFormProps = {
  siteId: string;
  initial: SiteSettingsValues;
};

const fieldClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

export function SiteSettingsForm({ siteId, initial }: SiteSettingsFormProps) {
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
      const result = await updateSiteSettingsAction(siteId, {
        ...values,
        headerBrandImage: values.headerBrandImage || null,
        favicon: values.favicon || null,
        adsPrimary: values.adsPrimary || null,
        adsSecondary: values.adsSecondary || null,
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
        Title
        <input
          className={fieldClass}
          required
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Meta title
        <input
          className={fieldClass}
          required
          value={values.metaTitle}
          onChange={(e) =>
            setValues({ ...values, metaTitle: e.target.value })
          }
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Meta description
        <textarea
          className={fieldClass}
          rows={3}
          required
          value={values.metaDescription}
          onChange={(e) =>
            setValues({ ...values, metaDescription: e.target.value })
          }
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Niche
        <input
          className={fieldClass}
          required
          value={values.niche}
          onChange={(e) => setValues({ ...values, niche: e.target.value })}
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Site URL
        <input
          className={fieldClass}
          type="url"
          required
          value={values.siteUrl}
          onChange={(e) => setValues({ ...values, siteUrl: e.target.value })}
        />
      </label>

      <ImageField
        siteId={siteId}
        kind="general"
        label="Header brand image"
        src={values.headerBrandImage}
        onSrcChange={(headerBrandImage) =>
          setValues({ ...values, headerBrandImage })
        }
      />

      <ImageField
        siteId={siteId}
        kind="general"
        label="Favicon"
        src={values.favicon}
        onSrcChange={(favicon) => setValues({ ...values, favicon })}
      />

      <label className="block text-sm font-medium text-slate-700">
        Affiliate disclosure
        <textarea
          className={fieldClass}
          rows={3}
          required
          value={values.affiliateDisclosure}
          onChange={(e) =>
            setValues({ ...values, affiliateDisclosure: e.target.value })
          }
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Newsletter title
          <input
            className={fieldClass}
            required
            value={values.newsletterTitle}
            onChange={(e) =>
              setValues({ ...values, newsletterTitle: e.target.value })
            }
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Newsletter button text
          <input
            className={fieldClass}
            required
            value={values.newsletterButtonText}
            onChange={(e) =>
              setValues({ ...values, newsletterButtonText: e.target.value })
            }
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Newsletter description
        <textarea
          className={fieldClass}
          rows={2}
          required
          value={values.newsletterDescription}
          onChange={(e) =>
            setValues({ ...values, newsletterDescription: e.target.value })
          }
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Newsletter success message
        <input
          className={fieldClass}
          required
          value={values.newsletterSuccessMessage}
          onChange={(e) =>
            setValues({
              ...values,
              newsletterSuccessMessage: e.target.value,
            })
          }
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Ads primary slot
          <input
            className={fieldClass}
            value={values.adsPrimary}
            onChange={(e) =>
              setValues({ ...values, adsPrimary: e.target.value })
            }
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Ads secondary slot
          <input
            className={fieldClass}
            value={values.adsSecondary}
            onChange={(e) =>
              setValues({ ...values, adsSecondary: e.target.value })
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

      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={values.researchScorePage}
          onChange={(e) =>
            setValues({ ...values, researchScorePage: e.target.checked })
          }
        />
        Enable Research Score page and labeling
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
        {pending ? "Saving…" : "Save site settings"}
      </button>
    </form>
  );
}
