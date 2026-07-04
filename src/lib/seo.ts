import { getCollection } from "astro:content";
import { SITE } from "@/site.config";
import {
  DEFAULT_LOCALE,
  getLocaleFromFilePath,
  getLocaleFromPath,
  localizedPath,
  stripLocaleFromFilePath,
  type Locale,
} from "@/lib/i18n";

export interface AlternateLink {
  href: string;
  hreflang: string;
}

function normalizePath(path: string): string {
  if (path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
}

function toAbsoluteUrl(path: string): string {
  return new URL(path, SITE.url).href;
}

function alternateSet(frPath: string, enPath: string): AlternateLink[] {
  return [
    { hreflang: "fr", href: toAbsoluteUrl(frPath) },
    { hreflang: "en", href: toAbsoluteUrl(enPath) },
    { hreflang: "x-default", href: toAbsoluteUrl(frPath) },
  ];
}

export async function getAlternateLinks(pathname: string): Promise<AlternateLink[]> {
  const path = normalizePath(pathname);

  if (path === "/" || path === "/en/") {
    return alternateSet("/", "/en/");
  }

  if (path === "/blog/" || path === "/en/blog/") {
    return alternateSet("/blog/", "/en/blog/");
  }

  const locale = getLocaleFromPath(path);
  const unlocalizedPath =
    locale === DEFAULT_LOCALE
      ? path
      : path.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";
  const slug = unlocalizedPath.replace(/^\/|\/$/g, "");

  if (!slug) return [];

  const entries = [
    ...(await getCollection("pages", ({ data }) => !data.draft)),
    ...(await getCollection("blog", ({ data }) => !data.draft)),
  ];

  const matches = entries.filter(
    (entry) => stripLocaleFromFilePath(entry.filePath, entry.id) === slug
  );
  const frEntry = matches.find((entry) => getLocaleFromFilePath(entry.filePath) === "fr");
  const enEntry = matches.find((entry) => getLocaleFromFilePath(entry.filePath) === "en");

  if (!frEntry || !enEntry) return [];

  const frSlug = stripLocaleFromFilePath(frEntry.filePath, frEntry.id);
  const enSlug = stripLocaleFromFilePath(enEntry.filePath, enEntry.id);

  return alternateSet(
    localizedPath(`/${frSlug}/`, "fr"),
    localizedPath(`/${enSlug}/`, "en")
  );
}

export function localeToSchemaLanguage(locale: Locale): string {
  return locale === "fr" ? "fr-FR" : "en-US";
}
