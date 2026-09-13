import type { CollectionEntry } from "astro:content";

/** Les pages classiques utilisent PageLayout ; l'accueil a son propre rendu. */
export type StandardPageEntry = Omit<CollectionEntry<"pages">, "data"> & {
  data: Exclude<CollectionEntry<"pages">["data"], { pageType: "home" }>;
};

export function isStandardPage(page: CollectionEntry<"pages">): page is StandardPageEntry {
  return page.data.pageType !== "home";
}
