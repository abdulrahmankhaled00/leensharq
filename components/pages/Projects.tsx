"use client";

import { useState } from "react";
import Image from "next/image";
import type { SiteContent, Project } from "@/content/types";

const sectorPhoto: Record<Project["sector"], string> = {
  healthcare: "/images/electronic-instruments-digital-multimeter-frequency-counter.jpg",
  government: "/images/electrical-main-and-distribution-panel-for-480.jpg",
  education: "/images/virginia-tech-data-center.jpg",
  hospitality: "/images/free-computer-server-room-image.webp",
};

export function Projects({ content }: { content: SiteContent }) {
  const p = content.projects;
  const sectors = Array.from(new Set(p.list.map((item) => item.sector))) as Project["sector"][];
  const [active, setActive] = useState<Project["sector"] | "all">("all");

  const visible = active === "all" ? p.list : p.list.filter((item) => item.sector === active);

  return (
    <main className="wrap mt-section">
      <h1 className="head">{p.headline}</h1>
      <p className="lead mt-3">{p.intro}</p>

      <div className="flex flex-wrap gap-2 mt-10" role="group" aria-label={p.headline}>
        <button
          type="button"
          onClick={() => setActive("all")}
          className={`rounded-[var(--radius)] px-4 py-2 small font-semibold transition-colors ${
            active === "all" ? "bg-[var(--teal-900)] text-white" : "bg-[var(--surface)] hover:bg-[var(--surface-2)]"
          }`}
        >
          {content.locale === "ar" ? "الكل" : "All"}
        </button>
        {sectors.map((sector) => (
          <button
            key={sector}
            type="button"
            onClick={() => setActive(sector)}
            className={`rounded-[var(--radius)] px-4 py-2 small font-semibold transition-colors ${
              active === sector ? "bg-[var(--teal-900)] text-white" : "bg-[var(--surface)] hover:bg-[var(--surface-2)]"
            }`}
          >
            {p.sectorLabels[sector]}
          </button>
        ))}
      </div>

      <ul className="grid md:grid-cols-2 gap-gutter mt-gutter">
        {visible.map((item, i) => (
          <li
            key={item.name}
            className="rounded-[var(--radius)] bg-[var(--surface)] overflow-hidden"
            data-reveal
            style={{ "--i": i % 6 } as React.CSSProperties}
          >
            <div className="relative" style={{ aspectRatio: "16/9" }}>
              <Image src={sectorPhoto[item.sector]} alt="" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
            </div>
            <div className="p-7 md:p-8">
              <h2 style={{ fontSize: "var(--step-lead)", lineHeight: 1.15 }}>{item.name}</h2>
              <p className="mt-3" style={{ fontSize: "var(--step-body)" }}>
                {item.client}
              </p>
              <p className="mt-1 small">{item.scope}</p>
              <div className="mt-4 flex items-center justify-between small">
                <span className="font-semibold text-[var(--teal-700)]">{p.sectorLabels[item.sector]}</span>
                <span>{item.location}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
