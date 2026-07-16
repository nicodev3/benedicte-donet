import type { NavigationItem } from "@/lib/navigation";
import { SITE } from "@/site.config";
import { DEFAULT_LOCALE, localizedPath, type Locale } from "@/lib/i18n";
import { useTranslations } from "@/lib/translations";

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

/** Schema.org BreadcrumbList (sans @context, pour fusion dans @graph). */
export function buildBreadcrumbStructuredData(
  items: BreadcrumbItem[],
  pageUrl: string
): Record<string, unknown> | undefined {
  if (items.length < 2) return undefined;

  return {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.url ? { item: new URL(item.url, SITE.url).href } : {}),
    })),
  };
}

function normalizePath(path: string): string {
  if (path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
}

export function buildBreadcrumbs(
  pathname: string,
  currentLabel: string,
  navigation?: NavigationItem[],
  parent?: { label: string; url: string },
  locale: Locale = DEFAULT_LOCALE
): BreadcrumbItem[] {
  const t = useTranslations(locale);
  const path = normalizePath(pathname);

  if (path === localizedPath("/", locale)) return [];

  const items: BreadcrumbItem[] = [
    { label: t.common.home, url: localizedPath("/", locale) },
  ];

  if (parent) {
    items.push({ label: parent.label, url: parent.url });
    items.push({ label: currentLabel });
    return items;
  }

  if (!navigation) {
    items.push({ label: currentLabel });
    return items;
  }

  for (const navItem of navigation) {
    if (navItem.url === "/") continue;

    const navPath = normalizePath(localizedPath(navItem.url, locale));

    if (navPath === path) {
      items.push({ label: currentLabel || navItem.label });
      return items;
    }

    const child = navItem.children?.find(
      (c) => normalizePath(localizedPath(c.url, locale)) === path
    );

    if (child) {
      items.push({ label: navItem.label, url: localizedPath(navItem.url, locale) });

      if (normalizePath(localizedPath(child.url, locale)) !== navPath) {
        items.push({ label: currentLabel || child.label });
      } else {
        items.push({ label: currentLabel || navItem.label });
      }

      return items;
    }
  }

  items.push({ label: currentLabel });
  return items;
}
