export const DEFAULT_LOCALE = "fr";
export const LOCALES = ["fr", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function getLocaleFromPath(pathname: string): Locale {
  const segment = pathname.split("/").filter(Boolean)[0];
  return isLocale(segment) ? segment : DEFAULT_LOCALE;
}

export function getLocaleFromId(id: string): Locale {
  const suffix = id.split(".").at(-1);
  return isLocale(suffix) && suffix !== DEFAULT_LOCALE ? suffix : DEFAULT_LOCALE;
}

export function getLocaleFromFilePath(filePath: string | undefined): Locale {
  const match = filePath?.match(/\.([a-z]{2})\.[^.]+$/);
  return isLocale(match?.[1]) ? match[1] : DEFAULT_LOCALE;
}

export function stripLocaleFromId(id: string): string {
  const suffix = id.split(".").at(-1);
  return isLocale(suffix)
    ? id.slice(0, -(suffix.length + 1))
    : id;
}

export function stripLocaleFromFilePath(
  filePath: string | undefined,
  fallbackId: string
): string {
  if (!filePath) return stripLocaleFromId(fallbackId);

  const normalized = filePath.replace(/\\/g, "/");
  const contentMatch = normalized.match(/src\/content\/(?:pages|blog)\/(.+)$/);
  const relativePath = contentMatch?.[1] ?? normalized.split("/").at(-1) ?? fallbackId;

  return relativePath
    .replace(/\.[a-z]{2}\.[^.]+$/, "")
    .replace(/\.[^.]+$/, "");
}

export function localizedPath(path: string, locale: Locale): string {
  if (!path.startsWith("/") || /^https?:\/\//.test(path)) return path;

  const cleanPath = path === "/" ? "/" : `/${path.split("/").filter(Boolean).join("/")}/`;

  if (locale === DEFAULT_LOCALE) {
    return cleanPath.replace(/^\/en\/?/, "/") || "/";
  }

  if (cleanPath === "/") return `/${locale}/`;
  if (cleanPath.startsWith(`/${locale}/`)) return cleanPath;
  return `/${locale}${cleanPath}`;
}

export function alternateLocalePath(pathname: string, locale: Locale): string {
  const targetLocale = getAlternateLocale(locale);
  const pathWithoutLocale =
    locale === DEFAULT_LOCALE
      ? pathname
      : pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";

  return localizedPath(pathWithoutLocale, targetLocale);
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "fr" ? "en" : "fr";
}

export function getLocaleSwitchLabel(locale: Locale): string {
  return getAlternateLocale(locale).toUpperCase();
}
