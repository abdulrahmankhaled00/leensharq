import Image from "next/image";
import type { SiteContent } from "@/content/types";
import { CONTACT } from "@/content/types";

export function Contact({ content }: { content: SiteContent }) {
  const c = content.contact;
  const lang = content.locale;
  const address = lang === "ar" ? CONTACT.addressAr : CONTACT.addressEn;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  const actions = [
    { label: c.phoneLabel, href: `tel:${CONTACT.phoneE164}`, value: CONTACT.phoneDisplay },
    {
      label: c.whatsappLabel,
      href: `https://wa.me/${CONTACT.phoneE164.replace("+", "")}`,
      value: CONTACT.phoneDisplay,
    },
    { label: c.emailLabel, href: `mailto:${CONTACT.email}`, value: CONTACT.email },
  ];

  const strip = [
    {
      src: "/images/leen-hero-architecture.png",
      alt: { ar: "خزانات شبكات بأسلاك زرقاء مرتبة", en: "Networking racks with neatly dressed blue cabling" },
    },
    {
      src: "/images/leen-hero-architecture.png",
      alt: { ar: "لوحة كهربائية رئيسية للتوزيع", en: "Main electrical distribution switchgear" },
    },
    {
      src: "/images/leen-hero-architecture.png",
      alt: { ar: "أجهزة اختبار وقياس إلكترونية دقيقة", en: "Precision electronic test and measurement instruments" },
    },
  ];

  return (
    <main className="wrap mt-section">
      <div className="relative rounded-[var(--radius)] overflow-hidden" style={{ aspectRatio: "21/9" }} data-reveal>
        <div className="shutter absolute inset-0">
          <Image
            src="/images/leen-hero-architecture.png"
            alt={
              lang === "ar"
                ? "أفق الرياض عند الغروب قرب مركز الملك عبدالله المالي"
                : "Riyadh skyline at sunset near the King Abdullah Financial District"
            }
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--teal-900)]/80 via-transparent to-transparent" /> {/* taste-skill-ignore: scrim over photo */}
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
          <h1 className="text-white head" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            {c.headline}
          </h1>
          <p className="text-white/85 lead mt-2">{c.intro}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-gutter mt-gutter">
        {actions.map((action, i) => (
          <a
            key={action.label}
            href={action.href}
            target={action.href.startsWith("http") ? "_blank" : undefined}
            rel={action.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className={`rounded-[var(--radius)] p-7 md:p-8 flex flex-col justify-between min-h-[9rem] transition-colors ${
              i === 2 ? "bg-[var(--red-600)] text-white hover:bg-[#c40d1d]" : "bg-[var(--teal-900)] text-white hover:bg-[var(--teal-700)]"
            }`}
            data-reveal
            style={{ "--i": i } as React.CSSProperties}
          >
            <span dir="ltr" className="font-semibold" style={{ fontSize: "var(--step-lead)" }}>
              {action.value}
            </span>
            <span className="small font-semibold opacity-75 mt-4">{action.label}</span>
          </a>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-gutter mt-gutter">
        {strip.map((s) => (
          <div key={s.src} className="relative rounded-[8px] overflow-hidden" style={{ aspectRatio: "16/9" }} data-reveal>
            <Image src={s.src} alt={s.alt[lang]} fill sizes="50vw" className="object-cover" />
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-gutter mt-gutter">
        <a
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[var(--radius)] bg-[var(--surface)] p-7 md:p-8 hover:bg-[var(--surface-2)] transition-colors"
          data-reveal
        >
          <p style={{ fontSize: "var(--step-body)" }}>{address}</p>
          <span className="small font-semibold text-[var(--teal-700)] block mt-3">{c.addressLabel}</span>
        </a>
        <a
          href="/leen-profile.pdf"
          download
          className="rounded-[var(--radius)] bg-[var(--surface-2)] p-7 md:p-8 flex items-center hover:bg-[var(--surface)] transition-colors"
          data-reveal
        >
          <span style={{ fontSize: "var(--step-body)" }} className="font-semibold">
            {c.profileDownload}
          </span>
        </a>
      </div>
    </main>
  );
}
