import type { NavigationSettings } from "@/lib/settings";

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

function normalizePath(path: string): string {
  if (path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
}

export function buildBreadcrumbs(
  pathname: string,
  currentLabel: string,
  navigation?: NavigationSettings,
  parent?: { label: string; url: string }
): BreadcrumbItem[] {
  const path = normalizePath(pathname);

  if (path === "/") return [];

  const items: BreadcrumbItem[] = [{ label: "Accueil", url: "/" }];

  if (parent) {
    items.push({ label: parent.label, url: parent.url });
    items.push({ label: currentLabel });
    return items;
  }

  if (!navigation) {
    items.push({ label: currentLabel });
    return items;
  }

  for (const navItem of navigation.items) {
    if (navItem.url === "/") continue;

    const navPath = normalizePath(navItem.url);

    if (navPath === path) {
      items.push({ label: currentLabel || navItem.label });
      return items;
    }

    const child = navItem.children?.find(
      (c) => c.visible && normalizePath(c.url) === path
    );

    if (child) {
      items.push({ label: navItem.label, url: navItem.url });

      if (normalizePath(child.url) !== navPath) {
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
