/**
 * Configuration technique du site.
 * Les contenus éditables par la cliente sont dans src/content/settings/.
 */
export const SITE = {
  name: "Bénédicte Donet — Psychologue en ligne",
  url: "https://www.benedictedonet-psyenligne.com",
  defaultTitle: "Psychologue en ligne spécialisée EMDR, trauma et anxiété",
  defaultDescription:
    "Psychologue en ligne, Bénédicte Donet accompagne les adultes en EMDR, trauma, anxiété, stress post-traumatique et sexualité.",
  locale: "fr_FR",
  phone: "+33 6 17 78 98 78",
  email: "donetbenedicte@gmail.com",
  appointmentUrl:
    "https://www.doctolib.fr/psychologue/l-etang-sale/benedicte-donet",
  social: {
    instagram: "https://www.instagram.com/benedicte.psyenligne/",
    facebook: "https://www.facebook.com/BenedicteDonetPhotography",
  },
} as const;
