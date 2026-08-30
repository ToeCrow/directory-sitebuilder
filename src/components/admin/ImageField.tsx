"use client";

import { useEffect, useRef, useState } from "react";
import type { MediaKind } from "@/lib/media";
import { isSupportedImageReference } from "@/lib/media";

export type ImageFieldValue = {
  src: string;
  alt: string;
};

type MediaItem = {
  id: string;
  publicUrl: string;
  originalFilename: string;
  width: number;
  height: number;
  altText: string | null;
};

type ImageFieldProps = {
  siteId: string;
  kind: MediaKind;
  label: string;
  src: string;
  onSrcChange: (src: string) => void;
  alt?: string;
  onAltChange?: (alt: string) => void;
  showAlt?: boolean;
  allowPasteUrl?: boolean;
};

export function ImageField({
  siteId,
  kind,
  label,
  src,
  onSrcChange,
  alt = "",
  onAltChange,
  showAlt = false,
  allowPasteUrl = true,
}: ImageFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [choosing, setChoosing] = useState(false);
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [pasteUrl, setPasteUrl] = useState("");

  useEffect(() => {
    if (!choosing) return;
    let cancelled = false;
    fetch(`/api/admin/media?siteId=${encodeURIComponent(siteId)}`)
      .then(async (response) => {
        const body = (await response.json()) as {
          items?: MediaItem[];
          error?: string;
        };
        if (!response.ok) {
          throw new Error(body.error ?? "Could not load images.");
        }
        if (!cancelled) {
          setItems(body.items ?? []);
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setError(
            loadError instanceof Error ? loadError.message : "Could not load images.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [choosing, siteId]);

  async function uploadFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.set("siteId", siteId);
      form.set("kind", kind);
      form.set("file", file);
      if (alt) form.set("altText", alt);
      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: form,
      });
      const body = (await response.json()) as {
        publicUrl?: string;
        altText?: string | null;
        error?: string;
      };
      if (!response.ok || !body.publicUrl) {
        throw new Error(body.error ?? "Upload failed.");
      }
      onSrcChange(body.publicUrl);
      if (onAltChange && !alt && body.altText) {
        onAltChange(body.altText);
      }
      setChoosing(false);
    } catch (uploadError: unknown) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed.",
      );
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function applyPastedUrl() {
    const next = pasteUrl.trim();
    if (!next) return;
    if (!isSupportedImageReference(next)) {
      setError("That is not a valid image path or URL.");
      return;
    }
    setError(null);
    onSrcChange(next);
    setPasteUrl("");
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-700">{label}</p>
      {src ? (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          {/* Native img: admin preview must accept local paths, Storage URLs, and pasted hosts. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt || ""}
            className="max-h-48 w-full object-contain"
          />
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 px-3 py-8 text-center text-sm text-slate-500">
          No image
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void uploadFile(file);
          }}
        />
        <button
          type="button"
          disabled={uploading || !siteId}
          className="rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? "Uploading…" : "Upload new"}
        </button>
        <button
          type="button"
          disabled={uploading || !siteId}
          className="rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          onClick={() => {
            setError(null);
            setItems(null);
            setChoosing((open) => !open);
          }}
        >
          Choose existing
        </button>
        {src ? (
          <button
            type="button"
            disabled={uploading}
            className="rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            onClick={() => {
              onSrcChange("");
              setChoosing(false);
            }}
          >
            Remove
          </button>
        ) : null}
      </div>

      {showAlt && onAltChange ? (
        <label className="block text-sm font-medium text-slate-700">
          Alt text
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={alt}
            onChange={(event) => onAltChange(event.target.value)}
          />
        </label>
      ) : null}

      {allowPasteUrl ? (
        <div className="flex flex-wrap items-end gap-2">
          <label className="block min-w-64 flex-1 text-xs font-medium text-slate-600">
            Paste image URL
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="/sites/… or https://…"
              value={pasteUrl}
              onChange={(event) => setPasteUrl(event.target.value)}
            />
          </label>
          <button
            type="button"
            className="rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            onClick={applyPastedUrl}
          >
            Use URL
          </button>
        </div>
      ) : null}

      {choosing ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="mb-2 text-xs text-slate-600">
            Existing uploads for this site
          </p>
          {items === null ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-slate-500">No uploads yet.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="w-full overflow-hidden rounded border border-slate-200 bg-white text-left hover:border-blue-400"
                    onClick={() => {
                      onSrcChange(item.publicUrl);
                      if (onAltChange && !alt && item.altText) {
                        onAltChange(item.altText);
                      }
                      setChoosing(false);
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.publicUrl}
                      alt={item.altText || item.originalFilename}
                      className="h-20 w-full object-contain bg-slate-50"
                    />
                    <span className="block truncate px-2 py-1 text-[11px] text-slate-600">
                      {item.originalFilename}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
