"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type {
  AdminTopPickItem,
  AvailableProduct,
} from "@/lib/admin/top-picks";
import { addTopPickAction, removeTopPickAction, updateTopPickAction } from "./actions";

type TopPicksManagerProps = {
  siteId: string;
  topPicks: AdminTopPickItem[];
  availableProducts: AvailableProduct[];
};

const fieldClass =
  "rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

function TopPickRow({
  topPick,
}: {
  topPick: AdminTopPickItem;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState(topPick.sortOrder);
  const [badgeOverride, setBadgeOverride] = useState(
    topPick.badgeOverride ?? "",
  );

  function onSave() {
    setError(null);
    startTransition(async () => {
      const result = await updateTopPickAction(topPick.id, {
        sortOrder: Number(sortOrder),
        badgeOverride: badgeOverride || null,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function onRemove() {
    if (!confirm(`Remove ${topPick.productName} from top picks?`)) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await removeTopPickAction(topPick.id);
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
        <p className="font-medium text-slate-900">{topPick.productName}</p>
        <p className="text-xs text-slate-500">/{topPick.productSlug}</p>
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          min={1}
          className={`${fieldClass} w-20`}
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
        />
      </td>
      <td className="px-4 py-3">
        <input
          className={`${fieldClass} w-40`}
          placeholder="(none)"
          value={badgeOverride}
          onChange={(e) => setBadgeOverride(e.target.value)}
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
            onClick={onRemove}
            className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            Remove
          </button>
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </td>
    </tr>
  );
}

export function TopPicksManager({
  siteId,
  topPicks,
  availableProducts,
}: TopPicksManagerProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState(
    availableProducts[0]?.id ?? "",
  );

  function onAdd() {
    if (!selectedProductId) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await addTopPickAction(siteId, selectedProductId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">
          Add a top pick
        </h2>
        {availableProducts.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">
            No published products are available to add. Publish a product
            first, or all published products are already top picks.
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <select
              className={fieldClass}
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              {availableProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={pending}
              onClick={onAdd}
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {topPicks.length === 0 ? (
        <p className="mt-6 text-sm text-slate-600">
          No top picks yet for this site.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Sort order</th>
                <th className="px-4 py-3 font-medium">Badge override</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topPicks.map((topPick) => (
                <TopPickRow
                  key={topPick.id}
                  topPick={topPick}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
