"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition, type FormEvent } from "react";
import type { AdminArticleProductSection } from "@/lib/admin/articles";
import { arrayToLines } from "@/lib/admin/lines";
import { slugify } from "@/lib/slug";
import { ImageField } from "@/components/admin/ImageField";
import { createProductAction } from "../../products/actions";
import {
  addArticleProductSectionAction,
  deleteArticleProductSectionAction,
  updateArticleProductSectionAction,
} from "../actions";

const fieldClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

export type ArticleProductOption = {
  id: string;
  name: string;
  slug: string;
  status: "draft" | "published";
};

type SectionFormValues = {
  productId: string;
  heading: string;
  intro: string;
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
    productId: section.productId ?? "",
    heading: section.heading,
    intro: section.intro ?? "",
    whatItIs: section.whatItIs,
    whyItEarnsASpotText: arrayToLines(section.whyItEarnsASpot),
    whereItFallsShortText: arrayToLines(section.whereItFallsShort),
    bestFor: section.bestFor,
    skipIf: section.skipIf,
    sortOrder: section.sortOrder,
  };
}

function ProductSelect({
  products,
  value,
  onChange,
}: {
  products: ArticleProductOption[];
  value: string;
  onChange: (productId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((product) => {
      if (!needle) return true;
      return (
        product.name.toLowerCase().includes(needle) ||
        product.slug.toLowerCase().includes(needle)
      );
    });
  }, [products, query]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        Product
        <input
          className={fieldClass}
          placeholder="Search existing products"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <select
        className={fieldClass}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Select a product</option>
        {matches.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name}
            {product.status === "draft" ? " (draft)" : ""}
          </option>
        ))}
      </select>
    </div>
  );
}

