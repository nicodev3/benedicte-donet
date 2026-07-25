/**
 * Événements Umami — noms explicites affichés dans le tableau de bord.
 */
export const UMAMI_EVENTS = {
  DOCTOLIB: "Clic RDV Doctolib",
  FORM_SUBMIT: "Envoi formulaire contact",
  FORM_SUCCESS: "Succès formulaire contact",
  FORM_ERROR: "Erreur formulaire contact",
  NEWSLETTER: "Clic abonnement newsletter",
  EMAIL: "Clic email contact",
  PRODUCT_ORDER: "Clic commande produit",
  CONTACT_INFOS: "Clic contact infos pratiques",
  MASTERCLASS: "Clic découvrir Masterclass",
  SHARE: "Partage article",
} as const;

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
  return /(?:^|\/)(?:en\/)?infos-pratiques\/?#form\b/i.test(href);
}
