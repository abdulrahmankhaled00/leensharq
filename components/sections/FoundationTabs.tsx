"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Image from "@/components/ui/Photo";
import type { SiteContent } from "@/content/types";
import type { Pic } from "@/lib/photos";
import { NvButton } from "@/components/ui/NvButton";
import { ARROW, CHECK } from "@/components/ui/icons";

interface FoundationTabsProps {
  data: SiteContent["home"]["foundation"];
  image: Pic;
  aboutHref: string;
  dir: "rtl" | "ltr";
}

/**
 * Two-column "about" section: eyebrow, heading, WAI-ARIA tabs whose panel text swaps, two benefits,
 * and a layered image. All panels are server-rendered (inactive ones `hidden`) so the text is in the HTML.
 */
export function FoundationTabs({ data, image, aboutHref, dir }: FoundationTabsProps) {
  const uid = useId();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const titleId = `${uid}-title`;
  const count = data.tabs.length;

  const focusTab = (i: number) => {
    const next = (i + count) % count;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  // Arrow keys follow the visual order, so they swap meaning in RTL.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const forward = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
    const back = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
    if (e.key === forward) focusTab(active + 1);
    else if (e.key === back) focusTab(active - 1);
    else if (e.key === "Home") focusTab(0);
    else if (e.key === "End") focusTab(count - 1);
    else return;
    e.preventDefault();
  };

  return (
    <section className="nv-container nv-section" aria-labelledby={titleId}>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col gap-7">
          <p className="nv-label">{data.eyebrow}</p>
          <h2 id={titleId} className="nv-h2 -mt-2">
            {data.heading}
          </h2>

          <div role="tablist" aria-label={data.tabsLabel} className="nv-tabs" onKeyDown={onKeyDown}>
            {data.tabs.map((tab, i) => (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${uid}-tab-${tab.id}`}
                aria-selected={active === i}
                aria-controls={`${uid}-panel-${tab.id}`}
                tabIndex={active === i ? 0 : -1}
                className="nv-tab"
                onClick={() => setActive(i)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="nv-tab-panels">
            {data.tabs.map((tab, i) => (
              <div
                key={tab.id}
                role="tabpanel"
                id={`${uid}-panel-${tab.id}`}
                aria-labelledby={`${uid}-tab-${tab.id}`}
                hidden={active !== i}
                className="nv-tab-panel"
              >
                <p className="nv-lead !max-w-none">{tab.body}</p>
              </div>
            ))}
          </div>

          <ul className="grid gap-3 sm:grid-cols-2" role="list">
            {data.benefits.map((b) => (
              <li key={b} className="nv-check nv-benefit">
                {CHECK}
                {b}
              </li>
            ))}
          </ul>

          <NvButton href={aboutHref} icon={ARROW} className="self-start">
            {data.cta}
          </NvButton>
        </div>

        <div className="nv-layered" data-reveal>
          <span className="nv-layered-outline" aria-hidden />
          <span className="nv-layered-block" aria-hidden />
          <span className="nv-layered-square" aria-hidden />
          <span className="nv-layered-bars" aria-hidden />
          <div className="nv-layered-photo">
            <Image src={image.src} alt={data.imageAlt} fill sizes="(min-width: 1024px) 40vw, 90vw" className={`object-cover ${image.position ?? ""}`} />
          </div>
        </div>
      </div>
    </section>
  );
}
