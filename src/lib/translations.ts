import type { Locale } from "@/lib/i18n";

interface UiTranslations {
  locale: {
    date: string;
    og: string;
  };
  common: {
    skipToContent: string;
    home: string;
    navigation: string;
    contact: string;
  };
  header: {
    openMenu: string;
    mainNavigation: string;
    appointmentCta: string;
  };
  footer: {
    quickLinks: string;
    allRightsReserved: string;
  };
  blog: {
    title: string;
    description: string;
    intro: string;
    readMore: string;
  };
  blogPost: {
    footerText: string;
    footerCta: string;
  };
  contactBlock: {
    title: string;
    doctolibCta: string;
    messageCta: string;
  };
  newsletter: {
    title: string;
    text: string;
    cta: string;
    emailSubject: string;
  };
}

export const UI_TRANSLATIONS: Record<Locale, UiTranslations> = {
  fr: {
    locale: {
      date: "fr-FR",
      og: "fr_FR",
    },
    common: {
      skipToContent: "Aller au contenu",
      home: "Accueil",
      navigation: "Navigation",
      contact: "Contact",
    },
    header: {
      openMenu: "Ouvrir le menu",
      mainNavigation: "Navigation principale",
      appointmentCta: "Prendre RDV",
    },
    footer: {
      quickLinks: "Liens rapides",
      allRightsReserved: "Tous droits réservés.",
    },
    blog: {
      title: "Le blog",
      description:
        "Articles de psychologie par Bénédicte Donet : trauma, EMDR, méditation, anxiété, relation au corps et bien plus.",
      intro:
        "Des articles pour mieux te comprendre : trauma, EMDR, méditation, anxiété, relation au corps.",
      readMore: "Lire l'article",
    },
    blogPost: {
      footerText:
        "Envie d'aller plus loin ? Je vous accompagne en téléconsultation.",
      footerCta: "Je prends rendez-vous",
    },
    contactBlock: {
      title: "Pour me contacter",
      doctolibCta: "Je prends RDV via Doctolib",
      messageCta: "Je prends RDV via message",
    },
    newsletter: {
      title: "La newsletter mensuelle",
      text: "Abonne-toi à la newsletter mensuelle t'offrant du contenu de qualité sur la psychologie : des articles pour mieux te comprendre, des interviews inspirantes et des méditations en ligne. Seulement un email par mois !",
      cta: "Je m'abonne",
      emailSubject: "Inscription newsletter",
    },
  },
  en: {
    locale: {
      date: "en-US",
      og: "en_US",
    },
    common: {
      skipToContent: "Skip to content",
      home: "Home",
      navigation: "Navigation",
      contact: "Contact",
    },
    header: {
      openMenu: "Open menu",
      mainNavigation: "Main navigation",
      appointmentCta: "Book a session",
    },
    footer: {
      quickLinks: "Quick links",
      allRightsReserved: "All rights reserved.",
    },
    blog: {
      title: "The blog",
      description:
        "Psychology articles by Bénédicte Donet: trauma, EMDR, meditation, anxiety, body awareness and more.",
      intro:
        "Articles to better understand yourself: trauma, EMDR, meditation, anxiety and your relationship with the body.",
      readMore: "Read article",
    },
    blogPost: {
      footerText:
        "Would you like to go further? I offer online consultations.",
      footerCta: "Book a session",
    },
    contactBlock: {
      title: "Contact me",
      doctolibCta: "Book via Doctolib",
      messageCta: "Book by message",
    },
    newsletter: {
      title: "The monthly newsletter",
      text: "Subscribe to the monthly newsletter for thoughtful psychology content: articles to better understand yourself, inspiring interviews and online meditations. Just one email per month.",
      cta: "Subscribe",
      emailSubject: "Newsletter subscription",
    },
  },
};

export function useTranslations(locale: Locale): UiTranslations {
  return UI_TRANSLATIONS[locale];
}
