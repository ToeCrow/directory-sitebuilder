import type { Article } from "@/types/site";

export type ArticlePreviewImage = {
  src: string;
  alt: string;
};

const PREVIEW_BLURB_MAX_CHARS = 340;

/** Opening copy for listing cards — prefers intro over short excerpt. */
export function getArticlePreviewBlurb(article: Article): string | undefined {
  const fromIntro = article.intro.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  const source = fromIntro || article.excerpt?.trim();
  if (!source) {
    return undefined;
  }

  if (source.length <= PREVIEW_BLURB_MAX_CHARS) {
    return source;
  }

  const sliced = source.slice(0, PREVIEW_BLURB_MAX_CHARS);
  const lastSpace = sliced.lastIndexOf(" ");
  const cut = lastSpace > PREVIEW_BLURB_MAX_CHARS * 0.6 ? sliced.slice(0, lastSpace) : sliced;
  return `${cut.replace(/[.,;:!?\s]+$/, "")}...`;
}

/** First in-content image for listing previews; undefined if none. */
export function getArticlePreviewImage(
  article: Article,
): ArticlePreviewImage | undefined {
  if (article.kind === "editorial") {
    if (article.introImage) {
      return {
        src: article.introImage.src,
        alt: article.introImage.alt,
      };
    }

    const sectionImage = article.sections.find((section) => section.image)?.image;
    if (sectionImage) {
      return { src: sectionImage.src, alt: sectionImage.alt };
    }
  } else {
    const productImage = article.products.find((product) => product.image)?.image;
    if (productImage) {
      return { src: productImage.src, alt: productImage.alt };
    }
  }

  if (article.ogImage) {
    return { src: article.ogImage.src, alt: article.ogImage.alt };
  }

  return undefined;
}
