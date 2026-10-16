import Image from "next/image";
import type { SiteContent } from "@/content/types";
import { PageHero } from "@/components/pages/PageHero";
import { SERVICE_ICONS } from "@/components/ui/icons";
import { HERO_IMAGE, photo, SERVICE_PHOTOS, type Pic } from "@/lib/photos";

/** Larger crops read better on the full-width rows than the square-ish home cards. */
const ROW_PHOTO: Record<string, Pic> = { ...SERVICE_PHOTOS, tools: { src: photo("server-rack"), position: "object-[50%_35%]" } };

export function Services({ content }: { content: SiteContent }) {
  const s = content.services;
  const track = content.locale === "ar" ? 0 : "-0.025em";

  return (
    <main>
      <PageHero label={content.nav.services} title={s.headline} lead={s.intro} image={HERO_IMAGE.services} />

      <section className="nv-container nv-section">
        <ul className="flex flex-col gap-5 lg:gap-8" role="list">
          {s.list.map((service, i) => {
            const pic = ROW_PHOTO[service.id];
            return (
              <li
                key={service.id}
                data-reveal
                className="nv-card grid overflow-hidden !p-0 lg:grid-cols-2"
              >
                <div className={`relative min-h-[16rem] sm:min-h-[22rem] lg:min-h-[28rem] ${i % 2 ? "lg:order-2" : ""}`}>
                  <Image
                    src={pic.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className={`object-cover ${pic.position ?? ""}`}
                  />
                </div>
                <div className="flex flex-col justify-center gap-5 p-7 sm:p-10 lg:p-14">
                  <div className="flex items-center gap-4">
                    <span className="nv-icon">{SERVICE_ICONS[service.id]}</span>
                    <span className="nv-num nums">{String(i + 1).padStart(2, "0")}.</span>
                  </div>
                  <h2 className="font-extrabold" style={{ fontSize: "clamp(1.75rem, 1.1rem + 2.2vw, 3rem)", lineHeight: 1.1, letterSpacing: track }}>
                    {service.name}
                  </h2>
                  <p className="font-semibold text-[var(--accent-text)]" style={{ fontSize: "var(--step-body)", lineHeight: 1.5 }}>
                    {service.summary}
                  </p>
                  <p className="text-[var(--muted)]" style={{ fontSize: "var(--step-body)", lineHeight: 1.7 }}>
                    {service.detail}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
