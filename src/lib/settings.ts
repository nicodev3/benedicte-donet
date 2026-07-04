import { getEntry } from "astro:content";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

/**
 * Accès typé aux fichiers de réglages (src/content/settings/*.json).
 * La validation Zod est faite par la collection `settings` au build.
 */

export interface GlobalSettings {
  siteName: string;
  baseline: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  email: string;
  phone: string;
  appointmentUrl: string;
  instagramUrl?: string;
  facebookUrl?: string;
  area?: string;
}

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

export interface NavigationItem {
  label: string;
  url: string;
  order: number;
  visible: boolean;
  children?: { label: string; url: string; visible: boolean }[];
}

export interface NavigationSettings {
  items: NavigationItem[];
}

export interface FooterSettings {
  text: string;
  quickLinks: { label: string; url: string }[];
  legalLinks: { label: string; url: string }[];
  cta: { label: string; url: string };
}

async function getSettings<T>(id: string, locale: Locale = DEFAULT_LOCALE): Promise<T> {
  const localizedId = locale === DEFAULT_LOCALE ? id : `${id}${locale}`;
  const entry =
    (await getEntry("settings", localizedId)) ?? (await getEntry("settings", id));
  if (!entry) throw new Error(`Réglages introuvables : ${id}.json`);
  return entry.data as T;
}

export const getGlobalSettings = (locale?: Locale) =>
  getSettings<GlobalSettings>("global", locale);
export const getHomeSettings = (locale?: Locale) =>
  getSettings<HomeSettings>("home", locale);
export const getNavigationSettings = (locale?: Locale) =>
  getSettings<NavigationSettings>("navigation", locale);
export const getFooterSettings = (locale?: Locale) =>
  getSettings<FooterSettings>("footer", locale);
