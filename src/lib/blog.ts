import type { CollectionEntry } from "astro:content";
import { getLocaleFromFilePath, type Locale } from "@/lib/i18n";

/** Entrée blog publiable : pas brouillon + titre renseigné (traduction EN incomplète exclue). */
export type PublishedBlogPost = CollectionEntry<"blog"> & {
  data: CollectionEntry<"blog">["data"] & { title: string };
};

export function isPublishedBlogPost(
  post: CollectionEntry<"blog">
): post is PublishedBlogPost {
  return !post.data.draft && Boolean(post.data.title?.trim());
}

export function getRelatedPosts(
  posts: CollectionEntry<"blog">[],
  currentId: string,
  locale: Locale,
  limit = 6
): PublishedBlogPost[] {
  const current = posts.find((post) => post.id === currentId);
  const currentTags = new Set(current?.data.tags.map((tag) => tag.toLowerCase()) ?? []);
  const relevance = (post: CollectionEntry<"blog">) =>
    post.data.tags.filter((tag) => currentTags.has(tag.toLowerCase())).length;
  const candidates = posts
    .filter(
      (post): post is PublishedBlogPost =>
        isPublishedBlogPost(post) &&
        post.id !== currentId &&
        getLocaleFromFilePath(post.filePath) === locale
    );
  const related = candidates.filter((post) => relevance(post) > 0);
  return (related.length ? related : candidates)
    .sort((a, b) => relevance(b) - relevance(a) || b.data.date.getTime() - a.data.date.getTime())
    .slice(0, limit);
}

export function getLatestPosts(
  posts: CollectionEntry<"blog">[],
  locale: Locale,
  limit = 12
): PublishedBlogPost[] {
  return posts
    .filter(
      (post): post is PublishedBlogPost =>
        isPublishedBlogPost(post) && getLocaleFromFilePath(post.filePath) === locale
    )
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, limit);
}
