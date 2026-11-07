import { ar } from "./ar";
import { en } from "./en";
import { serviceCategories, serviceItems } from "./services";
import type { Locale, ServiceCategory, ServiceItem, SiteContent } from "./types";

export { CONTACT, mapEmbedUrl, mapLinkUrl } from "./types";
export type { Locale, SiteContent } from "./types";

const dictionaries: Record<Locale, SiteContent> = { ar, en };

export function getContent(locale: Locale): SiteContent {
  return dictionaries[locale];
}

/** Visible records, sorted by `order` — the same rule the dashboard will apply. */
function published<T extends { order: number; visible: boolean }>(list: T[]): T[] {
  return list.filter((r) => r.visible).sort((a, b) => a.order - b.order);
}

export function getServiceCategories(locale: Locale): ServiceCategory[] {
  return published(serviceCategories).map((c) => ({
    id: c.id,
    icon: c.icon,
    name: c.name[locale],
    description: c.description[locale],
    image: c.image,
  }));
}

export function getServiceItems(locale: Locale): ServiceItem[] {
  return published(serviceItems).map((s) => ({
    id: s.id,
    categoryId: s.categoryId,
    icon: s.icon,
    name: s.name[locale],
    description: s.description[locale],
    href: s.href,
  }));
}
