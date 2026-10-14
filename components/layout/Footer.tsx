import Link from "next/link";
import type { SiteContent } from "@/content/types";
import { CONTACT } from "@/content/types";
import credits from "@/public/images/credits.json";

export function Footer({ content }: { content: SiteContent }) {
  const base = content.locale === "ar" ? "" : "/en";
  const address = content.locale === "ar" ? CONTACT.addressAr : CONTACT.addressEn;

  const links = [
    { href: content.locale === "ar" ? "/" : "/en", label: content.nav.home },
    { href: `${base}/about`, label: content.nav.about },
    { href: `${base}/services`, label: content.nav.services },
    { href: `${base}/brands`, label: content.nav.brands },
    { href: `${base}/projects`, label: content.nav.projects },
    { href: `${base}/contact`, label: content.nav.contact },
  ];

  const wordParts =
    content.locale === "ar" ? ["لين", "الشرق", "القابضة"] : ["Leen", "Al Sharq", "Holding"];
  const blockColors = ["bg-[var(--teal-600)]", "bg-[var(--red-600)]", "bg-[var(--teal-400)]"];

  return (
    <footer className="wrap mt-section pb-6">
      <div className="rounded-[var(--radius)] bg-[var(--teal-900)] text-white overflow-hidden">
        <div className="px-6 md:px-10 pt-10 md:pt-14 pb-8 flex flex-wrap items-end gap-x-3 gap-y-2">
          {wordParts.map((w, i) => (
            <span
              key={w}
              className={`${blockColors[i % blockColors.length]} px-3 md:px-5 py-1 md:py-2 rounded-[6px] font-extrabold leading-none`}
              style={{ fontSize: "clamp(1.75rem, 6.5vw, 5rem)", letterSpacing: "-0.02em" }}
            >
              {w}
            </span>
          ))}
        </div>

        <div className="px-6 md:px-10 pb-8 grid grid-cols-2 md:grid-cols-12 gap-x-6 gap-y-6 text-small">
          <nav className="col-span-2 md:col-span-6 flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="opacity-85 hover:opacity-100">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="col-span-2 md:col-span-6 md:text-end flex flex-col gap-1 opacity-85">
            <span>{address}</span>
            <a href={`mailto:${CONTACT.email}`} className="hover:opacity-100">
              {CONTACT.email}
            </a>
            <a href={`tel:${CONTACT.phoneE164}`} dir="ltr" className="hover:opacity-100 md:self-end">
              {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>

        <div className="px-6 md:px-10 py-4 bg-black/15 flex items-center justify-between text-small opacity-70">
          <span>
            © {new Date().getFullYear()} {content.meta.siteName} — {content.footer.rights}
          </span>
          <a
            href={`https://wa.me/${CONTACT.phoneE164.replace("+", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[6px] bg-white/10 px-3 py-1.5 hover:bg-white/20 transition-colors"
          >
            {content.nav.getInTouch}
          </a>
        </div>
      </div>

      <p className="wrap mt-4 opacity-60 leading-relaxed" style={{ fontSize: "var(--step-body)" }}>
        {content.locale === "ar" ? "مصادر الصور: " : "Photography: "}
        {credits
          .filter((c) => c.creditRequired)
          .map((c, i, arr) => (
            <span key={c.file}>
              <a href={c.page} target="_blank" rel="noopener noreferrer" className="underline">
                {c.credit}
              </a>
              {i < arr.length - 1 ? " · " : ""}
            </span>
          ))}
      </p>
    </footer>
  );
}
