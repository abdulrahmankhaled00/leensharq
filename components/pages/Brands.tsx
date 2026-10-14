import { Fragment } from "react";
import Image from "next/image";
import type { SiteContent } from "@/content/types";
import { Tile, Board } from "@/components/Tile";
import { getActivePartners } from "@/lib/db/partners";

const insertedPhotos: Record<number, { src: string; alt: { ar: string; en: string } }> = {
  4: {
    src: "/images/leen-hero-architecture.png",
    alt: { ar: "لوحة كهربائية رئيسية للتوزيع", en: "Main electrical distribution switchgear" },
  },
  9: {
    src: "/images/leen-hero-architecture.png",
    alt: { ar: "ممر بين صفوف من خزانات الخوادم", en: "Aisle between rows of server racks" },
  },
  12: {
    src: "/images/leen-hero-architecture.png",
    alt: { ar: "أفق مدينة الرياض ليلًا", en: "Riyadh skyline at night" },
  },
};

export async function Brands({ content }: { content: SiteContent }) {
  const b = content.brands;
  const partners = await getActivePartners();
  const lang = content.locale;

  return (
    <main className="wrap mt-section">
      <Board>
        <Tile variant="accent" colSpan={12} className="md:!col-span-8" reveal={false}>
          <h1 className="head">{b.headline}</h1>
          <p className="lead mt-3 opacity-90">{b.intro}</p>
        </Tile>
        <Tile variant="photo" colSpan={12} className="md:!col-span-4 relative overflow-hidden" minHeight="10rem">
          <Image
            src="/images/leen-hero-architecture.png"
            alt={lang === "ar" ? "خزانات شبكات بأسلاك زرقاء مرتبة" : "Networking racks with neatly dressed blue cabling"}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
        </Tile>

        {partners.map((partner, i) => (
          <Fragment key={partner.id}>
            {insertedPhotos[i] && (
              <Tile
                variant="photo"
                colSpan={12}
                className="md:!col-span-4 relative overflow-hidden"
                minHeight="9rem"
              >
                <Image
                  src={insertedPhotos[i].src}
                  alt={insertedPhotos[i].alt[lang]}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </Tile>
            )}
            <Tile
              variant={i % 3 === 1 ? "surface-2" : "surface"}
              colSpan={12}
              className="md:!col-span-4"
              index={i}
            >
              {partner.logoPath ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={partner.logoPath}
                  alt={partner.name}
                  className="h-12 object-contain"
                  style={{ filter: "grayscale(1)" }}
                />
              ) : (
                <h3 className="font-extrabold" style={{ fontSize: "1.375rem", lineHeight: 1.2 }}>
                  {partner.name}
                </h3>
              )}
              <p className="mt-3" style={{ fontSize: "var(--step-body)" }}>
                {lang === "ar" ? partner.descriptionAr : partner.descriptionEn}
              </p>
            </Tile>
          </Fragment>
        ))}
      </Board>
    </main>
  );
}
