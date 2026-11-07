import Link from "next/link";
import Image from "@/components/ui/Photo";
import type { CSSProperties } from "react";
import type { ServiceCategory, ServiceItem } from "@/content/types";
import { ARROW, SERVICE_ICONS } from "@/components/ui/icons";

const TONES = ["dark", "tint", "light"] as const;

interface ServiceShowcaseProps {
  categories: ServiceCategory[];
  /** Detailed services, listed under the category they belong to. */
  items?: ServiceItem[];
  /** Each card links to `${hrefPrefix}${category.id}`, e.g. "/services#service-" or "#service-". */
  hrefPrefix: string;
  labels: { discover: string; includes: string };
}

/**
 * The three primary services as one composition: a tall feature card beside two stacked cards
 * (desktop), feature over a pair (tablet), single column (mobile). Shared by the home page and
 * /services so the service design language and icons stay identical in both places.
 */
export function ServiceShowcase({ categories, items = [], hrefPrefix, labels }: ServiceShowcaseProps) {
  return (
    <ul className="nv-svc-grid" role="list">
      {categories.map((c, i) => {
        const subs = items.filter((s) => s.categoryId === c.id);
        return (
          <li key={c.id} className="nv-svc-cell" data-reveal style={{ "--i": i } as CSSProperties}>
            <Link href={`${hrefPrefix}${c.id}`} className="nv-svc" data-tone={TONES[i % TONES.length]} data-photo={c.image ? "" : undefined}>
              {c.image && (
                <span className="nv-svc-media" aria-hidden>
                  <Image src={c.image.src} alt="" fill sizes="(min-width: 1024px) 55vw, 100vw" className={`object-cover ${c.image.position ?? ""}`} />
                </span>
              )}
              <span className="nv-svc-pattern" aria-hidden />
              <span className="nv-svc-watermark" aria-hidden>
                {SERVICE_ICONS[c.icon]}
              </span>

              <span className="nv-svc-top">
                <span className="nv-svc-icon">{SERVICE_ICONS[c.icon]}</span>
                <span className="nv-svc-num nums" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>

              <span className="nv-svc-body">
                <h3 className="nv-svc-title">{c.name}</h3>
                <span className="nv-svc-text">{c.description}</span>
                {subs.length > 0 && (
                  <span className="nv-svc-includes">
                    <span className="nv-svc-includes-label">{labels.includes}</span>
                    <span className="nv-svc-tags">
                      {subs.map((s) => (
                        <span key={s.id} className="nv-svc-tag">
                          {s.name}
                        </span>
                      ))}
                    </span>
                  </span>
                )}
              </span>

              <span className="nv-svc-cta">
                {labels.discover}
                <span className="nv-svc-arrow">{ARROW}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
