import { posts as findworthnowPosts } from "@/data/sites/findworthnow/blog";
import type { DirectoryBlogPost } from "@/types/directory-blog";
import { getArticleConfig } from "@/lib/site-config";

const postsBySite: Record<string, DirectoryBlogPost[]> = {
  findworthnow: findworthnowPosts,
};

export function getDirectoryBlogPosts(siteSlug: string): DirectoryBlogPost[] {
  if (getArticleConfig(siteSlug)?.route !== "blog") {
    return [];
  }
  return (postsBySite[siteSlug] ?? [])
    .slice()
    .sort((a, b) => {
      const byDate = b.publishedAt.localeCompare(a.publishedAt);
      if (byDate !== 0) return byDate;
      return a.slug.localeCompare(b.slug);
    });
}

export function getDirectoryBlogPost(
  siteSlug: string,
  slug: string,
): DirectoryBlogPost | undefined {
  return getDirectoryBlogPosts(siteSlug).find((post) => post.slug === slug);
}

export function getRelatedDirectoryBlogPosts(
  siteSlug: string,
  post: DirectoryBlogPost,
): DirectoryBlogPost[] {
  const bySlug = new Map(
    getDirectoryBlogPosts(siteSlug).map((entry) => [entry.slug, entry]),
  );
  return post.relatedPostSlugs.flatMap((slug) => {
    const related = bySlug.get(slug);
    return related ? [related] : [];
  });
}
