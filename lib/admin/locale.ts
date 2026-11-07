import { cookies } from "next/headers";
import { ADMIN_DICTS, ADMIN_LOCALE_COOKIE, DEFAULT_ADMIN_LOCALE, isAdminLocale, type AdminLocale } from "./i18n";

/** Dashboard language from its own cookie (independent of the public site's /en prefix). */
export async function getAdminLocale(): Promise<AdminLocale> {
  const value = (await cookies()).get(ADMIN_LOCALE_COOKIE)?.value;
  return isAdminLocale(value) ? value : DEFAULT_ADMIN_LOCALE;
}

export async function getAdminT() {
  const locale = await getAdminLocale();
  return { locale, t: ADMIN_DICTS[locale] };
}
