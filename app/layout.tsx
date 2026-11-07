import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { schibsted, ibmPlexArabic } from "@/lib/fonts";
import { RevealObserver } from "@/components/RevealObserver";
import { LocaleSync } from "@/components/LocaleSync";
import { PageLoader } from "@/components/PageLoader";
import { ADMIN_LOCALE_COOKIE, DEFAULT_ADMIN_LOCALE, isAdminLocale } from "@/lib/admin/i18n";
import "./globals.css";
import "./nova.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://leensharq.com"),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const isAdmin = h.get("x-area") === "admin";

  // Public site: language from the URL (/en = English). Dashboard: its own cookie, never the URL.
  let locale: "ar" | "en" = h.get("x-locale") === "en" ? "en" : "ar";
  if (isAdmin) {
    const saved = (await cookies()).get(ADMIN_LOCALE_COOKIE)?.value;
    locale = isAdminLocale(saved) ? saved : DEFAULT_ADMIN_LOCALE;
  }

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${schibsted.variable} ${ibmPlexArabic.variable}`}
      data-area={isAdmin ? "admin" : "site"}
    >
      <body>
        {/* Public-site behaviour (intro loader, scroll reveals, URL-based lang/dir) stays out of the dashboard. */}
        {!isAdmin && <PageLoader locale={locale} />}
        {children}
        {!isAdmin && <RevealObserver />}
        {!isAdmin && <LocaleSync />}
      </body>
    </html>
  );
}
