import type { DirectoryBlogPost, DirectoryBlogSection } from "@/types/directory-blog";
import type { Article } from "@/types/site";
import type { TiptapDoc, TiptapMark, TiptapNode } from "@/types/tiptap";
import { getArticlePath } from "@/lib/paths";
import type { ArticleRoute } from "@/lib/site-config";
import { ARTICLE_SLUG_PATTERN } from "@/lib/slug";

export type { TiptapDoc, TiptapMark, TiptapNode };

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export function emptyTiptapDoc(): TiptapDoc {
  return { type: "doc", content: [{ type: "paragraph" }] };
}

export function isTiptapDoc(value: unknown): value is TiptapDoc {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as { type?: unknown; content?: unknown };
  if (candidate.type !== "doc") {
    return false;
  }
  return candidate.content === undefined || Array.isArray(candidate.content);
}

function walkNodes(nodes: TiptapNode[] | undefined, visit: (node: TiptapNode) => void) {
  for (const node of nodes ?? []) {
    visit(node);
    walkNodes(node.content, visit);
  }
}

export function collectInternalLinkIds(doc: TiptapDoc): string[] {
  const ids: string[] = [];
  const seen = new Set<string>();

  walkNodes(doc.content, (node) => {
    for (const mark of node.marks ?? []) {
      if (mark.type !== "internalLink") continue;
      const articleId = mark.attrs?.articleId;
      if (typeof articleId !== "string" || !isUuid(articleId) || seen.has(articleId)) {
        continue;
      }
      seen.add(articleId);
      ids.push(articleId);
    }
  });

  return ids;
}

export function collectImageSrcs(doc: TiptapDoc): string[] {
  const srcs: string[] = [];
  walkNodes(doc.content, (node) => {
    if (node.type !== "image") return;
    const src = node.attrs?.src;
    if (typeof src === "string" && src) {
      srcs.push(src);
    }
  });
  return srcs;
}

export function resolveInternalLinkHref(options: {
  articleId: string;
  articlesById: ReadonlyMap<string, { slug: string }>;
  publicBasePath: string;
  route: ArticleRoute;
}): string | null {
  const target = options.articlesById.get(options.articleId);
  if (!target) {
    return null;
  }
  return getArticlePath(options.publicBasePath, target.slug, options.route);
}

export function isUniqueArticleSlug(
  existingSlugs: readonly string[],
  slug: string,
  excludeSlug?: string,
): boolean {
  return !existingSlugs.some((value) => value === slug && value !== excludeSlug);
}

function textNode(text: string, marks?: TiptapMark[]): TiptapNode {
  return marks ? { type: "text", text, marks } : { type: "text", text };
}

function paragraphFromText(text: string, marks?: TiptapMark[]): TiptapNode {
  return {
    type: "paragraph",
    content: text ? [textNode(text, marks)] : [],
  };
}

/** Split `**bold**` and `[label](href)` into Tiptap text nodes with marks. */
export function inlineNodesFromMarkdown(
  text: string,
  articleIdsBySlug: ReadonlyMap<string, string> = new Map(),
): TiptapNode[] {
  const nodes: TiptapNode[] = [];
  const pattern = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(textNode(text.slice(lastIndex, match.index)));
    }

    if (match[1] !== undefined) {
      nodes.push(textNode(match[1], [{ type: "bold" }]));
    } else {
      const label = match[2] ?? "";
      const href = match[3] ?? "";
      const slug = articleSlugFromCtaPath(href);
      const articleId = slug ? articleIdsBySlug.get(slug) : undefined;
      if (articleId) {
        nodes.push(
          textNode(label, [{ type: "internalLink", attrs: { articleId } }]),
        );
      } else {
        nodes.push(textNode(label, [{ type: "link", attrs: { href } }]));
      }
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(textNode(text.slice(lastIndex)));
  }

  return nodes.length > 0 ? nodes : [];
}

