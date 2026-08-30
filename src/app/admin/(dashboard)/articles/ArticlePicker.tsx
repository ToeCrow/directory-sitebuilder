"use client";

import { useMemo, useState } from "react";
import type { AdminArticlePickerItem } from "@/lib/admin/articles";

type ArticlePickerProps = {
  articles: AdminArticlePickerItem[];
  selectedIds: string[];
  onSelect: (article: AdminArticlePickerItem) => void;
  multiple?: boolean;
  label?: string;
};

export function ArticlePicker({
  articles,
  selectedIds,
  onSelect,
  multiple = false,
  label = "Choose article",
}: ArticlePickerProps) {
  const [query, setQuery] = useState("");
  const selected = new Set(selectedIds);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return articles.filter((article) => {
      if (!needle) return true;
      return (
        article.title.toLowerCase().includes(needle) ||
        article.slug.toLowerCase().includes(needle)
      );
    });
  }, [articles, query]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        <input
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          placeholder="Search by title"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <ul className="max-h-56 overflow-y-auto rounded-lg border border-slate-200 bg-white">
        {matches.length === 0 && (
          <li className="px-3 py-2 text-sm text-slate-500">No articles match.</li>
        )}
        {matches.map((article) => {
          const isSelected = selected.has(article.id);
          return (
            <li key={article.id}>
              <button
                type="button"
                onClick={() => onSelect(article)}
                className={`flex w-full items-start justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                  isSelected ? "bg-blue-50 text-blue-800" : "text-slate-800"
                }`}
              >
                <span>
                  <span className="block font-medium">{article.title}</span>
                  <span className="block text-xs text-slate-500">
                    /{article.slug}
                  </span>
                </span>
                {isSelected && (
                  <span className="text-xs font-semibold">
                    {multiple ? "Selected" : "Current"}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
