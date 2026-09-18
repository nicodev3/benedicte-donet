import type { Locale } from "@/lib/i18n";

export interface NavigationChild {
  label: string;
  url: string;
}

export interface NavigationItem {
  label: string;
  url: string;
  order: number;
  children?: NavigationChild[];
}

const NAVIGATION: Record<Locale, NavigationItem[]> = {
  fr: [
    { label: "Consultations", url: "/psychotherapie/", order: 2 },
    { label: "A propos", url: "/a-propos/", order: 6 },
    { label: "Infos pratiques", url: "/infos-pratiques/", order: 7 },
    { label: "Blog", url: "/blog/", order: 8 },
  ],
  en: [
    { label: "Consultations", url: "/psychotherapie/", order: 2 },
    { label: "About", url: "/a-propos/", order: 6 },
    { label: "Practical info", url: "/infos-pratiques/", order: 7 },
    { label: "Blog", url: "/blog/", order: 8 },
  ],
};

export function getNavigationItems(locale: Locale): NavigationItem[] {
  return [...NAVIGATION[locale]].sort((a, b) => a.order - b.order);
}
