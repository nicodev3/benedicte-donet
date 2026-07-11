import { getEntry } from "astro:content";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

/**
 * Accès typé au contenu de la page d'accueil (src/content/pages/accueil.*.md).
 */

export interface HomeSettings {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    backgroundImageMobile?: string;
    primaryCtaLabel: string;
    primaryCtaUrl: string;
  };
  intro: {
    title: string;
    text: string;
    ctaLabel?: string;
    ctaUrl?: string;
    image?: string;
  };
  whyOnline: {
    title: string;
    text: string;
    ctaLabel?: string;
    ctaUrl?: string;
    image?: string;
  };
  services: {
    title: string;
    cards: {
      title: string;
      intro?: string;
      bullets?: string[];
      text?: string;
      url: string;
      imageUrl?: string;
      linkLabel?: string;
      linkUrl?: string;
      ctaLabel?: string;
      ctaUrl?: string;
      image?: string;
      titleUnderline?: boolean;
      imageWidth?: "narrow" | "wide";
    }[];
  };
  appointment: {
    title: string;
    steps: { title: string; text: string }[];
    ctaLabel: string;
    ctaUrl: string;
  };
  masterclass: {
    title: string;
    text: string;
    ctaLabel: string;
    ctaUrl: string;
    image?: string;
  };
  quote: { text: string; author: string };
  reviews: {
    title: string;
    items: { author: string; text: string }[];
  };
  seoTitle?: string;
  seoDescription?: string;
}

const HOME_PAGE_IDS: Record<Locale, string> = {
  fr: "accueilfr",
  en: "accueilen",
};

export async function getHomeSettings(
  locale: Locale = DEFAULT_LOCALE
): Promise<HomeSettings> {
  const entry = await getEntry("pages", HOME_PAGE_IDS[locale]);
  if (!entry || !("home" in entry.data)) {
    throw new Error(`Page d'accueil introuvable pour la locale « ${locale} ».`);
  }
  return entry.data.home as HomeSettings;
}
