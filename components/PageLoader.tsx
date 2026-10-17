"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

const MIN_MS = 1900; // long enough for the logo to finish drawing
const CAP_MS = 3600; // never keep visitors waiting longer than this

const v = (name: string, value: string | number) => ({ [name]: value }) as CSSProperties;

/**
 * Branded first-load intro: the logo draws itself, the name reveals, a counter follows real image progress,
 * then the screen splits open. CSS also hides it after a delay, so it can never get stuck.
 */
export function PageLoader({ locale }: { locale: "ar" | "en" }) {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const start = performance.now();
    const imgs = Array.from(document.images).filter((img) => img.loading !== "lazy");
    let shown = 0;
    let raf = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      el.style.setProperty("--p", "1");
      if (count.current) count.current.textContent = "100";
      el.classList.add("is-done");
      window.setTimeout(() => el.classList.add("is-gone"), 1100);
    };

    const tick = () => {
      const t = performance.now() - start;
      const loaded = imgs.length ? imgs.filter((img) => img.complete).length / imgs.length : 1;
      const time = Math.min(t / MIN_MS, 1);
      // progress follows time, but holds near the end until the images have really arrived
      const target = Math.min(time, loaded === 1 ? 1 : 0.92);
      shown += (target - shown) * 0.12;
      el.style.setProperty("--p", shown.toFixed(3));
      if (count.current) count.current.textContent = String(Math.min(99, Math.round(shown * 100)));
      if ((t >= MIN_MS && loaded === 1) || t >= CAP_MS) finish();
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const name = "LEEN AL SHARQ HOLDING";

  return (
    <div ref={root} className="nv-loader" aria-hidden>
      <div className="nv-loader-panel nv-loader-top" />
      <div className="nv-loader-panel nv-loader-bottom" />
      <div className="nv-loader-glow" />

      <div className="nv-loader-stage">
        <div className="nv-loader-logo">
          <svg viewBox="0 0 512 512" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="nvl-teal" gradientUnits="userSpaceOnUse" x1="120" y1="50" x2="340" y2="380">
                <stop offset="0" stopColor="#2fc4de" />
                <stop offset="1" stopColor="#007080" />
              </linearGradient>
            </defs>
            <g stroke="url(#nvl-teal)" strokeWidth="22">
              <path className="nvl-d" style={v("--d", "0s")} pathLength="1" d="M128 330V135L278 52V160" />
              <path className="nvl-d" style={v("--d", "0.25s")} pathLength="1" d="M190 150L330 222V292" />
              <path className="nvl-d" style={v("--d", "0.45s")} pathLength="1" d="M205 150V380" />
              <path className="nvl-d" style={v("--d", "0.6s")} pathLength="1" d="M268 205V355" />
            </g>
            <path className="nvl-d nvl-red" style={v("--d", "0.95s")} pathLength="1" stroke="#e00f22" strokeWidth="26" d="M118 318L222 408L396 238" />
          </svg>
          <span className="nv-loader-ring" />
        </div>

        <p className="nv-loader-name" lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
          {locale === "ar" ? (
            <span className="nvl-word" style={v("--c", 0)}>
              لين الشرق القابضة
            </span>
          ) : (
            name.split("").map((ch, i) => (
              <span key={i} className="nvl-ch" style={v("--c", i)}>
                {ch === " " ? " " : ch}
              </span>
            ))
          )}
        </p>

        <div className="nv-loader-meter" dir="ltr">
          <span className="nv-loader-track">
            <span className="nv-loader-fill" />
          </span>
          <span className="nv-loader-count" dir="ltr">
            <span ref={count}>0</span>
            <small>%</small>
          </span>
        </div>
      </div>
    </div>
  );
}
