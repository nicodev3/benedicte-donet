import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Pages éditables en Markdown via Decap CMS.
 * Le slug = nom du fichier = URL (ex: psychotherapie.md -> /psychotherapie/).
 */
const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

/**
 * Articles de blog éditables librement via Decap CMS.
 */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const linkSchema = z.object({
  label: z.string(),
  url: z.string(),
});

/**
 * Réglages globaux, home, navigation et footer (fichiers JSON contrôlés).
 */
const settings = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/settings" }),
  schema: z.union([
    // global.json
    z.object({
      siteName: z.string(),
      baseline: z.string(),
      defaultSeoTitle: z.string(),
      defaultSeoDescription: z.string(),
      email: z.string(),
      phone: z.string(),
      appointmentUrl: z.string(),
      instagramUrl: z.string().optional(),
      facebookUrl: z.string().optional(),
      area: z.string().optional(),
    }),
    // home.json
    z.object({
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
            bullets: z.preprocess(
              (val) =>
                typeof val === "string"
                  ? val
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean)
                  : val,
              z.array(z.string()).optional()
            ),
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
    }),
    // navigation.json
    z.object({
      items: z.array(
        z.object({
          label: z.string(),
          url: z.string(),
          order: z.number().default(0),
          visible: z.boolean().default(true),
          children: z
            .array(
              z.object({
                label: z.string(),
                url: z.string(),
                visible: z.boolean().default(true),
              })
            )
            .optional(),
        })
      ),
    }),
    // footer.json
    z.object({
      text: z.string(),
      quickLinks: z.array(linkSchema),
      legalLinks: z.array(linkSchema),
      cta: z.object({
        label: z.string(),
        url: z.string(),
      }),
    }),
  ]),
});

export const collections = { pages, blog, settings };
