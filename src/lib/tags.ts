import type { CollectionEntry } from "astro:content";
import { getLocaleFromFilePath, type Locale } from "@/lib/i18n";

export function slugifyTag(tag: string): string {
  return tag
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface TagSummary {
  label: string;
  slug: string;
  count: number;
}

export function getTagsForLocale(
  posts: CollectionEntry<"blog">[],
  locale: Locale
): TagSummary[] {
  const bySlug = new Map<string, TagSummary>();

  for (const post of posts) {
    if (post.data.draft) continue;
    if (getLocaleFromFilePath(post.filePath) !== locale) continue;

    for (const tag of post.data.tags) {
      const slug = slugifyTag(tag);
      const existing = bySlug.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        bySlug.set(slug, { label: tag, slug, count: 1 });
      }
    }
  }

  return [...bySlug.values()].sort((a, b) => a.label.localeCompare(b.label));
}

export function getPostsByTagSlug(
  posts: CollectionEntry<"blog">[],
  locale: Locale,
  tagSlug: string
): CollectionEntry<"blog">[] {
  return posts
    .filter(
      (post) =>
        !post.data.draft &&
        getLocaleFromFilePath(post.filePath) === locale &&
        post.data.tags.some((tag) => slugifyTag(tag) === tagSlug)
    )
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
