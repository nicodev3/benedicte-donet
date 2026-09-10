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
  return posts
    .filter(
      (post): post is PublishedBlogPost =>
        isPublishedBlogPost(post) &&
        post.id !== currentId &&
        getLocaleFromFilePath(post.filePath) === locale
    )
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
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
