import type { ReactNode } from "react";
import Image from "next/image";
import { TrackedLink } from "@/components/TrackedLink";
import type { Article } from "@/types/site";
import type { TiptapDoc, TiptapMark, TiptapNode } from "@/types/tiptap";
import { resolveInternalLinkHref } from "@/lib/article-content";
import { getArticleConfig, getSiteTheme, type ArticleRoute } from "@/lib/site-config";

type TiptapArticleBodyProps = {
  doc: TiptapDoc;
  siteSlug: string;
  publicBasePath: string;
  articles: Article[];
  sourceArticleId?: string;
};

type BodyTheme = {
  paragraph: string;
  heading: string;
  list: string;
  link: string;
};

function bodyTheme(siteSlug: string): BodyTheme {
  const theme = getSiteTheme(siteSlug);
  if (theme === "editorial-dark") {
    return {
      paragraph: "mt-4 text-base leading-relaxed text-fwn-sand",
      heading: "mt-10 text-2xl font-semibold tracking-tight text-fwn-ivory",
      list: "mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-fwn-sand",
      link: "font-medium text-fwn-gold hover:text-fwn-brass",
    };
  }
  if (theme === "paper") {
    return {
      paragraph: "mt-4 text-base leading-relaxed text-ss-ink/80",
      heading: "mt-10 text-2xl font-bold tracking-tight text-ss-navy",
      list: "mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-ss-ink/80",
      link: "font-medium text-ss-navy hover:text-ss-blue",
    };
  }
  return {
    paragraph: "mt-4 text-base leading-relaxed text-slate-700",
    heading: "mt-10 text-2xl font-bold tracking-tight text-slate-900",
    list: "mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-slate-700",
    link: "font-medium text-blue-600 hover:text-blue-700",
  };
}

function markOf(node: TiptapNode, type: string): TiptapMark | undefined {
  return node.marks?.find((mark) => mark.type === type);
}

function TextInline({
  node,
  articlesById,
  publicBasePath,
  route,
  classes,
  sourceArticleId,
}: {
  node: TiptapNode;
  articlesById: Map<string, { slug: string }>;
  publicBasePath: string;
  route: ArticleRoute;
  classes: BodyTheme;
  sourceArticleId?: string;
}) {
  const text = node.text ?? "";
  if (!text) return null;

  const internal = markOf(node, "internalLink");
  const articleId =
    typeof internal?.attrs?.articleId === "string"
      ? internal.attrs.articleId
      : null;
  const href = articleId
    ? resolveInternalLinkHref({
        articleId,
        articlesById,
        publicBasePath,
        route,
      })
    : null;

  const external = markOf(node, "link");
  const externalHref =
    typeof external?.attrs?.href === "string" ? external.attrs.href : null;

  let content: ReactNode = text;
  if (markOf(node, "bold")) content = <strong>{content}</strong>;
  if (markOf(node, "italic")) content = <em>{content}</em>;

  if (href && articleId) {
    return (
      <TrackedLink
        href={href}
        className={classes.link}
        placement="tiptap-internal-link"
        target={{ type: "article", id: articleId }}
        source={
          sourceArticleId
            ? { type: "article", id: sourceArticleId }
            : undefined
        }
        label={text}
      >
        {content}
      </TrackedLink>
    );
  }
  if (externalHref) {
    const isExternal = /^https?:\/\//.test(externalHref);
    return (
      <TrackedLink
        href={externalHref}
        className={classes.link}
        placement="tiptap-external-link"
        target={{ type: isExternal ? "external" : "path" }}
        source={
          sourceArticleId
            ? { type: "article", id: sourceArticleId }
            : undefined
        }
        external={isExternal}
        label={text}
      >
        {content}
      </TrackedLink>
    );
  }
  return <>{content}</>;
}

function renderNodes(
  nodes: TiptapNode[] | undefined,
  ctx: {
    articlesById: Map<string, { slug: string }>;
    publicBasePath: string;
    route: ArticleRoute;
    classes: BodyTheme;
    sourceArticleId?: string;
  },
): ReactNode {
  return nodes?.map((node, index) => {
    const key = `${node.type}-${index}`;
    if (node.type === "text") {
      return <TextInline key={key} node={node} {...ctx} />;
    }
    if (node.type === "hardBreak") {
      return <br key={key} />;
    }
    if (node.type === "paragraph") {
      return (
        <p key={key} className={ctx.classes.paragraph}>
          {renderNodes(node.content, ctx)}
        </p>
      );
    }
    if (node.type === "heading") {
      const level = node.attrs?.level === 3 ? 3 : 2;
      const Tag = level === 3 ? "h3" : "h2";
      return (
        <Tag key={key} className={ctx.classes.heading}>
          {renderNodes(node.content, ctx)}
        </Tag>
      );
    }
    if (node.type === "bulletList") {
      return (
        <ul key={key} className={ctx.classes.list}>
          {renderNodes(node.content, ctx)}
        </ul>
      );
    }
    if (node.type === "orderedList") {
      return (
        <ol key={key} className={`${ctx.classes.list} list-decimal`}>
          {renderNodes(node.content, ctx)}
        </ol>
      );
    }
    if (node.type === "listItem") {
      return <li key={key}>{renderNodes(node.content, ctx)}</li>;
    }
    if (node.type === "blockquote") {
      return (
        <blockquote key={key} className="mt-4 border-l-2 pl-4">
          {renderNodes(node.content, ctx)}
        </blockquote>
      );
    }
    if (node.type === "image") {
      const src = typeof node.attrs?.src === "string" ? node.attrs.src : "";
      const alt = typeof node.attrs?.alt === "string" ? node.attrs.alt : "";
      if (!src) return null;
      return (
        <figure key={key} className="mt-6 overflow-hidden">
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            className="h-auto w-full"
          />
        </figure>
      );
    }
    return <div key={key}>{renderNodes(node.content, ctx)}</div>;
  });
}

export function TiptapArticleBody({
  doc,
  siteSlug,
  publicBasePath,
  articles,
  sourceArticleId,
}: TiptapArticleBodyProps) {
  const route = getArticleConfig(siteSlug)?.route ?? "reviews";
  const articlesById = new Map(
    articles.flatMap((article) =>
      article.id ? [[article.id, { slug: article.slug }] as const] : [],
    ),
  );

  return (
    <div>
      {renderNodes(doc.content, {
        articlesById,
        publicBasePath,
        route,
        classes: bodyTheme(siteSlug),
        sourceArticleId,
      })}
    </div>
  );
}
