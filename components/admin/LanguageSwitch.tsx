"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ADMIN_LOCALE_COOKIE, type AdminLocale } from "@/lib/admin/i18n";
import { useAdminI18n } from "./I18n";
import { AI } from "./icons";

/**
 * Switches the dashboard language in place: saves the choice in a cookie scoped to /admin (so the
 * public site is untouched), flips lang/dir immediately, then re-renders the server components.
 * It never navigates, so the current page and any unsaved form input stay as they are.
 */
export function LanguageSwitch({ className = "" }: { className?: string }) {
  const { locale, t } = useAdminI18n();
  const router = useRouter();
  const [pending, start] = useTransition();
  const next: AdminLocale = locale === "ar" ? "en" : "ar";

  const toggle = () => {
    document.cookie = `${ADMIN_LOCALE_COOKIE}=${next}; path=/admin; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    const dir = next === "ar" ? "rtl" : "ltr";
    for (const el of [document.documentElement, document.querySelector<HTMLElement>(".ad-root")]) {
      if (!el) continue;
      el.lang = next;
      el.dir = dir;
    }
    start(() => router.refresh());
  };

  return (
    <button type="button" className={`ad-lang-switch ${className}`} onClick={toggle} disabled={pending} aria-label={t.nav.switchToLabel} lang={next}>
      {AI.globe}
      <span>{t.nav.switchTo}</span>
    </button>
  );
}
