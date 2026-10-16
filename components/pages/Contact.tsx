import type { CSSProperties } from "react";
import type { SiteContent } from "@/content/types";
import { CONTACT } from "@/content/types";
import { NvButton } from "@/components/ui/NvButton";
import { PageHero } from "@/components/pages/PageHero";
import { ARROW, ICON } from "@/components/ui/icons";
import { HERO_IMAGE } from "@/lib/photos";

export function Contact({ content }: { content: SiteContent }) {
  const c = content.contact;
  const lang = content.locale;
  const address = lang === "ar" ? CONTACT.addressAr : CONTACT.addressEn;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const track = lang === "ar" ? 0 : "-0.02em";

  const actions = [
    { label: c.phoneLabel, href: `tel:${CONTACT.phoneE164}`, value: CONTACT.phoneDisplay, icon: ICON.phone },
    { label: c.whatsappLabel, href: `https://wa.me/${CONTACT.phoneE164.replace("+", "")}`, value: CONTACT.phoneDisplay, icon: ICON.whatsapp },
    { label: c.emailLabel, href: `mailto:${CONTACT.email}`, value: CONTACT.email, icon: ICON.mail },
  ];

  return (
    <main>
      <PageHero label={content.nav.contact} title={c.headline} lead={c.intro} image={HERO_IMAGE.contact} />

      <section className="nv-container nv-section">
        <ul className="grid gap-4 md:grid-cols-3" role="list">
          {actions.map((action, i) => (
            <li key={action.label} data-reveal style={{ "--i": i } as CSSProperties}>
              <a
                href={action.href}
                target={action.href.startsWith("http") ? "_blank" : undefined}
                rel={action.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="nv-card group flex h-full min-h-[13rem] flex-col justify-between gap-8 no-underline"
              >
                <div className="flex items-center justify-between">
                  <span className="nv-icon">{action.icon}</span>
                  <span className="text-[var(--accent-text)] transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">{ARROW}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[var(--muted)] font-semibold" style={{ fontSize: "var(--step-small)" }}>
                    {action.label}
                  </span>
                  <span dir="ltr" className="font-extrabold break-words ltr:text-left rtl:text-right" style={{ fontSize: "clamp(1.25rem, 1rem + 1vw, 1.75rem)", lineHeight: 1.2, letterSpacing: track }}>
                    {action.value}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="nv-card flex flex-col justify-between gap-8 !p-8 md:!p-10" data-reveal>
            <span className="nv-icon">{ICON.pin}</span>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <span className="text-[var(--muted)] font-semibold" style={{ fontSize: "var(--step-small)" }}>
                  {c.addressLabel}
                </span>
                <p className="font-extrabold" style={{ fontSize: "var(--step-lead)", lineHeight: 1.3, letterSpacing: track }}>
                  {address}
                </p>
              </div>
              <div>
                <NvButton href={mapsHref} variant="outline" external icon={ARROW}>
                  {lang === "ar" ? "فتح في الخرائط" : "Open in Maps"}
                </NvButton>
              </div>
            </div>
          </div>

          <div
            className="flex flex-col justify-between gap-8 rounded-[var(--radius-lg)] bg-[var(--teal-900)] p-8 text-white md:p-10"
            data-reveal
            style={{ "--i": 1 } as CSSProperties}
          >
            <span className="nv-icon !bg-white/10 !text-[var(--teal-400)]">{ICON.download}</span>
            <div className="flex flex-col gap-5">
              <p className="font-extrabold" style={{ fontSize: "var(--step-lead)", lineHeight: 1.3, letterSpacing: track }}>
                {c.profileDownload}
              </p>
              <div>
                <NvButton href="/leen-profile.pdf" variant="accent" external icon={ICON.download}>
                  {content.footer.secondaryCta}
                </NvButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
