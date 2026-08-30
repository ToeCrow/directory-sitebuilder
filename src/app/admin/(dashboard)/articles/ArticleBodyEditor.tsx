"use client";

import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import type { AdminArticlePickerItem } from "@/lib/admin/articles";
import type { TiptapDoc } from "@/lib/article-content";
import { InternalLink } from "@/lib/tiptap-internal-link";
import { ImageField } from "@/components/admin/ImageField";
import { ArticlePicker } from "./ArticlePicker";

type ArticleBodyEditorProps = {
  initial: TiptapDoc;
  articles: AdminArticlePickerItem[];
  siteId: string;
  onChange: (doc: TiptapDoc) => void;
};

const toolbarButton =
  "rounded border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40";

export function ArticleBodyEditor({
  initial,
  articles,
  siteId,
  onChange,
}: ArticleBodyEditorProps) {
  const [pickingInternal, setPickingInternal] = useState(false);
  const [pickingImage, setPickingImage] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [externalHref, setExternalHref] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      InternalLink,
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
    ],
    content: initial,
    onUpdate: ({ editor: next }) => {
      onChange(next.getJSON() as TiptapDoc);
    },
    editorProps: {
      attributes: {
        class:
          "tiptap min-h-64 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm leading-relaxed text-slate-900 focus:outline-none",
      },
    },
  });

  if (!editor) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 px-3 py-8 text-sm text-slate-500">
        Loading editor…
      </div>
    );
  }

  function applyExternalLink() {
    const href = externalHref.trim();
    if (!href || !editor) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setExternalHref("");
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={toolbarButton}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          type="button"
          className={toolbarButton}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          type="button"
          className={toolbarButton}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>
        <button
          type="button"
          className={toolbarButton}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </button>
        <button
          type="button"
          className={toolbarButton}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          List
        </button>
        <button
          type="button"
          className={toolbarButton}
          onClick={() => editor.chain().focus().undo().run()}
        >
          Undo
        </button>
        <button
          type="button"
          className={toolbarButton}
          onClick={() => editor.chain().focus().redo().run()}
        >
          Redo
        </button>
        <button
          type="button"
          className={toolbarButton}
          onClick={() => setPickingInternal((open) => !open)}
        >
          Internal link
        </button>
        <button
          type="button"
          className={toolbarButton}
          onClick={() => editor.chain().focus().unsetMark("internalLink").unsetLink().run()}
        >
          Unlink
        </button>
        <button
          type="button"
          className={toolbarButton}
          onClick={() => setPickingImage((open) => !open)}
        >
          Insert image
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <label className="block min-w-64 flex-1 text-xs font-medium text-slate-600">
          External link
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="https://example.com"
            value={externalHref}
            onChange={(event) => setExternalHref(event.target.value)}
          />
        </label>
        <button type="button" className={toolbarButton} onClick={applyExternalLink}>
          Apply link
        </button>
      </div>

      {pickingImage && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <ImageField
            siteId={siteId}
            kind="articles"
            label="Article image"
            src={imageSrc}
            alt={imageAlt}
            showAlt
            onSrcChange={setImageSrc}
            onAltChange={setImageAlt}
          />
          <button
            type="button"
            className={`${toolbarButton} mt-3`}
            disabled={!imageSrc}
            onClick={() => {
              if (!imageSrc) return;
              editor
                .chain()
                .focus()
                .setImage({ src: imageSrc, alt: imageAlt || undefined })
                .run();
              setImageSrc("");
              setImageAlt("");
              setPickingImage(false);
            }}
          >
            Insert into article
          </button>
        </div>
      )}

      {pickingInternal && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="mb-2 text-xs text-slate-600">
            Select text first, then pick the article to link. The public URL is
            generated from the site route.
          </p>
          <ArticlePicker
            articles={articles}
            selectedIds={[]}
            label="Internal article"
            onSelect={(article) => {
              editor
                .chain()
                .focus()
                .extendMarkRange("internalLink")
                .setMark("internalLink", { articleId: article.id })
                .run();
              setPickingInternal(false);
            }}
          />
        </div>
      )}

      <EditorContent editor={editor} />
      <style>{`
        .tiptap ul { list-style: disc; padding-left: 1.25rem; margin: 0.5rem 0; }
        .tiptap ol { list-style: decimal; padding-left: 1.25rem; margin: 0.5rem 0; }
        .tiptap h2 { font-size: 1.25rem; font-weight: 700; margin: 1rem 0 0.4rem; }
        .tiptap h3 { font-size: 1.1rem; font-weight: 600; margin: 0.85rem 0 0.35rem; }
        .tiptap p { margin: 0.4rem 0; }
        .tiptap a, .tiptap [data-internal-article-id] { color: #1d4ed8; text-decoration: underline; }
        .tiptap img { max-width: 100%; height: auto; margin: 0.75rem 0; }
      `}</style>
    </div>
  );
}
