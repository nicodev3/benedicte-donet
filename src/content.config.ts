import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

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
    backgroundImageMobile: z.string().optional(),
    primaryCtaLabel: z.string(),
    primaryCtaUrl: z.string(),
  }),
  intro: z.object({
    title: z.string(),
    text: z.string(),
    ctaLabel: z.string().optional(),
    ctaUrl: z.string().optional(),
    image: z.string().optional(),
  }),
  whyOnline: z.object({
    title: z.string(),
    text: z.string(),
    ctaLabel: z.string().optional(),
    ctaUrl: z.string().optional(),
    image: z.string().optional(),
  }),
  services: z.object({
    title: z.string(),
    cards: z.array(
      z.object({
        title: z.string(),
        intro: z.string().optional(),
        bullets: bulletsSchema,
        text: z.string().optional(),
        url: z.string(),
        imageUrl: z.string().optional(),
        linkLabel: z.string().optional(),
        linkUrl: z.string().optional(),
        ctaLabel: z.string().optional(),
        ctaUrl: z.string().optional(),
        image: z.string().optional(),
        titleUnderline: z.boolean().optional(),
        imageWidth: z.enum(["narrow", "wide"]).optional(),
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
    image: z.string().optional(),
  }),
  quote: z.object({
    text: z.string(),
    author: z.string(),
  }),
  reviews: z.object({
    title: z.string(),
    items: z.array(z.object({ author: z.string(), text: z.string() })),
  }),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
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
      order: z.number().default(0),
      draft: z.boolean().default(false),
    }),
    z.object({
      title: z.string(),
      pageType: z.literal("page").optional().default("page"),
      heroTitle: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
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
    excerpt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
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
