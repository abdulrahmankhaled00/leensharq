"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { localeFromPathname } from "@/lib/locale-path";

/**
 * <html lang dir> is set once by the root layout, which Next does not re-render when you navigate between
 * the Arabic and English route groups. Without this, switching language swaps the content but leaves the old
 * direction and font in place. Runs before paint, so there is no visible flash of the wrong direction.
 */
export function LocaleSync() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const locale = localeFromPathname(pathname);
    const html = document.documentElement;
    const dir = locale === "ar" ? "rtl" : "ltr";
    if (html.lang !== locale) html.lang = locale;
    if (html.dir !== dir) html.dir = dir;
  }, [pathname]);

  return null;
}
