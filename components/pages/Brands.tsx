import type { CSSProperties } from "react";
import type { SiteContent } from "@/content/types";
import { PageHero } from "@/components/pages/PageHero";
import { ARROW } from "@/components/ui/icons";
import { getActivePartners } from "@/lib/db/partners";
import { HERO_IMAGE } from "@/lib/photos";

export async function Brands({ content }: { content: SiteContent }) {
  const b = content.brands;
  const lang = content.locale;
  const partners = await getActivePartners();
  const track = lang === "ar" ? 0 : "-0.02em";

  return (
    <main>
      <PageHero label={content.nav.brands} title={b.headline} lead={b.intro} image={HERO_IMAGE.brands} />

      <section className="nv-container nv-section">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {partners.map((partner, i) => {
            const card = (
              <>
                <div className="flex items-center justify-between">
                  <span className="nv-icon font-extrabold" aria-hidden dir="ltr">
                    {partner.name.charAt(0)}
                  </span>
                  <span className="nv-num nums">{String(i + 1).padStart(2, "0")}.</span>
                </div>

                {partner.logoPath ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={partner.logoPath} alt={partner.name} className="h-12 w-auto self-start object-contain" />
                ) : (
                  <h2 className="font-extrabold" style={{ fontSize: "var(--step-lead)", lineHeight: 1.15, letterSpacing: track }}>
                    {partner.name}
                  </h2>
                )}

                <p className="text-[var(--muted)]" style={{ fontSize: "var(--step-small)", lineHeight: 1.7 }}>
                  {lang === "ar" ? partner.descriptionAr : partner.descriptionEn}
                </p>

                {partner.websiteUrl && (
                  <span className="mt-auto inline-flex items-center gap-2 pt-2 font-semibold text-[var(--accent-text)]">
                    {lang === "ar" ? "زيارة الموقع" : "Visit website"}
                    {ARROW}
                  </span>
                )}
              </>
            );

            return (
              <li key={partner.id} data-reveal style={{ "--i": i % 3 } as CSSProperties}>
                {partner.websiteUrl ? (
                  <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer" className="nv-card flex h-full flex-col gap-4 no-underline">
                    {card}
                  </a>
                ) : (
                  <div className="nv-card flex h-full flex-col gap-4">{card}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
