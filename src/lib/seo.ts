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
import { getAlternateTagSlug } from "@/lib/tags";

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

async function getProductAlternateLinks(slug: string): Promise<AlternateLink[]> {
  const products = await getCollection("products", ({ data }) => !data.draft);
  const matches = products.filter(
    (entry) => stripLocaleFromFilePath(entry.filePath, entry.id) === slug
  );
  const frEntry = matches.find((entry) => getLocaleFromFilePath(entry.filePath) === "fr");
  const enEntry = matches.find((entry) => getLocaleFromFilePath(entry.filePath) === "en");

  if (!frEntry || !enEntry) return [];

  const frSlug = stripLocaleFromFilePath(frEntry.filePath, frEntry.id);
  const enSlug = stripLocaleFromFilePath(enEntry.filePath, enEntry.id);

  return alternateSet(`/produit/${frSlug}/`, `/en/produit/${enSlug}/`);
}

async function getTagAlternateLinks(
  locale: Locale,
  tagSlug: string
): Promise<AlternateLink[]> {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const alternateSlug = getAlternateTagSlug(posts, locale, tagSlug);
  if (!alternateSlug) return [];

  const frSlug = locale === "fr" ? tagSlug : alternateSlug;
  const enSlug = locale === "en" ? tagSlug : alternateSlug;

  return alternateSet(`/blog/tag/${frSlug}/`, `/en/blog/tag/${enSlug}/`);
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

  const tagMatch = unlocalizedPath.match(/^\/blog\/tag\/([^/]+)\/$/);
  if (tagMatch?.[1]) {
    return getTagAlternateLinks(locale, tagMatch[1]);
  }

  const productMatch = unlocalizedPath.match(/^\/produit\/([^/]+)\/$/);
  if (productMatch?.[1]) {
    return getProductAlternateLinks(productMatch[1]);
  }

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
