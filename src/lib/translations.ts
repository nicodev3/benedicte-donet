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
    heroTitle: string;
    heroSubtitle: string;
    description: string;
    intro: string;
    readMore: string;
  };
  blogPost: {
    footerText: string;
    footerCta: string;
    serviceLinksTitle: string;
    serviceLinks: {
      psychotherapyTitle: string;
      psychotherapyText: string;
      emdrTitle: string;
      emdrText: string;
      practicalInfoTitle: string;
      practicalInfoText: string;
    };
    shareTitle: string;
    shareFacebook: string;
    shareLinkedIn: string;
    shareWhatsApp: string;
    shareEmail: string;
    shareCopyLink: string;
    shareLinkCopied: string;
    relatedTitle: string;
    relatedPrev: string;
    relatedNext: string;
    relatedCarouselLabel: string;
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
  reviews: {
    prev: string;
    next: string;
    carouselLabel: string;
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
      heroTitle: "Mon journal",
      heroSubtitle: "Pensées et actualités",
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
      serviceLinksTitle: "Approfondir l'accompagnement",
      serviceLinks: {
        psychotherapyTitle: "Psychothérapie en ligne",
        psychotherapyText:
          "Séances en visio pour traverser trauma, anxiété, stress post-traumatique et difficultés relationnelles.",
        emdrTitle: "Comprendre l'EMDR",
        emdrText:
          "Une approche reconnue pour accompagner les souvenirs douloureux et soutenir le système nerveux.",
        practicalInfoTitle: "Infos pratiques",
        practicalInfoText:
          "Durée des séances, cadre de la téléconsultation, prise de rendez-vous et questions fréquentes.",
      },
      shareTitle: "Partager cet article",
      shareFacebook: "Partager sur Facebook",
      shareLinkedIn: "Partager sur LinkedIn",
      shareWhatsApp: "Partager sur WhatsApp",
      shareEmail: "Partager par e-mail",
      shareCopyLink: "Copier le lien de l'article",
      shareLinkCopied: "Lien copié",
      relatedTitle: "À lire également",
      relatedPrev: "Article précédent",
      relatedNext: "Article suivant",
      relatedCarouselLabel: "Autres articles du blog",
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
    reviews: {
      prev: "Avis précédent",
      next: "Avis suivant",
      carouselLabel: "Témoignages de patients",
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
      heroTitle: "My journal",
      heroSubtitle: "Thoughts and updates",
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
      serviceLinksTitle: "Go deeper with support",
      serviceLinks: {
        psychotherapyTitle: "Online psychotherapy",
        psychotherapyText:
          "Video sessions for trauma, anxiety, post-traumatic stress and relationship difficulties.",
        emdrTitle: "Understanding EMDR",
        emdrText:
          "A recognised approach to support painful memories and nervous system regulation.",
        practicalInfoTitle: "Practical info",
        practicalInfoText:
          "Session length, online consultation setting, booking details and common questions.",
      },
      shareTitle: "Share this article",
      shareFacebook: "Share on Facebook",
      shareLinkedIn: "Share on LinkedIn",
      shareWhatsApp: "Share on WhatsApp",
      shareEmail: "Share by email",
      shareCopyLink: "Copy article link",
      shareLinkCopied: "Link copied",
      relatedTitle: "You may also like",
      relatedPrev: "Previous article",
      relatedNext: "Next article",
      relatedCarouselLabel: "More blog articles",
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
    reviews: {
      prev: "Previous review",
      next: "Next review",
      carouselLabel: "Patient testimonials",
    },
  },
};

export function useTranslations(locale: Locale): UiTranslations {
  return UI_TRANSLATIONS[locale];
}
