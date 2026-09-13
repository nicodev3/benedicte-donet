/**
 * Événements Umami — noms explicites affichés dans le tableau de bord.
 */
export const UMAMI_EVENTS = {
  DOCTOLIB: "Clic RDV Doctolib",
  CONSULTATION: "Clic vers consultation",
  NEWSLETTER: "Clic abonnement newsletter",
  EMAIL: "Clic email contact",
  PRODUCT_ORDER: "Clic commande produit",
  CONTACT_INFOS: "Clic contact infos pratiques",
  MASTERCLASS: "Clic découvrir Masterclass",
  SHARE: "Partage article",
} as const;

/** Classifier les destinations sans enregistrer paramètres, fragments ou messages. */
export function getConversionDestination(href: string, baseUrl: string, email: string) {
  try {
    const base = new URL(baseUrl);
    const url = new URL(href, base);
    if (url.protocol === "mailto:" && url.pathname.toLowerCase() === email.toLowerCase()) {
      return { event: UMAMI_EVENTS.EMAIL, destination: "email" };
    }
    if (!/^https?:$/.test(url.protocol)) return undefined;
    if (url.hostname === "doctolib.fr" || url.hostname.endsWith(".doctolib.fr")) {
      return { event: UMAMI_EVENTS.DOCTOLIB, destination: "doctolib" };
    }
    if (url.origin !== base.origin) return undefined;
    const path = url.pathname.replace(/\/?$/, "/");
    if (/^\/(?:en\/)?psychotherapie\/$/.test(path)) {
      return { event: UMAMI_EVENTS.CONSULTATION, destination: path };
    }
    if (/^\/(?:en\/)?infos-pratiques\/$/.test(path)) {
      return { event: UMAMI_EVENTS.CONTACT_INFOS, destination: path };
    }
    if (/^\/(?:en\/)?masterclass\/$/.test(path)) {
      return { event: UMAMI_EVENTS.MASTERCLASS, destination: path };
    }
  } catch {
    // Un lien mal formé ne doit pas interrompre l’instrumentation des autres liens.
  }
  return undefined;
}

export type UmamiEventName = (typeof UMAMI_EVENTS)[keyof typeof UMAMI_EVENTS];

/** Attributs HTML `data-umami-event` (+ propriétés optionnelles). */
export function umamiAttrs(
  event: string,
  props?: Record<string, string>
): Record<string, string> {
  const attrs: Record<string, string> = {
    "data-umami-event": event,
  };

  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (value) attrs[`data-umami-event-${key}`] = value;
    }
  }

  return attrs;
}

export function isDoctolibUrl(href: string): boolean {
  return /doctolib\.fr/i.test(href);
}

export function isMasterclassUrl(href: string): boolean {
  try {
    const path = href.startsWith("http") ? new URL(href).pathname : href;
    return /(?:^|\/)(?:en\/)?masterclass\/?$/.test(path.split("#")[0] ?? "");
  } catch {
    return false;
  }
}

export function isInfosPratiquesFormUrl(href: string): boolean {
  return /(?:^|\/)(?:en\/)?infos-pratiques\/?#(?:contact|form)\b/i.test(href);
}
