import type { CSSProperties } from "react";
import type { LogoItem } from "@/content/types";
import { SectionHead } from "@/components/ui/SectionHead";
import { LogoMark } from "@/components/ui/LogoMark";

/** Enough tiles per loop copy that one copy is wider than very wide screens. */
const MIN_PER_COPY = 12;

interface LogoMarqueeProps {
  title: string;
  description?: string;
  items: LogoItem[];
  titleId: string;
  link?: { href: string; label: string };
  /** Section heading layout (see SectionHead). */
  headLayout?: "split" | "center";
  className?: string;
}

/**
 * Infinite, CSS-only logo marquee (no slider library, no client JS).
 * - Two identical copies slide by exactly one copy's width, so the loop has no visible seam.
 * - Pauses on hover (pointer devices) and while focused; scrolls by touch on touch screens.
 * - Under prefers-reduced-motion it stops and wraps into a static, centred logo wall.
 * - Screen readers get each logo once: repeated tiles and the second copy are aria-hidden.
 */
export function LogoMarquee({ title, description, items, titleId, link, headLayout = "split", className = "" }: LogoMarqueeProps) {
  if (items.length === 0) return null;

  const copy: LogoItem[] = [];
  while (copy.length < Math.max(MIN_PER_COPY, items.length)) copy.push(...items);

  const renderList = (hidden: boolean) => (
    <ul className="nv-marquee-list" role="list" aria-hidden={hidden || undefined}>
      {copy.map((item, i) => (
        <li
          key={`${item.id}-${i}`}
          className="nv-marquee-item"
          data-repeat={i >= items.length || undefined}
          aria-hidden={(!hidden && i >= items.length) || undefined}
        >
          <LogoMark item={item} showName />
        </li>
      ))}
    </ul>
  );

  return (
    <section className={`nv-section ${className}`} aria-labelledby={titleId}>
      <div className="nv-container">
        <SectionHead title={title} description={description} link={link} titleId={titleId} layout={headLayout} />
      </div>
      <div
        className="nv-marquee mt-10 lg:mt-14"
        role="region"
        aria-label={title}
        tabIndex={0}
        style={{ "--marquee-duration": `${copy.length * 3.2}s` } as CSSProperties}
      >
        <div className="nv-marquee-track">
          {renderList(false)}
          {renderList(true)}
        </div>
      </div>
    </section>
  );
}
