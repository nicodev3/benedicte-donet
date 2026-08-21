import type { CollectionEntry } from "astro:content";
import {
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
  locale: Locale,
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
  tagSlug: string,
): CollectionEntry<"blog">[] {
  return posts
    .filter(
      (post) =>
        !post.data.draft &&
        getLocaleFromFilePath(post.filePath) === locale &&
        post.data.tags.some((tag) => slugifyTag(tag) === tagSlug),
    )
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * Map FR↔EN tag slugs from paired blog posts (same base slug, tags aligned by index).
 */
export function getAlternateTagSlug(
  posts: CollectionEntry<"blog">[],
  locale: Locale,
  tagSlug: string,
): string | undefined {
  const published = posts.filter((post) => !post.data.draft);
  const byBaseSlug = new Map<
    string,
    Partial<Record<Locale, CollectionEntry<"blog">>>
  >();

  for (const post of published) {
    const baseSlug = stripLocaleFromFilePath(post.filePath, post.id);
    const postLocale = getLocaleFromFilePath(post.filePath);
    const pair = byBaseSlug.get(baseSlug) ?? {};
    pair[postLocale] = post;
    byBaseSlug.set(baseSlug, pair);
  }

  const tagsByLocale = new Map<Locale, Set<string>>([
    ["fr", new Set<string>()],
    ["en", new Set<string>()],
  ]);

  for (const post of published) {
    const postLocale = getLocaleFromFilePath(post.filePath);
    const tags = tagsByLocale.get(postLocale);
    if (!tags) continue;
    for (const tag of post.data.tags) tags.add(slugifyTag(tag));
  }

  const votes = new Map<string, number>();

  for (const pair of byBaseSlug.values()) {
    const frPost = pair.fr;
    const enPost = pair.en;
    if (!frPost || !enPost) continue;

    const frTags = frPost.data.tags.map(slugifyTag);
    const enTags = enPost.data.tags.map(slugifyTag);
    const sharedLength = Math.min(frTags.length, enTags.length);
    for (let index = 0; index < sharedLength; index += 1) {
      const key = `${frTags[index]}->${enTags[index]}`;
      votes.set(key, (votes.get(key) ?? 0) + 1);
    }
  }

  // Build a one-to-one map. Shared slugs are preferred because they are
  // deterministic and avoid collisions such as `psycho` -> `psychology`.
  const candidates = [...votes.entries()].map(([key, score]) => {
    const [current, alternate] = key.split("->");
    return { current, alternate, score };
  });
  const frTags = tagsByLocale.get("fr") ?? new Set<string>();
  const enTags = tagsByLocale.get("en") ?? new Set<string>();
  const exactMatchScore = Math.max(0, ...votes.values()) + 1;
  for (const tag of frTags) {
    if (enTags.has(tag)) {
      candidates.push({ current: tag, alternate: tag, score: exactMatchScore });
    }
  }

  const used = new Map<Locale, Set<string>>([
    ["fr", new Set<string>()],
    ["en", new Set<string>()],
  ]);
  const alternateMap = new Map<string, string>();

  candidates
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.current.localeCompare(b.current) ||
        a.alternate.localeCompare(b.alternate),
    )
    .forEach(({ current, alternate }) => {
      if (!current || !alternate) return;
      if (used.get("fr")?.has(current) || used.get("en")?.has(alternate))
        return;
      used.get("fr")?.add(current);
      used.get("en")?.add(alternate);
      alternateMap.set(`fr:${current}`, alternate);
      alternateMap.set(`en:${alternate}`, current);
    });

  return alternateMap.get(`${locale}:${tagSlug}`);
}
