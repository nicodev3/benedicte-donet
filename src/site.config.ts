import type { Locale } from "@/lib/i18n";

/**
 * Configuration technique du site.
 * Coordonnées et réglages généraux (non éditables via Decap CMS).
 * Les contenus éditables par la cliente sont dans src/content/pages/ et src/content/blog/.
 */
export const SITE = {
  name: "Bénédicte Donet — Psychologue en ligne",
  siteName: "Bénédicte Donet",
  url: "https://www.benedictedonet-psyenligne.com",
  phone: "+33 6 17 78 98 78",
  email: "donetbenedicte@gmail.com",
  appointmentUrl:
    "https://www.doctolib.fr/psychologue/l-etang-sale/benedicte-donet",
  social: {
    instagram: "https://www.instagram.com/benedicte.psyenligne/",
    facebook: "https://www.facebook.com/BenedicteDonetPhotography",
  },
  locale: {
    fr: {
      defaultSeoTitle: "Psychologue en ligne spécialisée EMDR, trauma et anxiété",
      defaultSeoDescription:
        "Psychologue en ligne, Bénédicte Donet accompagne les adultes en EMDR, trauma, anxiété, stress post-traumatique et sexualité.",
      area: "Téléconsultation en visio (Zoom / Doctolib)",
    },
    en: {
      defaultSeoTitle: "Online psychologist specializing in EMDR, trauma and anxiety",
      defaultSeoDescription:
        "Online psychologist Bénédicte Donet supports adults with EMDR, trauma, anxiety, post-traumatic stress and sexuality.",
      area: "Online consultations by video (Zoom / Doctolib)",
    },
  },
} as const;

export function getSiteGlobal(locale: Locale) {
  const localized = SITE.locale[locale];
  return {
    siteName: SITE.siteName,
    email: SITE.email,
    phone: SITE.phone,
    appointmentUrl: SITE.appointmentUrl,
    instagramUrl: SITE.social.instagram,
    facebookUrl: SITE.social.facebook,
    defaultSeoTitle: localized.defaultSeoTitle,
    defaultSeoDescription: localized.defaultSeoDescription,
    area: localized.area,
  };
}
