import type { CSSProperties } from "react";
import type { AboutCard } from "@/content/types";
import { ABOUT_ICONS, CHECK } from "@/components/ui/icons";

const ACCENTS = ["teal", "sea", "red"] as const;

/**
 * Who we are / Vision / Mission: full-width cards stacked one under the other.
 * One light card style; each card gets its own accent (edge bar + icon tile).
 * Desktop: icon | title, text and points | big number. Smaller screens stack inside the card.
 */
export function AboutCards({ cards }: { cards: AboutCard[] }) {
  return (
    <ul className="flex flex-col gap-4" role="list">
      {cards.map((card, i) => (
        <li key={card.id} data-reveal style={{ "--i": 0 } as CSSProperties}>
          <article className="nv-info-card" data-accent={ACCENTS[i % ACCENTS.length]}>
            <span className="nv-info-icon">{ABOUT_ICONS[card.icon]}</span>
            <div className="nv-info-content">
              <h2 className="nv-info-title">{card.title}</h2>
              <p className="nv-info-text">{card.body}</p>
              {card.points.length > 0 && (
                <ul className="nv-info-points" role="list">
                  {card.points.map((point) => (
                    <li key={point} className="nv-info-point">
                      {CHECK}
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <span className="nv-info-num nums" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
          </article>
        </li>
      ))}
    </ul>
  );
}
