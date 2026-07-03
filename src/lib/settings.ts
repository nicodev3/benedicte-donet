import { getEntry } from "astro:content";

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
    image?: string;
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
  };
  services: {
    title: string;
    cards: {
      title: string;
      text: string;
      url: string;
      linkLabel: string;
      image?: string;
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

export interface NavigationSettings {
  items: { label: string; url: string; order: number; visible: boolean }[];
}

export interface FooterSettings {
  text: string;
  quickLinks: { label: string; url: string }[];
  legalLinks: { label: string; url: string }[];
  cta: { label: string; url: string };
}

async function getSettings<T>(id: string): Promise<T> {
  const entry = await getEntry("settings", id);
  if (!entry) throw new Error(`Réglages introuvables : ${id}.json`);
  return entry.data as T;
}

export const getGlobalSettings = () => getSettings<GlobalSettings>("global");
export const getHomeSettings = () => getSettings<HomeSettings>("home");
export const getNavigationSettings = () =>
  getSettings<NavigationSettings>("navigation");
export const getFooterSettings = () => getSettings<FooterSettings>("footer");
