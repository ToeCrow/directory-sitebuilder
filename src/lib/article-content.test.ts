import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { DirectoryBlogPost } from "@/types/directory-blog";
import type { EditorialArticle } from "@/types/site";
import {
  articleSlugFromCtaPath,
  collectInternalLinkIds,
  directoryBlogPostToTiptapDoc,
  emptyTiptapDoc,
  isTiptapDoc,
  isUniqueArticleSlug,
  resolveInternalLinkHref,
  resolveRelatedArticles,
} from "./article-content";
import {
  articleCreateSchema,
  articleProductSectionCreateSchema,
  articleSlugSchema,
  articleUpdateSchema,
  internalLinkAttrsSchema,
} from "./admin/article-schema";
import { slugify } from "./slug";

const ARTICLE_A = "11111111-1111-4111-8111-111111111111";
const ARTICLE_B = "22222222-2222-4222-8222-222222222222";
const ARTICLE_C = "33333333-3333-4333-8333-333333333333";
const PRODUCT_ID = "44444444-4444-4444-8444-444444444444";

function editorial(overrides: Partial<EditorialArticle> = {}): EditorialArticle {
  return {
    kind: "editorial",
    title: "Post",
    slug: "post",
    intro: [],
    sections: [],
    ...overrides,
  };
}

describe("slugify", () => {
  it("turns a title into lowercase kebab-case", () => {
    assert.equal(slugify("Best Pillows for Neck Pain"), "best-pillows-for-neck-pain");
    assert.equal(slugify("  Why Can't I Sleep?  "), "why-can-t-i-sleep");
  });
});

describe("isTiptapDoc / emptyTiptapDoc", () => {
  it("accepts a doc node and rejects other values", () => {
    assert.equal(isTiptapDoc(emptyTiptapDoc()), true);
    assert.equal(isTiptapDoc({ type: "doc", content: [] }), true);
    assert.equal(isTiptapDoc({ type: "paragraph" }), false);
    assert.equal(isTiptapDoc(null), false);
    assert.equal(isTiptapDoc("doc"), false);
  });
});

describe("collectInternalLinkIds", () => {
  it("collects unique UUID articleIds from internalLink marks", () => {
    const ids = collectInternalLinkIds({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "See this",
              marks: [{ type: "internalLink", attrs: { articleId: ARTICLE_A } }],
            },
            {
              type: "text",
              text: " and that",
              marks: [{ type: "internalLink", attrs: { articleId: ARTICLE_B } }],
            },
            {
              type: "text",
              text: " again",
              marks: [{ type: "internalLink", attrs: { articleId: ARTICLE_A } }],
            },
          ],
        },
      ],
    });

    assert.deepEqual(ids, [ARTICLE_A, ARTICLE_B]);
  });

  it("ignores non-UUID attrs", () => {
    const ids = collectInternalLinkIds({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "legacy",
              marks: [{ type: "internalLink", attrs: { articleId: "not-a-uuid" } }],
            },
          ],
        },
      ],
    });
    assert.deepEqual(ids, []);
  });
});

describe("resolveInternalLinkHref", () => {
  it("builds a published article href from the site article route", () => {
    const href = resolveInternalLinkHref({
      articleId: ARTICLE_A,
      articlesById: new Map([[ARTICLE_A, { slug: "how-to-fall-asleep-fast" }]]),
      publicBasePath: "",
      route: "blog",
    });
    assert.equal(href, "/blog/how-to-fall-asleep-fast");
  });

  it("returns null when the target is missing (unpublished or unknown)", () => {
    const href = resolveInternalLinkHref({
      articleId: ARTICLE_A,
      articlesById: new Map(),
      publicBasePath: "/side-sleeper",
      route: "reviews",
    });
    assert.equal(href, null);
  });
});

describe("directoryBlogPostToTiptapDoc", () => {
  const post: DirectoryBlogPost = {
    slug: "why-waking-up",
    title: "Why waking up",
    excerpt: "Excerpt",
    metaTitle: "Why waking up",
    metaDescription: "Desc",
    publishedAt: "2026-08-26",
    intro: ["Intro"],
    relatedProductSlugs: [],
    relatedPostSlugs: [],
    sections: [
      {
        heading: "Normal waking",
        paragraphs: ["First paragraph.", "Second paragraph."],
        bullets: ["Keep a log"],
        cta: {
          label: "Read the tiredness post",
          path: "/blog/why-cant-i-sleep",
          afterParagraph: 1,
        },
      },
      {
        heading: "Support options",
        paragraphs: ["If you want to compare options."],
        cta: {
          label: "Explore sleep-support options",
          path: "/sleep",
        },
      },
    ],
  };

  it("converts known blog CTAs to internalLink marks", () => {
    const doc = directoryBlogPostToTiptapDoc(
      post,
      new Map([["why-cant-i-sleep", ARTICLE_B]]),
    );

    assert.equal(isTiptapDoc(doc), true);
    const ids = collectInternalLinkIds(doc);
    assert.deepEqual(ids, [ARTICLE_B]);

    const heading = doc.content?.[0];
    assert.equal(heading?.type, "heading");
    assert.equal(heading?.attrs?.level, 2);

    const cta = doc.content?.[2];
    assert.equal(cta?.type, "paragraph");
    assert.deepEqual(cta?.content?.[0]?.marks, [
      { type: "internalLink", attrs: { articleId: ARTICLE_B } },
    ]);
  });

  it("keeps catalog CTAs as regular links", () => {
    const doc = directoryBlogPostToTiptapDoc(post);
    const lastParagraph = doc.content?.at(-1);
    assert.deepEqual(lastParagraph?.content?.[0]?.marks, [
      { type: "link", attrs: { href: "/sleep" } },
    ]);
    assert.deepEqual(collectInternalLinkIds(doc), []);
  });
});

