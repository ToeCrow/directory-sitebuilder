"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { setProductStatusAction } from "./actions";

type StatusControlsProps = {
  productId: string;
  status: "draft" | "published";
  isTopPick: boolean;
};

export function StatusControls({
  productId,
  status,
  isTopPick,
}: StatusControlsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function setStatus(next: "draft" | "published") {
    setError(null);
    startTransition(async () => {
      const result = await setProductStatusAction(productId, next);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-1">
      <span
        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
          status === "published"
            ? "bg-green-50 text-green-800"
            : "bg-slate-100 text-slate-700"
        }`}
      >
        {status}
      </span>
      <div className="flex flex-wrap gap-2">
        {status === "draft" ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => setStatus("published")}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            Publish
          </button>
        ) : (
          <button
            type="button"
            disabled={pending || isTopPick}
            title={
              isTopPick
                ? "Remove from top picks before unpublishing"
                : undefined
            }
            onClick={() => setStatus("draft")}
            className="text-xs font-medium text-slate-600 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Unpublish
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
