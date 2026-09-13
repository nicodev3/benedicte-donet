import type { CollectionEntry } from "astro:content";
import { isPublishedBlogPost, type PublishedBlogPost } from "@/lib/blog";
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

export interface TagArchiveContent {
  title: string;
  description: string;
  intro: string;
}

const TAG_ARCHIVE_COPY: Record<Locale, Record<string, TagArchiveContent>> = {
  fr: {
    emdr: {
      title: "Articles sur l’EMDR et les traumatismes",
      description: "Comprendre la thérapie EMDR, le retraitement des souvenirs traumatiques et les possibilités d’accompagnement psychologique en ligne.",
      intro: "Ces articles expliquent le fonctionnement de l’EMDR, ses principales étapes et la place qu’elle peut prendre dans un accompagnement psychologique. Ils apportent des repères généraux qui ne remplacent pas une évaluation individuelle.",
    },
    trauma: {
      title: "Articles sur le trauma et ses effets",
      description: "Des repères sur le trauma, la mémoire, les relations et les approches thérapeutiques proposées par Bénédicte Donet, psychologue en ligne.",
      intro: "Le trauma peut affecter la mémoire, le corps, les émotions ou les relations. Cette sélection rassemble des explications pour mieux comprendre ces effets et découvrir les formes d’accompagnement possibles.",
    },
    psycho: {
      title: "Articles de psychologie",
      description: "Articles de psychologie sur les émotions, les relations et la santé mentale, avec des repères pour envisager un accompagnement en ligne.",
      intro: "Cette sélection aborde différents mécanismes psychologiques et leurs effets dans la vie quotidienne. Elle aide à mettre des mots sur une difficulté et à identifier les sujets qui peuvent être travaillés en consultation.",
    },
    psychoeducation: {
      title: "Articles de psychoéducation",
      description: "Comprendre les mécanismes psychologiques, les émotions et le système nerveux grâce aux articles de Bénédicte Donet.",
      intro: "La psychoéducation donne des repères pour mieux comprendre ses réactions, ses émotions et ses besoins. Ces contenus restent généraux et peuvent servir de point de départ à un échange thérapeutique.",
    },
    "theorie-de-l-attachement": {
      title: "Articles sur la théorie de l’attachement",
      description: "Comprendre les styles d’attachement, la peur du lien et leurs effets dans les relations amoureuses et affectives.",
      intro: "Les expériences relationnelles précoces peuvent influencer la manière de créer du lien, d’exprimer ses besoins ou de réagir à la distance. Ces articles proposent des repères sur les différents styles d’attachement.",
    },
  },
  en: {
    emdr: {
      title: "Articles about EMDR and trauma",
      description: "Understand EMDR therapy, traumatic memory processing and options for online psychological support with Bénédicte Donet.",
      intro: "These articles explain how EMDR works, its main stages and the role it may play in psychological support. They provide general information and do not replace an individual assessment.",
    },
    trauma: {
      title: "Articles about trauma and its effects",
      description: "Information about trauma, memory, relationships and therapeutic approaches from Bénédicte Donet, online psychologist.",
      intro: "Trauma can affect memory, the body, emotions and relationships. This selection brings together explanations to help you understand these effects and explore possible forms of support.",
    },
    psychology: {
      title: "Psychology articles",
      description: "Psychology articles about emotions, relationships and mental health, with guidance on considering online support.",
      intro: "This selection explores psychological patterns and their effects in everyday life. It can help you name a difficulty and identify topics that may be addressed in consultation.",
    },
    psychoeducation: {
      title: "Psychoeducation articles",
      description: "Understand psychological patterns, emotions and the nervous system through articles by Bénédicte Donet.",
      intro: "Psychoeducation provides useful ways to understand reactions, emotions and needs. These general resources can be a starting point for a therapeutic conversation.",
    },
    "attachment-theory": {
      title: "Articles about attachment theory",
      description: "Understand attachment styles, fear of connection and their effects on romantic and emotional relationships.",
      intro: "Early relational experiences can influence how we connect, express needs and respond to distance. These articles offer guidance on different attachment styles.",
    },
  },
};

export function getTagArchiveContent(
  locale: Locale,
  slug: string,
  label: string,
): TagArchiveContent {
  const specific = TAG_ARCHIVE_COPY[locale][slug];
  if (specific) return specific;

  return locale === "fr"
    ? {
        title: `Articles sur ${label}`,
        description: `Retrouvez les articles de Bénédicte Donet autour de ${label}, de la psychologie et du bien-être émotionnel.`,
        intro: `Cette sélection rassemble les articles consacrés à ${label}. Vous y trouverez des repères pour mieux comprendre votre expérience et approfondir ce sujet.`,
      }
    : {
        title: `Articles about ${label}`,
        description: `Explore Bénédicte Donet’s articles about ${label}, psychology and emotional wellbeing.`,
        intro: `This selection brings together articles about ${label}. It offers guidance to better understand your experience and explore the subject further.`,
      };
}

export function getTagsForLocale(
  posts: CollectionEntry<"blog">[],
  locale: Locale,
): TagSummary[] {
  const bySlug = new Map<string, TagSummary>();

  for (const post of posts) {
    if (!isPublishedBlogPost(post)) continue;
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
): PublishedBlogPost[] {
  return posts
    .filter(
      (post): post is PublishedBlogPost =>
        isPublishedBlogPost(post) &&
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
  const published = posts.filter(isPublishedBlogPost);
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
