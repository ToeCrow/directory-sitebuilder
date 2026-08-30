import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { ArticleFaq } from "@/components/ArticleFaq";
import { ArticleVerdict } from "@/components/ArticleVerdict";
import { BestForSkipIf } from "@/components/BestForSkipIf";
import { InlineRelatedArticle } from "@/components/InlineRelatedArticle";
import { JsonLd } from "@/components/JsonLd";
import { RelatedArticles } from "@/components/RelatedArticles";
import { ResearchNote } from "@/components/ResearchNote";
import { buildArticleSchema } from "@/lib/schema";
import { getArticleOgImage } from "@/lib/seo";
import {
  getArticlePath,
  getProductPath,
  getPublicPath,
  getReviewsIndexPath,
} from "@/lib/paths";
import { getRequestPublicBasePath } from "@/lib/request-paths";
import {
  getBottomRelatedArticles,
  getInlineRelatedArticle,
  getInlineRelatedInsertAfterIndex,
} from "@/lib/related-articles";
import { RoundupProductHeading } from "@/components/RoundupProductHeading";
import { RoundupProductPageCta } from "@/components/RoundupProductPageCta";
import { TiptapArticleBody } from "@/components/TiptapArticleBody";
import { TrackedLink } from "@/components/TrackedLink";
import { TrackingSourceProvider } from "@/context/TrackingSourceContext";
import { isTiptapDoc } from "@/lib/article-content";
import {
  getArticleBySlug,
  getSiteBySlug,
  getStaticArticles,
  isValidSiteSlug,
  roundupProductFrom,
} from "@/lib/site";
import { resolveRoundupSectionImage } from "@/lib/media";
import { canAccessRoute, getStaticParamSiteSlugsForRoute } from "@/lib/site-routes";
import type { EditorialFigure } from "@/types/site";

type ReviewPageProps = {
  params: Promise<{ siteSlug: string; slug: string }>;
};

