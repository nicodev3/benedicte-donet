import type { CollectionEntry } from "astro:content";
import {
  getAlternateLocale,
  getLocaleFromFilePath,
  stripLocaleFromFilePath,
  type Locale,
} from "@/lib/i18n";

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

/**
 * Map FR↔EN tag slugs from paired blog posts (same base slug, tags aligned by index).
 */
export function getAlternateTagSlug(
  posts: CollectionEntry<"blog">[],
  locale: Locale,
  tagSlug: string
): string | undefined {
  const published = posts.filter((post) => !post.data.draft);
  const byBaseSlug = new Map<string, Partial<Record<Locale, CollectionEntry<"blog">>>>();

  for (const post of published) {
    const baseSlug = stripLocaleFromFilePath(post.filePath, post.id);
    const postLocale = getLocaleFromFilePath(post.filePath);
    const pair = byBaseSlug.get(baseSlug) ?? {};
    pair[postLocale] = post;
    byBaseSlug.set(baseSlug, pair);
  }

  const votes = new Map<string, number>();

  for (const pair of byBaseSlug.values()) {
    const current = pair[locale];
    const alternate = pair[getAlternateLocale(locale)];
    if (!current || !alternate) continue;

    const currentTags = current.data.tags.map(slugifyTag);
    const alternateTags = alternate.data.tags.map(slugifyTag);
    const index = currentTags.indexOf(tagSlug);
    if (index === -1 || !alternateTags[index]) continue;

    const candidate = alternateTags[index];
    votes.set(candidate, (votes.get(candidate) ?? 0) + 1);
  }

  let best: string | undefined;
  let bestScore = 0;
  for (const [candidate, score] of votes) {
    if (score > bestScore) {
      best = candidate;
      bestScore = score;
    }
  }

  return best;
}
