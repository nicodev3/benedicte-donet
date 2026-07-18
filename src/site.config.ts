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
  email: "donetbenedicte@gmail.com",
  appointmentUrl:
    "https://www.doctolib.fr/psychologue/l-etang-sale/benedicte-donet",
  /** Code fourni par Google Search Console (méthode balise HTML). Laisser vide si vérification DNS. */
  googleSiteVerification: "",
  address: {
    streetAddress: "349 routes des canots",
    postalCode: "97427",
    addressLocality: "L'Étang-Salé",
    addressRegion: "La Réunion",
    addressCountry: "RE",
  },
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
      knowsAbout: [
        "EMDR",
        "Psychologue EMDR",
        "EMDR en ligne",
        "Trauma",
        "Anxiété",
        "Stress post-traumatique",
        "Psychothérapie en ligne",
        "Pleine conscience",
      ],
    },
    en: {
      defaultSeoTitle: "Online psychologist specializing in EMDR, trauma and anxiety",
      defaultSeoDescription:
        "Online psychologist Bénédicte Donet supports adults with EMDR, trauma, anxiety, post-traumatic stress and sexuality.",
      area: "Online consultations by video (Zoom / Doctolib)",
      knowsAbout: [
        "EMDR",
        "Online EMDR psychologist",
        "Online EMDR",
        "Trauma",
        "Anxiety",
        "Post-traumatic stress",
        "Online psychotherapy",
        "Mindfulness",
      ],
    },
  },
} as const;

export function getSiteGlobal(locale: Locale) {
  const localized = SITE.locale[locale];
  return {
    siteName: SITE.siteName,
    email: SITE.email,
    appointmentUrl: SITE.appointmentUrl,
    instagramUrl: SITE.social.instagram,
    facebookUrl: SITE.social.facebook,
    address: SITE.address,
    defaultSeoTitle: localized.defaultSeoTitle,
    defaultSeoDescription: localized.defaultSeoDescription,
    area: localized.area,
    knowsAbout: localized.knowsAbout,
  };
}
