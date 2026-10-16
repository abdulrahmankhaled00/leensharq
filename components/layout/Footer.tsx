import Image from "next/image";
import Link from "next/link";
import type { SiteContent } from "@/content/types";
import { CONTACT } from "@/content/types";
import { NvButton } from "@/components/ui/NvButton";

export function Footer({ content }: { content: SiteContent }) {
  const base = content.locale === "ar" ? "" : "/en";
  const address = content.locale === "ar" ? CONTACT.addressAr : CONTACT.addressEn;
  const f = content.footer;

  const links = [
    { href: content.locale === "ar" ? "/" : "/en", label: content.nav.home },
    { href: `${base}/about`, label: content.nav.about },
    { href: `${base}/services`, label: content.nav.services },
    { href: `${base}/brands`, label: content.nav.brands },
    { href: `${base}/projects`, label: content.nav.projects },
    { href: `${base}/contact`, label: content.nav.contact },
  ];

  return (
    <footer className="nv-footer">
        <Image src="/images/photos/riyadh-night.jpg" alt="" fill sizes="100vw" className="object-cover" />
        <div className="nv-scrim nv-scrim-flat" aria-hidden />

        <div className="nv-footer-inner nv-container grid gap-12">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <p className="flex items-center gap-4 font-semibold text-[var(--teal-400)]" style={{ fontSize: "0.8125rem" }}>
              <span className="h-px w-10 bg-[var(--teal-400)] opacity-70" aria-hidden />
              <span style={{ letterSpacing: content.locale === "ar" ? 0 : "0.14em", textTransform: content.locale === "ar" ? "none" : "uppercase" }}>
                {f.eyebrow}
              </span>
              <span className="h-px w-10 bg-[var(--teal-400)] opacity-70" aria-hidden />
            </p>
            <h2
              className="mt-5 font-extrabold"
              style={{
                fontSize: "clamp(2.25rem, 1rem + 5vw, 4.75rem)",
                lineHeight: content.locale === "ar" ? 1.25 : 0.98,
                letterSpacing: content.locale === "ar" ? 0 : "-0.045em",
              }}
            >
              {f.heading}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-white/80" style={{ fontSize: "var(--step-body)", lineHeight: 1.6 }}>
              {f.description}
            </p>
            <div className="mt-9 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:w-auto sm:flex-row">
              <NvButton href={`${base}/contact`} variant="accent">
                {f.primaryCta}
              </NvButton>
              <NvButton href="/leen-profile.pdf" variant="outline-light" external>
                {f.secondaryCta}
              </NvButton>
            </div>
          </div>

          <div className="grid gap-8 border-t border-white/20 pt-8 md:grid-cols-2">
            <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="nv-footer-link">
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-1 md:items-end md:text-end">
              <span className="nv-footer-link">{address}</span>
              <a href={`mailto:${CONTACT.email}`} className="nv-footer-link">
                {CONTACT.email}
              </a>
              <a href={`tel:${CONTACT.phoneE164}`} dir="ltr" className="nv-footer-link">
                {CONTACT.phoneDisplay}
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-white/20 pt-6 text-white/70 sm:flex-row sm:items-center sm:justify-between" style={{ fontSize: "0.875rem" }}>
            <span>
              © {new Date().getFullYear()} {content.meta.siteName} — {f.rights}
            </span>
            <span>{f.legalNote}</span>
          </div>
        </div>
    </footer>
  );
}
