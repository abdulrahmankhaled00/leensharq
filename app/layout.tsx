import type { Metadata } from "next";
import { headers } from "next/headers";
import { schibsted, ibmPlexArabic } from "@/lib/fonts";
import { RevealObserver } from "@/components/RevealObserver";
import { LocaleSync } from "@/components/LocaleSync";
import { PageLoader } from "@/components/PageLoader";
import "./globals.css";
import "./nova.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://leensharq.com"),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const locale = h.get("x-locale") === "en" ? "en" : "ar";

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${schibsted.variable} ${ibmPlexArabic.variable}`}
    >
      <body>
        <PageLoader locale={locale} />
        {children}
        <RevealObserver />
        <LocaleSync />
      </body>
    </html>
  );
}
