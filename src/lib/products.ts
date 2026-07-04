import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import {
  DEFAULT_LOCALE,
  getContentSlug,
  getLocaleFromFilePath,
  type Locale,
} from "@/lib/i18n";

export async function getProductsForLocale(
  locale: Locale = DEFAULT_LOCALE
): Promise<CollectionEntry<"products">[]> {
  const products = await getCollection("products", ({ data }) => !data.draft);
  return products.filter(
    (product) => getLocaleFromFilePath(product.filePath) === locale
  );
}

export async function getProductStaticPaths(locale: Locale = DEFAULT_LOCALE) {
  const products = await getProductsForLocale(locale);

  return products.map((product) => ({
    params: { slug: getContentSlug(product.filePath, product.id) },
    props: { product },
  }));
}
