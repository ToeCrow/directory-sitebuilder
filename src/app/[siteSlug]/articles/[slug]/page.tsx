import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteSlugs } from "@/data/sites";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { JsonLd } from "@/components/JsonLd";
import { buildArticleSchema } from "@/lib/schema";
import { getArticleOgImage } from "@/lib/seo";
import {
  getArticleBySlug,
  getArticles,
  getSiteBySlug,
  isValidSiteSlug,
} from "@/lib/site";
import type { EditorialFigure } from "@/types/site";

type ArticlePageProps = {
  params: Promise<{ siteSlug: string; slug: string }>;
};

export function generateStaticParams() {
  return siteSlugs.flatMap((siteSlug) =>
    getArticles(siteSlug).map((article) => ({
      siteSlug,
      slug: article.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { siteSlug, slug } = await params;

  if (!isValidSiteSlug(siteSlug)) {
    return { title: "Article not found" };
  }

  const article = getArticleBySlug(siteSlug, slug);
  const siteData = getSiteBySlug(siteSlug);

  if (!article || !siteData) {
    return { title: "Article not found" };
  }

  const description = article.excerpt ?? article.intro[0];
  const path = `/${siteSlug}/articles/${slug}`;
  const ogImage = getArticleOgImage(siteData, article);

  return {
    title: {
      absolute: article.title,
    },
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "article",
      siteName: siteData.title,
      title: article.title,
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
      title: article.title,
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
    <figure className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      <Image
        src={figure.src}
        alt={figure.alt}
        width={1200}
        height={800}
        className="h-auto w-full"
      />
      {figure.caption && (
        <figcaption className="border-t border-slate-200 px-4 py-3 text-sm leading-relaxed text-slate-500">
          {figure.caption}
          {(figure.creditHref || figure.photographerHref) && (
            <span className="mt-1 block">
              {figure.photographerHref && (
                <a
                  href={figure.photographerHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:text-blue-700"
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
                  className="font-medium text-blue-600 hover:text-blue-700"
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

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { siteSlug, slug } = await params;

  if (!isValidSiteSlug(siteSlug)) {
    notFound();
  }

  const article = getArticleBySlug(siteSlug, slug);
  const siteData = getSiteBySlug(siteSlug);

  if (!article || !siteData) {
    notFound();
  }

  const path = `/${siteSlug}/articles/${slug}`;
  const isEditorial = article.kind === "editorial";
  const isRoundup = article.kind === "product-roundup";

  return (
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
          href={`/${siteSlug}#articles`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to related guides
        </Link>

        <header className="mt-6 border-b border-slate-200 pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {article.title}
          </h1>
          <div className="mt-6 space-y-4">
            {article.intro.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="text-lg leading-relaxed text-slate-600"
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
          <aside className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-800">
              {article.researchNote.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-blue-900/80">
              {article.researchNote.content}
            </p>
          </aside>
        )}

        <AffiliateDisclosure siteSlug={siteSlug} className="mt-8 px-0" />

        {isRoundup && article.products.length > 0 && (
          <div className="mt-8 space-y-16">
            {article.products.map((product, index) => (
              <section
                key={product.heading}
                aria-labelledby={`product-${index}-heading`}
              >
                <h2
                  id={`product-${index}-heading`}
                  className="text-2xl font-bold tracking-tight text-slate-900"
                >
                  {index + 1}) {product.heading}
                </h2>

                {product.intro && (
                  <p className="mt-4 text-base leading-relaxed text-slate-600">
                    {product.intro}
                  </p>
                )}

                {product.image && (
                  <figure className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <Image
                      src={product.image.src}
                      alt={product.image.alt}
                      width={1200}
                      height={800}
                      className="h-auto w-full"
                    />
                  </figure>
                )}

                <div className="mt-8 space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      What it is
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {product.whatItIs}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Why it earns a spot on this list
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {product.whyItEarnsASpot.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2 text-sm leading-relaxed text-slate-600"
                        >
                          <span className="text-green-600" aria-hidden="true">
                            ✓
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Where it falls short
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {product.whereItFallsShort.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2 text-sm leading-relaxed text-slate-600"
                        >
                          <span className="text-red-500" aria-hidden="true">
                            ✗
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm leading-relaxed text-slate-700">
                      <span className="font-semibold text-slate-900">
                        Best for:
                      </span>{" "}
                      {product.bestFor}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700">
                      <span className="font-semibold text-slate-900">
                        Skip if:
                      </span>{" "}
                      {product.skipIf}
                    </p>
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}

        {isRoundup && article.closingGuide && (
          <section className="mt-16 border-t border-slate-200 pt-12">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {article.closingGuide.title}
            </h2>
            <ul className="mt-6 space-y-3">
              {article.closingGuide.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm leading-relaxed text-slate-600"
                >
                  <span className="text-blue-600" aria-hidden="true">
                    →
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            {article.closingGuide.closing && (
              <p className="mt-6 text-base leading-relaxed text-slate-600">
                {article.closingGuide.closing}
              </p>
            )}
            {article.closingGuide.pricingNote && (
              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                {article.closingGuide.pricingNote}
              </p>
            )}
          </section>
        )}

        {isEditorial && (
          <div className="mt-8 space-y-16">
            {article.sections.map((section, index) => (
              <section
                key={section.heading}
                aria-labelledby={`editorial-${index}-heading`}
              >
                <h2
                  id={`editorial-${index}-heading`}
                  className="text-2xl font-bold tracking-tight text-slate-900"
                >
                  {section.heading}
                </h2>

                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 64)}
                      className="text-base leading-relaxed text-slate-600"
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
                        className="text-base leading-relaxed text-slate-600"
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
                  <aside className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-800">
                      {section.factBox.title}
                    </h3>
                    <ul className="mt-3 list-disc space-y-2 pl-5">
                      {section.factBox.items.map((item) => (
                        <li
                          key={item.slice(0, 64)}
                          className="text-sm leading-relaxed text-blue-900/80"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </aside>
                )}

                {section.closingParagraphs &&
                  section.closingParagraphs.length > 0 && (
                    <div className="mt-4 space-y-4">
                      {section.closingParagraphs.map((paragraph) => (
                        <p
                          key={paragraph.slice(0, 64)}
                          className="text-base leading-relaxed text-slate-600"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}

                {section.citations && section.citations.length > 0 && (
                  <p className="mt-4 text-sm text-slate-500">
                    Source
                    {section.citations.length > 1 ? "s" : ""}:{" "}
                    {section.citations.map((citation, citationIndex) => (
                      <span key={citation.href}>
                        {citationIndex > 0 && "; "}
                        <a
                          href={citation.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-700"
                        >
                          {citation.label}
                        </a>
                      </span>
                    ))}
                  </p>
                )}
              </section>
            ))}
          </div>
        )}

        <div className="mt-12 border-t border-slate-200 pt-8">
          <Link
            href={`/${siteSlug}#articles`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to related guides
          </Link>
        </div>
      </article>
    </main>
  );
}
