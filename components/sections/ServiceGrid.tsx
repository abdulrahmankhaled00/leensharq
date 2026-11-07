import Link from "next/link";
import type { CSSProperties } from "react";
import type { SectionIntro, ServiceItem } from "@/content/types";
import { SectionHead } from "@/components/ui/SectionHead";
import { ARROW, SERVICE_ICONS } from "@/components/ui/icons";

interface ServiceGridProps {
  intro: SectionIntro;
  items: ServiceItem[];
  titleId: string;
  /** "" for Arabic, "/en" for English. Prefixed to each item's locale-neutral href. */
  base: string;
  ctaLabel: string;
}

/**
 * Detailed services: 1 → 2 → 3 columns, same icon family as ServiceShowcase.
 * The first card of each category carries the `service-<categoryId>` anchor the showcase links to.
 */
export function ServiceGrid({ intro, items, titleId, base, ctaLabel }: ServiceGridProps) {
  const anchored = new Set<string>();

  return (
    <section className="nv-container pb-[clamp(3.5rem,7vw,6.5rem)]" aria-labelledby={titleId}>
      <SectionHead title={intro.heading} description={intro.body} titleId={titleId} />

      <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3" role="list">
        {items.map((s, i) => {
          const anchor = anchored.has(s.categoryId) ? undefined : `service-${s.categoryId}`;
          anchored.add(s.categoryId);
          const body = (
            <>
              <span className="nv-icon-square">{SERVICE_ICONS[s.icon]}</span>
              <h3 className="nv-h3">{s.name}</h3>
              <p className="text-[var(--muted)]" style={{ fontSize: "var(--step-small)", lineHeight: 1.7 }}>
                {s.description}
              </p>
            </>
          );
          return (
            <li key={s.id} id={anchor} className="nv-anchor" data-reveal style={{ "--i": i % 3 } as CSSProperties}>
              {s.href ? (
                <Link href={`${base}${s.href}`} className="nv-card nv-service-card no-underline">
                  {body}
                  <span className="nv-service-cta">
                    {ctaLabel}
                    {ARROW}
                  </span>
                </Link>
              ) : (
                <article className="nv-card nv-service-card">{body}</article>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
