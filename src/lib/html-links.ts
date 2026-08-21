import { SITE } from "@/site.config";

function getAttr(attrs: string, name: string): string | undefined {
  const match = attrs.match(
    new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i")
  );
  return match?.[1] ?? match?.[2] ?? match?.[3];
}

function normalizeHost(hostname: string): string {
  return hostname.replace(/^www\./i, "").toLowerCase();
}

/**
 * Lien vers un autre domaine (http/https), hors du site courant.
 * Les chemins relatifs, ancres, mailto et tel restent en navigation normale.
 */
export function isExternalHref(
  href: string,
  siteUrl: string = SITE.url
): boolean {
  const trimmed = href.trim();
  if (!trimmed) return false;
  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("?") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:")
  ) {
    return false;
  }

  try {
    const siteHost = normalizeHost(new URL(siteUrl).hostname);
    const url = new URL(trimmed, siteUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    return normalizeHost(url.hostname) !== siteHost;
  } catch {
    return false;
  }
}

/**
 * Ajoute target="_blank" + rel="noopener noreferrer" aux liens externes du HTML.
 */
export function enhanceExternalLinks(
  html: string,
  siteUrl: string = SITE.url
): string {
  return html.replace(/<a\b([^>]*)>/gi, (fullTag, attrs: string) => {
    const href = getAttr(attrs, "href");
    if (!href || !isExternalHref(href, siteUrl)) return fullTag;

    let nextAttrs = attrs;

    if (/\btarget\s*=/i.test(nextAttrs)) {
      nextAttrs = nextAttrs.replace(
        /\btarget\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i,
        'target="_blank"'
      );
    } else {
      nextAttrs += ' target="_blank"';
    }

    const existingRel = getAttr(nextAttrs, "rel") ?? "";
    const relParts = new Set(
      existingRel
        .split(/\s+/)
        .map((part) => part.trim().toLowerCase())
        .filter(Boolean)
    );
    relParts.add("noopener");
    relParts.add("noreferrer");
    const relValue = [...relParts].join(" ");

    if (/\brel\s*=/i.test(nextAttrs)) {
      nextAttrs = nextAttrs.replace(
        /\brel\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i,
        `rel="${relValue}"`
      );
    } else {
      nextAttrs += ` rel="${relValue}"`;
    }

    return `<a${nextAttrs}>`;
  });
}
