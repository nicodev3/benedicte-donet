import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/** Decap écrit souvent `null` pour les champs vides / hidden — on le traite comme absent. */
const optionalString = z.preprocess(
  (val) => (val === null || val === "" ? undefined : val),
  z.string().optional()
);

const bulletsSchema = z.preprocess(
  (val) =>
    typeof val === "string"
      ? val
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
      : val,
  z.array(z.string()).optional()
);

const homeContentSchema = z.object({
  hero: z.object({
    title: z.string(),
    subtitle: z.string(),
    backgroundImage: z.string(),
    backgroundImageMobile: optionalString,
    primaryCtaLabel: z.string(),
    primaryCtaUrl: z.string(),
  }),
  intro: z.object({
    title: z.string(),
    text: z.string(),
    ctaLabel: optionalString,
    ctaUrl: optionalString,
    image: optionalString,
  }),
  whyOnline: z.object({
    title: z.string(),
    text: z.string(),
    ctaLabel: optionalString,
    ctaUrl: optionalString,
    image: optionalString,
  }),
  services: z.object({
    title: z.string(),
    cards: z.array(
      z.object({
        title: z.string(),
        intro: optionalString,
        bullets: bulletsSchema,
        text: optionalString,
        url: z.string(),
        imageUrl: optionalString,
        linkLabel: optionalString,
        linkUrl: optionalString,
        ctaLabel: optionalString,
        ctaUrl: optionalString,
        image: optionalString,
        titleUnderline: z.boolean().optional(),
        imageWidth: z.enum(["narrow", "wide"]).nullish(),
      })
    ),
  }),
  appointment: z.object({
    title: z.string(),
    steps: z.array(z.object({ title: z.string(), text: z.string() })),
    ctaLabel: z.string(),
    ctaUrl: z.string(),
  }),
  masterclass: z.object({
    title: z.string(),
    text: z.string(),
    ctaLabel: z.string(),
    ctaUrl: z.string(),
    image: optionalString,
  }),
  quote: z.object({
    text: z.string(),
    author: z.string(),
  }),
  reviews: z.object({
    title: z.string(),
    items: z.array(z.object({ author: z.string(), text: z.string() })),
  }),
  seoTitle: optionalString,
  seoDescription: optionalString,
});

/**
 * Pages éditables en Markdown via Decap CMS.
 * Le slug = nom du fichier = URL (ex: psychotherapie.fr.md -> /psychotherapie/).
 * La page d'accueil est `accueil.{locale}.md` (pageType: home).
 */
const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.union([
    z.object({
      title: z.string(),
      pageType: z.literal("home"),
      home: homeContentSchema,
      // Decap peut écrire image: null sur l'accueil — ignoré
      image: optionalString,
      order: z.number().default(0),
      draft: z.boolean().default(false),
    }),
    z.object({
      title: z.string(),
      pageType: z.literal("page").optional().default("page"),
      heroTitle: optionalString,
      description: optionalString,
      image: optionalString,
      imageAlt: optionalString,
      seoTitle: optionalString,
      seoDescription: optionalString,
      order: z.number().default(0),
      draft: z.boolean().default(false),
    }),
  ]),
});

/**
 * Articles de blog éditables librement via Decap CMS.
 */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    excerpt: optionalString,
    tags: z.array(z.string()).default([]),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    image: optionalString,
    imageAlt: optionalString,
    seoTitle: optionalString,
    seoDescription: optionalString,
    draft: z.boolean().default(false),
  }),
});

/**
 * Programmes et masterclasses (URLs WordPress /produit/... conservées).
 */
const products = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  schema: z.object({
    title: z.string(),
    price: z.string(),
    image: z.string(),
    imageAlt: z.string(),
    ctaLabel: z.string().default("Je commande"),
    ctaUrl: z.string().default("/infos-pratiques/#form"),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { pages, blog, products };