export function generateStaticParams() {
  return getStaticParamSiteSlugsForRoute("reviews").flatMap((siteSlug) =>
    getStaticArticles(siteSlug).map((article) => ({
      siteSlug,
      slug: article.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: ReviewPageProps): Promise<Metadata> {
  const { siteSlug, slug } = await params;

  if (!(await isValidSiteSlug(siteSlug))) {
    return { title: "Review not found" };
  }

  const article = await getArticleBySlug(siteSlug, slug);
  const siteData = await getSiteBySlug(siteSlug);

  if (!article || !siteData) {
    return { title: "Review not found" };
  }

  const title = article.metaTitle ?? article.title;
  const description =
    article.metaDescription ?? article.excerpt ?? article.intro[0];
  const path = getPublicPath(siteSlug, `/reviews/${slug}`);
  const ogImage = getArticleOgImage(siteData, article);

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "article",
      siteName: siteData.title,
      title,
      description,
      url: path,
      images: [
        {
          url: ogImage.url,
          width: ogImage.width,
          height: ogImage.height,
          alt: ogImage.alt,
        },
      ],
      ...(article.publishedAt ? { publishedTime: article.publishedAt } : {}),
      ...(article.updatedAt ? { modifiedTime: article.updatedAt } : {}),
      ...(article.author ? { authors: [article.author] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: ogImage.url,
          alt: ogImage.alt,
        },
      ],
    },
  };
}

function EditorialFigureBlock({ figure }: { figure: EditorialFigure }) {
  return (
    <figure className="mt-6 overflow-hidden bg-ss-mist">
      <Image
        src={figure.src}
        alt={figure.alt}
        width={1200}
        height={800}
        className="h-auto w-full"
      />
      {figure.caption && (
        <figcaption className="px-1 py-3 text-sm leading-relaxed text-ss-ink/60">
          {figure.caption}
          {(figure.creditHref || figure.photographerHref) && (
            <span className="mt-1 block">
              {figure.photographerHref && (
                <a
                  href={figure.photographerHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-ss-navy hover:text-ss-blue"
                >
                  Photographer
                </a>
              )}
              {figure.photographerHref && figure.creditHref && (
                <span aria-hidden="true"> · </span>
              )}
              {figure.creditHref && (
                <a
                  href={figure.creditHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-ss-navy hover:text-ss-blue"
                >
                  Source
                </a>
              )}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { siteSlug, slug } = await params;

  if (!(await isValidSiteSlug(siteSlug)) || !canAccessRoute(siteSlug, "reviews")) {
    notFound();
  }

  const article = await getArticleBySlug(siteSlug, slug);
  const siteData = await getSiteBySlug(siteSlug);

  if (!article || !siteData) {
    notFound();
  }

  const path = getPublicPath(siteSlug, `/reviews/${slug}`);
  const isEditorial = article.kind === "editorial";
  const isRoundup = article.kind === "product-roundup";
  const publicBasePath = await getRequestPublicBasePath(siteSlug);
  const reviewsHref = getReviewsIndexPath(publicBasePath);
  const inlineRelated = getInlineRelatedArticle(siteData, article);
  const inlineRelatedHref = inlineRelated
    ? getArticlePath(publicBasePath, inlineRelated.slug)
    : null;
  const relatedArticles = getBottomRelatedArticles(siteData, article);

  return (
    <TrackingSourceProvider
      source={{ type: "article", id: article.id, path }}
    >
    <main className="py-12 md:py-16">
      <JsonLd
        data={buildArticleSchema({
          site: siteData,
          article,
          url: path,
        })}
      />
      <article className="mx-auto max-w-3xl px-4">
        <Link
          href={reviewsHref}
          className="text-sm font-medium text-ss-navy hover:text-ss-blue"
        >
          ← Back to reviews
        </Link>

        <header className="mt-6 pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-ss-navy md:text-4xl">
            {article.title}
          </h1>
          <div className="mt-6 space-y-4">
            {article.intro.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="text-lg leading-relaxed text-ss-ink/80"
              >
                {paragraph}
              </p>
            ))}
          </div>
          {isEditorial && article.introImage && (
            <EditorialFigureBlock figure={article.introImage} />
          )}
        </header>

        {isRoundup && (
          <div className="mt-10">
            <ResearchNote title={article.researchNote.title}>
              {article.researchNote.content}
            </ResearchNote>
          </div>
        )}

        <AffiliateDisclosure siteSlug={siteSlug} className="mt-8 px-0" />

        {isRoundup && article.products.length > 0 && (
          <div className="mt-8 space-y-16">
            {article.products.map((product, index) => {
              const catalogProduct = roundupProductFrom(siteData, product);
              const image = resolveRoundupSectionImage(catalogProduct, product);
              const showInlineRelated =
                Boolean(inlineRelated && inlineRelatedHref) &&
                index ===
                  getInlineRelatedInsertAfterIndex(article.products.length);

              return (
                <Fragment key={product.heading}>
                <section
                  className="border-l-[3px] border-ss-navy/20 pl-5 md:pl-6"
                  aria-labelledby={`product-${index}-heading`}
                >
                  <RoundupProductHeading
                    index={index}
                    heading={product.heading}
                    product={catalogProduct}
                    publicBasePath={publicBasePath}
                  />

                  {product.intro && (
                    <p className="mt-4 text-base leading-relaxed text-ss-ink/80">
                      {product.intro}
                    </p>
                  )}

                  {image && (
                    <figure className="mt-6 overflow-hidden bg-ss-mist">
                      {catalogProduct ? (
                        <TrackedLink
                          href={getProductPath(
                            publicBasePath,
                            catalogProduct.slug,
                          )}
                          placement="roundup-product-image"
                          target={
                            catalogProduct.id
                              ? { type: "product", id: catalogProduct.id }
                              : { type: "path" }
                          }
                          label={catalogProduct.name}
                        >
                          <Image
                            src={image.src}
                            alt={image.alt}
                            width={1200}
                            height={800}
                            className="h-auto w-full"
                          />
                        </TrackedLink>
                      ) : (
                        <Image
                          src={image.src}
                          alt={image.alt}
                          width={1200}
                          height={800}
                          className="h-auto w-full"
                        />
                      )}
                    </figure>
                  )}

                  <div className="mt-8 space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-ss-navy">
                        What it is
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-ss-ink/80">
                        {product.whatItIs}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-ss-navy">
                        Why it earns a spot on this list
                      </h3>
                      <ul className="mt-3 space-y-2">
                        {product.whyItEarnsASpot.map((item) => (
                          <li
                            key={item}
                            className="flex gap-2 text-sm leading-relaxed text-ss-ink/80"
                          >
                            <span className="text-ss-green" aria-hidden="true">
                              ✓
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-ss-navy">
                        Where it falls short
                      </h3>
                      <ul className="mt-3 space-y-2">
                        {product.whereItFallsShort.map((item) => (
                          <li
                            key={item}
                            className="flex gap-2 text-sm leading-relaxed text-ss-ink/80"
                          >
                            <span className="text-ss-terracotta" aria-hidden="true">
                              ✗
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <BestForSkipIf
                      bestFor={product.bestFor}
                      skipIf={product.skipIf}
                    />
                  </div>

                  {catalogProduct && (
                    <RoundupProductPageCta product={catalogProduct} />
                  )}
                </section>
                {showInlineRelated && inlineRelated && inlineRelatedHref && (
                  <InlineRelatedArticle
                    article={inlineRelated}
                    href={inlineRelatedHref}
                  />
                )}
                </Fragment>
              );
            })}
          </div>
        )}

        {isRoundup && article.closingGuide && (
          <ArticleVerdict guide={article.closingGuide} />
        )}

        {isRoundup && article.faqs && article.faqs.length > 0 && (
          <ArticleFaq faqs={article.faqs} />
        )}

        {isEditorial && isTiptapDoc(article.body) && (
          <TiptapArticleBody
            doc={article.body}
            siteSlug={siteSlug}
            publicBasePath={publicBasePath}
            articles={siteData.articles}
            sourceArticleId={article.id}
          />
        )}

        {isEditorial && !isTiptapDoc(article.body) && (
          <div className="mt-8 space-y-16">
            {article.sections.map((section, index) => {
              const showInlineRelated =
                Boolean(inlineRelated && inlineRelatedHref) &&
                index ===
                  getInlineRelatedInsertAfterIndex(article.sections.length);

              return (
                <Fragment key={section.heading}>
              <section
                aria-labelledby={`editorial-${index}-heading`}
              >
                <h2
                  id={`editorial-${index}-heading`}
                  className="text-2xl font-bold tracking-tight text-ss-navy"
                >
                  {section.heading}
                </h2>

                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 64)}
                      className="text-base leading-relaxed text-ss-ink/80"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-4 list-disc space-y-2 pl-5">
                    {section.bullets.map((item) => (
                      <li
                        key={item}
                        className="text-base leading-relaxed text-ss-ink/80"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {section.image && (
                  <EditorialFigureBlock figure={section.image} />
                )}

                {section.factBox && (
                  <div className="mt-6">
                    <ResearchNote
                      title={section.factBox.title}
                      headingLevel="h3"
                    >
                      <ul className="list-disc space-y-2 pl-5">
                        {section.factBox.items.map((item) => (
                          <li key={item.slice(0, 64)}>{item}</li>
                        ))}
                      </ul>
                    </ResearchNote>
                  </div>
                )}

                {section.closingParagraphs &&
                  section.closingParagraphs.length > 0 && (
                    <div className="mt-4 space-y-4">
                      {section.closingParagraphs.map((paragraph) => (
                        <p
                          key={paragraph.slice(0, 64)}
                          className="text-base leading-relaxed text-ss-ink/80"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}

                {section.citations && section.citations.length > 0 && (
                  <p className="mt-4 text-sm text-ss-ink/55">
                    Source
                    {section.citations.length > 1 ? "s" : ""}:{" "}
                    {section.citations.map((citation, citationIndex) => (
                      <span key={citation.href}>
                        {citationIndex > 0 && "; "}
                        <a
                          href={citation.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-ss-navy hover:text-ss-blue"
                        >
                          {citation.label}
                        </a>
                      </span>
                    ))}
                  </p>
                )}
              </section>
                {showInlineRelated && inlineRelated && inlineRelatedHref && (
                  <InlineRelatedArticle
                    article={inlineRelated}
                    href={inlineRelatedHref}
                  />
                )}
                </Fragment>
              );
            })}
          </div>
        )}

        <RelatedArticles
          articles={relatedArticles}
          publicBasePath={publicBasePath}
          siteSlug={siteSlug}
        />

        <div className="mt-12 border-t border-ss-navy/10 pt-8">
          <Link
            href={reviewsHref}
            className="text-sm font-medium text-ss-navy hover:text-ss-blue"
          >
            ← Back to reviews
          </Link>
        </div>
      </article>
    </main>
    </TrackingSourceProvider>
  );
}
