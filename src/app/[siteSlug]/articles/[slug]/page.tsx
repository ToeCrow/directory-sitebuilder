import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteSlugs } from "@/data/sites";
import { JsonLd } from "@/components/JsonLd";
import { buildArticleSchema } from "@/lib/schema";
import { getArticleOgImage } from "@/lib/seo";
import {
  getArticleBySlug,
  getArticles,
  getSiteBySlug,
  isValidSiteSlug,
} from "@/lib/site";

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
    title: article.title,
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
        </header>

        <aside className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-800">
            {article.researchNote.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-blue-900/80">
            {article.researchNote.content}
          </p>
        </aside>

        {article.products.length > 0 && (
          <div className="mt-12 space-y-16">
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