describe("articleSlugFromCtaPath", () => {
  it("reads a blog path or bare slug and ignores catalog paths", () => {
    assert.equal(articleSlugFromCtaPath("/blog/how-to-fall-asleep-fast"), "how-to-fall-asleep-fast");
    assert.equal(articleSlugFromCtaPath("how-to-fall-asleep-fast"), "how-to-fall-asleep-fast");
    assert.equal(articleSlugFromCtaPath("/sleep"), undefined);
  });
});

describe("isUniqueArticleSlug", () => {
  it("is unique per site except when editing the same slug", () => {
    assert.equal(isUniqueArticleSlug(["a", "b"], "c"), true);
    assert.equal(isUniqueArticleSlug(["a", "b"], "a"), false);
    assert.equal(isUniqueArticleSlug(["a", "b"], "a", "a"), true);
  });
});

describe("Zod article schemas", () => {
  it("accepts kebab slugs and UUID internal-link attrs", () => {
    assert.equal(articleSlugSchema.safeParse("best-pillows").success, true);
    assert.equal(articleSlugSchema.safeParse("Best Pillows").success, false);
    assert.equal(
      internalLinkAttrsSchema.safeParse({ articleId: ARTICLE_A }).success,
      true,
    );
    assert.equal(
      internalLinkAttrsSchema.safeParse({ articleId: "not-a-uuid" }).success,
      false,
    );
  });

  it("requires title, kebab slug, site, and kind on create", () => {
    const parsed = articleCreateSchema.safeParse({
      siteId: ARTICLE_C,
      kind: "editorial",
      title: "New post",
      slug: "new-post",
    });
    assert.equal(parsed.success, true);

    assert.equal(
      articleCreateSchema.safeParse({
        siteId: ARTICLE_C,
        kind: "editorial",
        title: "New post",
        slug: "New Post",
      }).success,
      false,
    );
  });

  it("allows empty research notes on editorial update", () => {
    const parsed = articleUpdateSchema.safeParse({
      title: "Updated",
      slug: "updated",
      excerpt: null,
      introText: "Hello",
      researchNoteTitle: "",
      researchNoteContent: "",
      author: null,
      ogImageSrc: null,
      ogImageAlt: null,
      status: "draft",
      publishedAt: null,
      updatedAtContent: null,
    });
    assert.equal(parsed.success, true);
  });

  it("requires productId when creating a product section", () => {
    const valid = articleProductSectionCreateSchema.safeParse({
      heading: "Saatva Rx",
      intro: null,
      imageSrc: null,
      imageAlt: null,
      whatItIs: "A firm mattress.",
      whyItEarnsASpotText: "Support",
      whereItFallsShortText: "Price",
      bestFor: "Back pain",
      skipIf: "Soft feel",
      sortOrder: 1,
      productId: PRODUCT_ID,
    });
    assert.equal(valid.success, true);

    const missing = articleProductSectionCreateSchema.safeParse({
      heading: "Saatva Rx",
      intro: null,
      imageSrc: null,
      imageAlt: null,
      whatItIs: "A firm mattress.",
      whyItEarnsASpotText: "Support",
      whereItFallsShortText: "Price",
      bestFor: "Back pain",
      skipIf: "Soft feel",
      sortOrder: 1,
    });
    assert.equal(missing.success, false);
  });
});

describe("resolveRelatedArticles", () => {
  const articles = [
    editorial({ id: ARTICLE_A, slug: "one", title: "One" }),
    editorial({ id: ARTICLE_B, slug: "two", title: "Two" }),
    editorial({ id: ARTICLE_C, slug: "three", title: "Three" }),
  ];

  it("resolves ids first and ignores legacy slugs when ids are present", () => {
    const related = resolveRelatedArticles({
      articles,
      relatedArticleIds: [ARTICLE_C, ARTICLE_A],
      relatedSlugs: ["two"],
    });
    assert.deepEqual(
      related.map((article) => article.slug),
      ["three", "one"],
    );
  });

  it("falls back to legacy slugs when ids are absent", () => {
    const related = resolveRelatedArticles({
      articles,
      relatedSlugs: ["two", "missing", "one"],
    });
    assert.deepEqual(
      related.map((article) => article.slug),
      ["two", "one"],
    );
  });
});
