import { ar } from "./ar";
import { en } from "./en";
import type { Locale, SiteContent } from "./types";

export { CONTACT } from "./types";
export type { Locale, SiteContent } from "./types";

const dictionaries: Record<Locale, SiteContent> = { ar, en };

export function getContent(locale: Locale): SiteContent {
  return dictionaries[locale];
}
