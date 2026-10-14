import Image from "next/image";
import type { SiteContent } from "@/content/types";
import { Tile, Board } from "@/components/Tile";

const photoByService: Record<string, { src: string; alt: { ar: string; en: string } }> = {
  networking: {
    src: "/images/leen-hero-architecture.png",
    alt: {
      ar: "ممرات من خزانات الشبكات بأسلاك زرقاء مرتبة",
      en: "Aisles of networking racks with neatly dressed blue cabling",
    },
  },
  measurements: {
    src: "/images/leen-hero-architecture.png",
    alt: { ar: "أجهزة قياس وتردد واختبار دقيقة", en: "Precision multimeter, frequency and signal test instruments" },
  },
  power: {
    src: "/images/leen-hero-architecture.png",
    alt: { ar: "لوحة كهربائية رئيسية للتوزيع", en: "Main electrical distribution switchgear" },
  },
  tools: {
    src: "/images/leen-hero-architecture.png",
    alt: { ar: "ممر بين صفوف من خزانات الخوادم", en: "Aisle between rows of server racks" },
  },
};

export function Services({ content }: { content: SiteContent }) {
  const s = content.services;
  const lang = content.locale;
  const fourWord = lang === "ar" ? "أربعة" : "Four";

  return (
    <main className="wrap mt-section">
      <Board>
        <Tile variant="paper" colSpan={12} className="md:!col-span-8" reveal={false}>
          <h1 className="head">{s.headline}</h1>
          <p className="lead mt-3">{s.intro}</p>
        </Tile>
        <Tile variant="dark" colSpan={12} className="md:!col-span-4" rowSpan={1}>
          <p style={{ fontSize: "var(--step-head)", lineHeight: 1 }}>{fourWord}</p>
        </Tile>

        {s.list.map((service, i) => {
          const photo = photoByService[service.id];
          const wide = i % 2 === 0;
          return (
            <Tile
              key={service.id}
              variant={i % 2 === 0 ? "surface" : "surface-2"}
              colSpan={12}
              className={wide ? "md:!col-span-7" : "md:!col-span-5"}
              index={i}
            >
              <h2 className="font-bold" style={{ fontSize: "var(--step-lead)", lineHeight: 1.15 }} data-reveal>
                {service.name}
              </h2>
              <p className="mt-3" style={{ fontSize: "var(--step-body)", "--i": 1 } as React.CSSProperties} data-reveal>
                {service.summary}
              </p>
              <p className="mt-3" style={{ fontSize: "var(--step-body)", "--i": 2 } as React.CSSProperties} data-reveal>
                {service.detail}
              </p>
              {photo && (
                <div className="relative mt-6 rounded-[8px] overflow-hidden" style={{ aspectRatio: "16/9" }} data-reveal>
                  <Image
                    src={photo.src}
                    alt={photo.alt[lang]}
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
            </Tile>
          );
        })}
      </Board>
    </main>
  );
}
