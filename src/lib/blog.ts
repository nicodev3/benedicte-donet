import type { CollectionEntry } from "astro:content";
import { getLocaleFromFilePath, type Locale } from "@/lib/i18n";

export function getRelatedPosts(
  posts: CollectionEntry<"blog">[],
  currentId: string,
  locale: Locale,
  limit = 6
): CollectionEntry<"blog">[] {
  return posts
    .filter(
      (post) =>
        post.id !== currentId &&
        !post.data.draft &&
        getLocaleFromFilePath(post.filePath) === locale
    )
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, limit);
}

export function getLatestPosts(
  posts: CollectionEntry<"blog">[],
  locale: Locale,
  limit = 12
): CollectionEntry<"blog">[] {
  return posts
    .filter(
      (post) => !post.data.draft && getLocaleFromFilePath(post.filePath) === locale
    )
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, limit);
}
