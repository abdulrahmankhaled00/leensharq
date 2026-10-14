import Image from "next/image";
import type { SiteContent } from "@/content/types";
import { Tile, Board } from "@/components/Tile";

export function Home({ content }: { content: SiteContent }) {
  const base = content.locale === "ar" ? "" : "/en";
  const lang = content.locale;

  return (
    <main className="wrap pt-4 md:pt-8">
      {/* Hero board */}
      <Board className="mt-2">
        <Tile variant="paper" colSpan={12} className="lg:!col-span-7" minHeight="auto" reveal={false}>
          <h1
            className="font-extrabold text-ink text-5xl md:text-6xl lg:text-7xl xl:text-8xl max-w-[9ch]"
            style={{ lineHeight: 0.98, letterSpacing: "-0.03em" }}
          >
            {content.home.heroHeadline}
          </h1>
        </Tile>
        <Tile
          variant="photo"
          colSpan={12}
          className="lg:!col-span-5 relative overflow-hidden"
          minHeight="18rem"
          reveal
        >
          <div className="shutter absolute inset-0 rounded-[inherit]">
            <Image
              src="/images/leen-hero-architecture.png"
              alt={
                lang === "ar"
                  ? "أفق مدينة الرياض عند الغروب، ويظهر فيه برج المملكة ومركز الملك عبدالله المالي"
                  : "Riyadh skyline at sunset, with Kingdom Tower and the King Abdullah Financial District"
              }
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </Tile>

        <Tile variant="surface" colSpan={12} className="md:!col-span-8">
          <p style={{ fontSize: "var(--step-body)" }}>{content.home.heroEyebrowless}</p>
        </Tile>
        <Tile variant="dark" colSpan={12} className="md:!col-span-4" href={`${base}/contact`}>
          <p className="head" style={{ fontSize: "1.75rem" }}>
            {content.home.heroCta}
          </p>
        </Tile>
      </Board>

      {/* Section teasers */}
      <Board className="mt-gutter">
        <Tile variant="teal" colSpan={12} className="md:!col-span-5" rowSpan={2} href={`${base}/about`}>
          <p style={{ fontSize: "var(--step-body)" }}>{content.home.sectionTeasers.about}</p>
        </Tile>
        <Tile
          variant="photo"
          colSpan={12}
          className="md:!col-span-4 relative overflow-hidden"
          minHeight="10rem"
          href={`${base}/services`}
        >
          <Image
            src="/images/leen-hero-architecture.png"
            alt={lang === "ar" ? "أجهزة اختبار وقياس إلكترونية دقيقة" : "Precision electronic test and measurement instruments"}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />
          <p className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-white" style={{ fontSize: "var(--step-body)" }}>
            {content.home.sectionTeasers.services}
          </p>
        </Tile>
        <Tile variant="accent" colSpan={12} className="md:!col-span-3" href={`${base}/contact`}>
          <p style={{ fontSize: "var(--step-body)" }}>{content.home.sectionTeasers.contact}</p>
        </Tile>

        <Tile
          variant="photo"
          colSpan={12}
          className="md:!col-span-4 relative overflow-hidden"
          minHeight="10rem"
          href={`${base}/brands`}
        >
          <Image
            src="/images/leen-hero-architecture.png"
            alt={lang === "ar" ? "خزانات شبكات بأسلاك زرقاء مرتبة" : "Networking racks with neatly dressed blue cabling"}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />
          <p className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-white" style={{ fontSize: "var(--step-body)" }}>
            {content.home.sectionTeasers.brands}
          </p>
        </Tile>
        <Tile
          variant="photo"
          colSpan={12}
          className="md:!col-span-3 relative overflow-hidden"
          minHeight="10rem"
          href={`${base}/projects`}
        >
          <Image
            src="/images/leen-hero-architecture.png"
            alt={lang === "ar" ? "ممر بين صفوف من خزانات الخوادم" : "Aisle between rows of server racks"}
            fill
            sizes="(min-width: 768px) 25vw, 100vw"
            className="object-cover object-bottom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /> {/* taste-skill-ignore: scrim over photo */}
          <p className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-white" style={{ fontSize: "var(--step-body)" }}>
            {content.home.sectionTeasers.projects}
          </p>
        </Tile>
      </Board>
    </main>
  );
}
