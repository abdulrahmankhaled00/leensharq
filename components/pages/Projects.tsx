"use client";

import { useState } from "react";
import Image from "next/image";
import type { CSSProperties } from "react";
import type { SiteContent, Project } from "@/content/types";
import { PageHero } from "@/components/pages/PageHero";
import { HERO_IMAGE, SECTOR_POOL, type Pic } from "@/lib/photos";

export function Projects({ content }: { content: SiteContent }) {
  const p = content.projects;
  const lang = content.locale;
  const sectors = Array.from(new Set(p.list.map((item) => item.sector))) as Project["sector"][];
  const [active, setActive] = useState<Project["sector"] | "all">("all");
  // Pick each project's photo once, from the full list, so filtering never changes which picture a project shows.
  const seen: Record<string, number> = {};
  const picFor = new Map<string, Pic>(
    p.list.map((item) => {
      const pool = SECTOR_POOL[item.sector];
      const n = seen[item.sector] ?? 0;
      seen[item.sector] = n + 1;
      return [item.name, pool[n % pool.length]];
    })
  );
  const visible = active === "all" ? p.list : p.list.filter((item) => item.sector === active);
  const track = lang === "ar" ? 0 : "-0.02em";

  const chips: { key: Project["sector"] | "all"; label: string }[] = [
    { key: "all", label: lang === "ar" ? "الكل" : "All" },
    ...sectors.map((sector) => ({ key: sector, label: p.sectorLabels[sector] })),
  ];

  return (
    <main>
      <PageHero label={content.nav.projects} title={p.headline} lead={p.intro} image={HERO_IMAGE.projects} />

      <section className="nv-container nv-section">
        <div className="flex flex-wrap gap-2" role="group" aria-label={p.headline}>
          {chips.map((chip) => (
            <button key={chip.key} type="button" className="nv-chip" aria-pressed={active === chip.key} onClick={() => setActive(chip.key)}>
              {chip.label}
            </button>
          ))}
        </div>

        <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3" role="list">
          {visible.map((item, i) => {
            const pic = picFor.get(item.name)!;
            return (
              <li key={item.name} data-reveal style={{ "--i": i % 3 } as CSSProperties} className="nv-card flex flex-col overflow-hidden !p-0">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={pic.src}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                    className={`object-cover ${pic.position ?? ""}`}
                  />
                  <span className="absolute start-4 top-4 rounded-full bg-[var(--surface-bright)] px-3 py-1 font-semibold text-[var(--teal-700)]" style={{ fontSize: "0.8125rem" }}>
                    {p.sectorLabels[item.sector]}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6 md:p-7">
                  <h2 className="font-extrabold" style={{ fontSize: "var(--step-lead)", lineHeight: 1.15, letterSpacing: track }}>
                    {item.name}
                  </h2>
                  <p className="font-semibold" style={{ fontSize: "var(--step-body)" }}>
                    {item.client}
                  </p>
                  <p className="text-[var(--muted)]" style={{ fontSize: "var(--step-small)", lineHeight: 1.6 }}>
                    {item.scope}
                  </p>
                  <p className="mt-auto pt-3 text-[var(--muted)]" style={{ fontSize: "var(--step-small)" }}>
                    {item.location}
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
