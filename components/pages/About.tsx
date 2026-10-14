import Image from "next/image";
import type { SiteContent } from "@/content/types";

export function About({ content }: { content: SiteContent }) {
  const a = content.about;
  const lang = content.locale;
  const cards = [a.vision, a.mission, a.whyUs];
  const tints = ["bg-[var(--teal-600)]", "bg-[var(--red-600)]", "bg-[var(--teal-900)]"];

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
      alt: { ar: "ممر بين صفوف من خزانات الخوادم", en: "Aisle between rows of server racks" },
    },
  ];

  return (
    <main className="wrap mt-section">
      <div className="grid md:grid-cols-12 gap-gutter items-end" data-reveal>
        <h1 className="md:col-span-7 head">{a.headline}</h1>
        <p className="md:col-span-5 lead">{a.intro}</p>
      </div>

      <div className="relative mt-section rounded-[var(--radius)] overflow-hidden" style={{ aspectRatio: "16/7" }} data-reveal>
        <div className="shutter absolute inset-0">
          <Image
            src="/images/leen-hero-architecture.png"
            alt={
              lang === "ar"
                ? "أفق مدينة الرياض ليلًا، ويظهر فيه برج المملكة وبرج الفيصلية"
                : "Riyadh skyline at night, with Kingdom Tower and Al Faisaliah Tower"
            }
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-gutter mt-gutter">
        {strip.map((s, i) => (
          <div
            key={s.src}
            className="relative rounded-[8px] overflow-hidden"
            style={{ aspectRatio: "4/3", "--i": i } as React.CSSProperties}
            data-reveal
          >
            <Image src={s.src} alt={s.alt[lang]} fill sizes="33vw" className="object-cover" />
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-gutter mt-section">
        {cards.map((c, i) => (
          <div
            key={c.title}
            className={`${tints[i]} text-white rounded-[var(--radius)] p-7 md:p-9`}
            data-reveal
            style={{ "--i": i } as React.CSSProperties}
          >
            <h2 className="font-bold" style={{ fontSize: "var(--step-head)", lineHeight: 1 }}>
              {c.title}
            </h2>
            <p className="mt-4" style={{ fontSize: "var(--step-body)" }}>
              {c.body}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
