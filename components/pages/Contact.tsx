import type { CSSProperties } from "react";
import type { SiteContent } from "@/content/types";
import { CONTACT, mapEmbedUrl, mapLinkUrl } from "@/content/types";
import { LocationMap } from "@/components/sections/LocationMap";
import { NvButton } from "@/components/ui/NvButton";
import { PageHero } from "@/components/pages/PageHero";
import { ARROW, ICON } from "@/components/ui/icons";
import { HERO_IMAGE } from "@/lib/photos";
import { getCompanyProfile } from "@/lib/site-data";

export async function Contact({ content }: { content: SiteContent }) {
  const c = content.contact;
  const lang = content.locale;
  const profile = await getCompanyProfile(lang);
  const address = lang === "ar" ? CONTACT.addressAr : CONTACT.addressEn;
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

        {/* Location: embedded map is the primary presentation */}
        <div className="nv-location mt-4" data-reveal aria-labelledby="contact-location-title" role="group">
          <div className="nv-location-info">
            <span className="nv-icon">{ICON.pin}</span>
            <div className="flex flex-col gap-2">
              <span className="text-[var(--muted)] font-semibold" style={{ fontSize: "var(--step-small)" }}>
                {c.addressLabel}
              </span>
              <h2 id="contact-location-title" className="nv-h3">
                {c.locationHeading}
              </h2>
              <p className="font-semibold" style={{ fontSize: "var(--step-body)", lineHeight: 1.6 }}>
                {address}
              </p>
            </div>
            <a href={mapLinkUrl()} target="_blank" rel="noopener noreferrer" className="nv-text-link">
              {c.openInMaps}
              {ARROW}
            </a>
          </div>
          <LocationMap embedUrl={mapEmbedUrl(lang)} title={c.mapTitle} />
        </div>

        {profile && (
        <div
          className="mt-4 flex flex-col gap-6 rounded-[var(--radius-lg)] bg-[var(--teal-900)] p-8 text-white md:flex-row md:items-center md:justify-between md:p-10"
          data-reveal
        >
          <div className="flex items-center gap-5">
            <span className="nv-icon flex-none !bg-white/10 !text-[var(--teal-400)]">{ICON.download}</span>
            <p className="font-extrabold" style={{ fontSize: "var(--step-lead)", lineHeight: 1.3, letterSpacing: track }}>
              {c.profileDownload}
            </p>
          </div>
          <div className="flex-none">
            <NvButton href={profile.href} variant="accent" external icon={ICON.download}>
              {profile.label}
            </NvButton>
          </div>
        </div>
        )}
      </section>
    </main>
  );
}
