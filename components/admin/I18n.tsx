"use client";

import { createContext, useContext, type ReactNode } from "react";
import { ADMIN_DICTS, type AdminDict, type AdminLocale } from "@/lib/admin/i18n";

const Ctx = createContext<{ locale: AdminLocale; t: AdminDict }>({ locale: "ar", t: ADMIN_DICTS.ar });

/** Gives client components the dashboard language. The dictionaries ship with the bundle, so only the locale is passed. */
export function AdminI18nProvider({ locale, children }: { locale: AdminLocale; children: ReactNode }) {
  return <Ctx.Provider value={{ locale, t: ADMIN_DICTS[locale] }}>{children}</Ctx.Provider>;
}

export function useAdminI18n() {
  return useContext(Ctx);
}
