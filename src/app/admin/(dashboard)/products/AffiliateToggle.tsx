"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { setProductAffiliateAction } from "./actions";

type AffiliateToggleProps = {
  productId: string;
  checked: boolean;
};

export function AffiliateToggle({ productId, checked }: AffiliateToggleProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <label className="inline-flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={checked}
          disabled={pending}
          onChange={(event) => {
            const next = event.target.checked;
            setError(null);
            startTransition(async () => {
              const result = await setProductAffiliateAction(productId, next);
              if (!result.ok) {
                setError(result.error);
                return;
              }
              router.refresh();
            });
          }}
        />
        Active
      </label>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