function InFlowProductCreate({
  siteId,
  nextComparisonRank,
  nextDirectorySortOrder,
  onCreated,
}: {
  siteId: string;
  nextComparisonRank: number;
  nextDirectorySortOrder: number;
  onCreated: (product: ArticleProductOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [values, setValues] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    bestFor: "",
    priceFrom: "See offer",
    affiliateUrl: "",
    imageSrc: "",
    imageAlt: "",
  });

  function createDraft() {
    if (
      !values.name.trim() ||
      !values.slug.trim() ||
      !values.shortDescription.trim() ||
      !values.bestFor.trim() ||
      !values.priceFrom.trim() ||
      !values.affiliateUrl.trim()
    ) {
      setError("Fill in name, slug, description, best for, price, and URL.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await createProductAction({
        siteId,
        name: values.name,
        slug: values.slug,
        shortDescription: values.shortDescription,
        bestFor: values.bestFor,
        priceFrom: values.priceFrom,
        featuresText: "",
        prosText: "",
        consText: "",
        affiliateUrl: values.affiliateUrl,
        hasAffiliatePartnership: false,
        badge: null,
        comparisonRank: nextComparisonRank,
        directorySortOrder: nextDirectorySortOrder,
        status: "draft",
        imageSrc: values.imageSrc || null,
        imageAlt: values.imageAlt || values.name || null,
      });
      if (!result.ok || !result.productId) {
        setError(result.ok ? "Could not create product." : result.error);
        return;
      }
      onCreated({
        id: result.productId,
        name: values.name,
        slug: values.slug,
        status: "draft",
      });
      setOpen(false);
      setValues({
        name: "",
        slug: "",
        shortDescription: "",
        bestFor: "",
        priceFrom: "See offer",
        affiliateUrl: "",
        imageSrc: "",
        imageAlt: "",
      });
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        className="text-sm font-medium text-blue-600 hover:text-blue-700"
        onClick={() => setOpen(true)}
      >
        Create new product
      </button>
    );
  }

  return (
    <div
      className="space-y-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4"
      onKeyDown={(event) => {
        if (
          event.key === "Enter" &&
          event.target instanceof HTMLInputElement
        ) {
          event.preventDefault();
          event.stopPropagation();
          createDraft();
        }
      }}
    >
      <p className="text-sm font-semibold text-slate-900">
        Create draft product
      </p>
      <p className="text-xs text-slate-500">
        Saved as draft so the public hub page stays unpublished.
      </p>
      <label className="block text-sm font-medium text-slate-700">
        Name
        <input
          className={fieldClass}
          value={values.name}
          onChange={(event) => {
            const name = event.target.value;
            setValues({
              ...values,
              name,
              slug: slugTouched ? values.slug : slugify(name),
            });
          }}
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Slug
        <input
          className={fieldClass}
          value={values.slug}
          onChange={(event) => {
            setSlugTouched(true);
            setValues({ ...values, slug: event.target.value });
          }}
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Short description
        <textarea
          className={fieldClass}
          rows={2}
          value={values.shortDescription}
          onChange={(event) =>
            setValues({ ...values, shortDescription: event.target.value })
          }
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Best for
        <input
          className={fieldClass}
          value={values.bestFor}
          onChange={(event) =>
            setValues({ ...values, bestFor: event.target.value })
          }
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Price from
        <input
          className={fieldClass}
          value={values.priceFrom}
          onChange={(event) =>
            setValues({ ...values, priceFrom: event.target.value })
          }
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Affiliate or product URL
        <input
          className={fieldClass}
          type="url"
          value={values.affiliateUrl}
          onChange={(event) =>
            setValues({ ...values, affiliateUrl: event.target.value })
          }
        />
      </label>
      <ImageField
        siteId={siteId}
        kind="products"
        label="Image"
        src={values.imageSrc}
        alt={values.imageAlt}
        showAlt
        onSrcChange={(imageSrc) => setValues({ ...values, imageSrc })}
        onAltChange={(imageAlt) => setValues({ ...values, imageAlt })}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={createDraft}
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {pending ? "Creating…" : "Create draft"}
        </button>
        <button
          type="button"
          className="text-sm text-slate-600"
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function SectionFields({
  values,
  products,
  onChange,
  onProductCreated,
  siteId,
  nextComparisonRank,
  nextDirectorySortOrder,
}: {
  values: SectionFormValues;
  products: ArticleProductOption[];
  onChange: (values: SectionFormValues) => void;
  onProductCreated: (product: ArticleProductOption) => void;
  siteId: string;
  nextComparisonRank: number;
  nextDirectorySortOrder: number;
}) {
  const selected = products.find((product) => product.id === values.productId);

  return (
    <div className="space-y-4">
      <ProductSelect
        products={products}
        value={values.productId}
        onChange={(productId) => {
          const product = products.find((item) => item.id === productId);
          onChange({
            ...values,
            productId,
            heading: values.heading || product?.name || "",
          });
        }}
      />
      <InFlowProductCreate
        siteId={siteId}
        nextComparisonRank={nextComparisonRank}
        nextDirectorySortOrder={nextDirectorySortOrder}
        onCreated={(product) => {
          onProductCreated(product);
          onChange({
            ...values,
            productId: product.id,
            heading: values.heading || product.name,
          });
        }}
      />
      {selected && (
        <p className="text-xs text-slate-500">
          Using central product data for {selected.name}
          {selected.status === "draft" ? " (draft, hub unpublished)" : ""}.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Heading / badge text
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
        Why we picked it (one per line)
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
  products,
  siteId,
  nextComparisonRank,
  nextDirectorySortOrder,
  onProductCreated,
}: {
  section: AdminArticleProductSection;
  products: ArticleProductOption[];
  siteId: string;
  nextComparisonRank: number;
  nextDirectorySortOrder: number;
  onProductCreated: (product: ArticleProductOption) => void;
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
        imageSrc: null,
        imageAlt: null,
        productId: values.productId || null,
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
      <SectionFields
        values={values}
        products={products}
        onChange={setValues}
        onProductCreated={onProductCreated}
        siteId={siteId}
        nextComparisonRank={nextComparisonRank}
        nextDirectorySortOrder={nextDirectorySortOrder}
      />
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
  productId: "",
  heading: "",
  intro: "",
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
  products,
  siteId,
  nextComparisonRank,
  nextDirectorySortOrder,
  onProductCreated,
}: {
  articleId: string;
  nextSortOrder: number;
  products: ArticleProductOption[];
  siteId: string;
  nextComparisonRank: number;
  nextDirectorySortOrder: number;
  onProductCreated: (product: ArticleProductOption) => void;
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
        imageSrc: null,
        imageAlt: null,
        productId: values.productId,
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
      <h3 className="text-sm font-semibold text-slate-900">Add review product</h3>
      <SectionFields
        values={values}
        products={products}
        onChange={setValues}
        onProductCreated={onProductCreated}
        siteId={siteId}
        nextComparisonRank={nextComparisonRank}
        nextDirectorySortOrder={nextDirectorySortOrder}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add product"}
      </button>
    </form>
  );
}

export function ArticleProductSectionsEditor({
  articleId,
  siteId,
  sections,
  products,
  nextComparisonRank,
  nextDirectorySortOrder,
}: {
  articleId: string;
  siteId: string;
  sections: AdminArticleProductSection[];
  products: ArticleProductOption[];
  nextComparisonRank: number;
  nextDirectorySortOrder: number;
}) {
  const [extraProducts, setExtraProducts] = useState<ArticleProductOption[]>([]);
  const allProducts = [...products, ...extraProducts].filter(
    (product, index, list) =>
      list.findIndex((item) => item.id === product.id) === index,
  );
  const nextSortOrder =
    sections.reduce((max, section) => Math.max(max, section.sortOrder), 0) + 1;

  function onProductCreated(product: ArticleProductOption) {
    setExtraProducts((current) => [...current, product]);
  }

  return (
    <div className="max-w-3xl space-y-6">
      {sections.length === 0 && (
        <p className="text-sm text-slate-600">
          No review products yet. Select an existing product or create a draft.
        </p>
      )}
      {sections.map((section) => (
        <ExistingSectionForm
          key={section.id}
          section={section}
          products={allProducts}
          siteId={siteId}
          nextComparisonRank={nextComparisonRank}
          nextDirectorySortOrder={nextDirectorySortOrder}
          onProductCreated={onProductCreated}
        />
      ))}
      <AddSectionForm
        articleId={articleId}
        nextSortOrder={nextSortOrder}
        products={allProducts}
        siteId={siteId}
        nextComparisonRank={nextComparisonRank}
        nextDirectorySortOrder={nextDirectorySortOrder}
        onProductCreated={onProductCreated}
      />
    </div>
  );
}