function paragraphFromMarkdown(
  text: string,
  articleIdsBySlug: ReadonlyMap<string, string>,
): TiptapNode {
  const quoted = text.startsWith("> ");
  const raw = quoted ? text.slice(2) : text;
  const content = inlineNodesFromMarkdown(raw, articleIdsBySlug);
  const paragraph: TiptapNode = {
    type: "paragraph",
    content: content.length > 0 ? content : undefined,
  };
  if (quoted) {
    return { type: "blockquote", content: [paragraph] };
  }
  return paragraph;
}

export function articleSlugFromCtaPath(path: string): string | undefined {
  const trimmed = path.trim();
  const blogMatch = trimmed.match(/^\/blog\/([a-z0-9]+(?:-[a-z0-9]+)*)$/);
  if (blogMatch?.[1]) {
    return blogMatch[1];
  }
  if (ARTICLE_SLUG_PATTERN.test(trimmed)) {
    return trimmed;
  }
  return undefined;
}

function ctaParagraph(
  cta: NonNullable<DirectoryBlogSection["cta"]>,
  articleIdsBySlug: ReadonlyMap<string, string>,
): TiptapNode {
  const slug = articleSlugFromCtaPath(cta.path);
  const articleId = slug ? articleIdsBySlug.get(slug) : undefined;

  if (articleId) {
    return paragraphFromText(cta.label, [
      { type: "internalLink", attrs: { articleId } },
    ]);
  }

  return paragraphFromText(cta.label, [
    { type: "link", attrs: { href: cta.path } },
  ]);
}

export function directoryBlogPostToTiptapDoc(
  post: DirectoryBlogPost,
  articleIdsBySlug: ReadonlyMap<string, string> = new Map(),
): TiptapDoc {
  const content: TiptapNode[] = [];

  for (const section of post.sections) {
    content.push({
      type: "heading",
      attrs: { level: section.headingLevel === 3 ? 3 : 2 },
      content: [textNode(section.heading)],
    });

    const ctaAfter = section.cta?.afterParagraph ?? section.paragraphs.length;

    section.paragraphs.forEach((paragraph, index) => {
      content.push(paragraphFromMarkdown(paragraph, articleIdsBySlug));
      if (section.cta && index + 1 === ctaAfter) {
        content.push(ctaParagraph(section.cta, articleIdsBySlug));
      }
    });

    if (section.bullets && section.bullets.length > 0) {
      content.push({
        type: "bulletList",
        content: section.bullets.map((item) => ({
          type: "listItem",
          content: [paragraphFromMarkdown(item, articleIdsBySlug)],
        })),
      });
    }
  }

  return { type: "doc", content };
}

export function resolveRelatedArticles(options: {
  articles: readonly Article[];
  relatedArticleIds?: readonly string[];
  relatedSlugs?: readonly string[];
  excludeSlugs?: ReadonlySet<string>;
  excludeIds?: ReadonlySet<string>;
  limit?: number;
}): Article[] {
  const {
    articles,
    relatedArticleIds,
    relatedSlugs,
    excludeSlugs = new Set(),
    excludeIds = new Set(),
    limit = 4,
  } = options;

  const byId = new Map(
    articles.flatMap((article) => (article.id ? [[article.id, article] as const] : [])),
  );
  const bySlug = new Map(articles.map((article) => [article.slug, article]));
  const seen = new Set<string>();
  const resolved: Article[] = [];

  const push = (article: Article | undefined) => {
    if (!article) return;
    if (excludeSlugs.has(article.slug)) return;
    if (article.id && excludeIds.has(article.id)) return;
    const key = article.id ?? article.slug;
    if (seen.has(key) || seen.has(article.slug)) return;
    seen.add(key);
    seen.add(article.slug);
    resolved.push(article);
  };

  if (relatedArticleIds && relatedArticleIds.length > 0) {
    for (const id of relatedArticleIds) {
      push(byId.get(id));
      if (resolved.length >= limit) return resolved;
    }
    return resolved;
  }

  for (const slug of relatedSlugs ?? []) {
    push(bySlug.get(slug));
    if (resolved.length >= limit) return resolved;
  }

  return resolved;
}
