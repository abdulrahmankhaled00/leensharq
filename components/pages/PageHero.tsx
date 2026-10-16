import Image from "next/image";
import type { CSSProperties } from "react";
import { HeroMotion } from "@/components/pages/HeroMotion";
import type { Pic } from "@/lib/photos";

/** Shorter sibling of the Home hero: photo, scrim, staged title, parallax. Used at the top of every inner page. */
export function PageHero({ label, title, lead, image }: { label: string; title: string; lead?: string; image: Pic }) {
  return (
    <section id="hero" className="hero hero-page" aria-labelledby="page-title">
      <HeroMotion />
      <div className="hero-bg">
        <div className="hero-zoom">
          <Image src={image.src} alt="" fill priority sizes="100vw" className={`object-cover ${image.position ?? "object-center"}`} />
        </div>
      </div>
      <div className="hero-scrim" aria-hidden />

      <div className="hero-inner">
        <div className="hero-content">
          <p className="nv-label hero-fade" style={{ "--i": 0 } as CSSProperties}>
            {label}
          </p>
          <h1 id="page-title" className="hero-title">
            <span className="hero-line">
              <span style={{ "--i": 0 } as CSSProperties}>{title}</span>
            </span>
          </h1>
          {lead && (
            <p className="hero-lead hero-fade" style={{ "--i": 1 } as CSSProperties}>
              {lead}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
