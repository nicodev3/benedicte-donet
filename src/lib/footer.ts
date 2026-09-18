import type { Locale } from "@/lib/i18n";
import { SITE } from "@/site.config";

export interface FooterLink {
  label: string;
  url: string;
}

export interface FooterContent {
  text: string;
  quickLinks: FooterLink[];
  legalLinks: FooterLink[];
  cta: FooterLink;
}

const FOOTER: Record<Locale, FooterContent> = {
  fr: {
    text: "Bénédicte Donet, psychologue clinicienne en ligne. Accompagnement en visio : trauma-thérapies, EMDR, anxiété, sexualité.",
    quickLinks: [
      { label: "Consultations", url: "/psychotherapie/" },
      { label: "À propos", url: "/a-propos/" },
      { label: "Infos pratiques", url: "/infos-pratiques/" },
      { label: "Blog", url: "/blog/" },
      { label: "Photothérapie", url: "/phototherapie/" },
      { label: "Masterclass", url: "/masterclass/" },
    ],
    legalLinks: [
      { label: "Mentions légales", url: "/mentions-legales/" },
      { label: "Politique de confidentialité", url: "/politique-de-confidentialite/" },
    ],
    cta: {
      label: "Je prends rendez-vous",
      url: SITE.appointmentUrl,
    },
  },
  en: {
    text: "Bénédicte Donet, online clinical psychologist. Video consultations for trauma therapy, EMDR, anxiety and sexuality.",
    quickLinks: [
      { label: "Consultations", url: "/psychotherapie/" },
      { label: "About", url: "/a-propos/" },
      { label: "Practical info", url: "/infos-pratiques/" },
      { label: "Blog", url: "/blog/" },
      { label: "Phototherapy", url: "/phototherapie/" },
      { label: "Masterclass", url: "/masterclass/" },
    ],
    legalLinks: [
      { label: "Legal notice", url: "/mentions-legales/" },
      { label: "Privacy policy", url: "/politique-de-confidentialite/" },
    ],
    cta: {
      label: "Book a session",
      url: SITE.appointmentUrl,
    },
  },
};

export function getFooterContent(locale: Locale): FooterContent {
  return FOOTER[locale];
}
