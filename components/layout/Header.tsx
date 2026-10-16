"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { SiteContent } from "@/content/types";
import { toggleLocalePath } from "@/lib/locale-path";
import { NvButton } from "@/components/ui/NvButton";

export function Header({ content }: { content: SiteContent }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const home = content.locale === "ar" ? "/" : "/en";
  const base = content.locale === "ar" ? "" : "/en";

  // Every page opens with a full-bleed photo hero, so the bar rests as dark glass and turns into the light pill once scrolled.
  const tone = !compact && !open ? "dark" : "light";

  const links = [
    { href: home, label: content.nav.home },
    { href: `${base}/about`, label: content.nav.about },
    { href: `${base}/services`, label: content.nav.services },
    { href: `${base}/brands`, label: content.nav.brands },
    { href: `${base}/projects`, label: content.nav.projects },
  ];

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setCompact((c) => (c === y > 40 ? c : y > 40));
      const max = document.documentElement.scrollHeight - window.innerHeight;
      headerRef.current?.style.setProperty("--scroll-p", String(max > 0 ? Math.min(1, y / max) : 0));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return (
    <>
      <header ref={headerRef} className="nv-header" data-tone={tone} data-compact={compact} data-open={open}>
        <div className="nv-header-bar">
          <Link href={home} className="flex items-center gap-3 me-auto" aria-label={content.meta.siteName}>
            <span className="nv-header-logo">
              <Image src="/icon.png" alt="" width={36} height={36} className="h-8 w-8 object-contain" priority />
            </span>
            <span
              className="font-extrabold leading-none md:max-lg:hidden"
              style={{ fontSize: "1.0625rem", letterSpacing: content.locale === "ar" ? 0 : "-0.02em" }}
            >
              {content.meta.siteName}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-4 lg:gap-6 me-2 lg:me-4" aria-label="Primary">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="nv-nav-link" aria-current={pathname === l.href ? "page" : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>

          <Link href={toggleLocalePath(pathname)} className="nv-nav-link hidden md:inline-block" hrefLang={content.locale === "ar" ? "en" : "ar"}>
            {content.nav.switchLanguage}
          </Link>

          <span className="hidden md:block">
            <NvButton href={`${base}/contact`} size="sm" variant={tone === "dark" ? "accent" : "primary"}>
              {content.nav.getInTouch}
            </NvButton>
          </span>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`md:hidden grid place-items-center h-11 w-11 rounded-full transition-colors duration-300 ${
              tone === "dark" ? "bg-white text-[var(--teal-900)]" : "bg-[var(--teal-900)] text-white"
            }`}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {open ? <path d="M3 3l12 12M15 3L3 15" /> : <path d="M2 5h14M2 9h14M2 13h14" />}
            </svg>
          </button>

          <div className="nv-progress" aria-hidden>
            <span />
          </div>
        </div>

        <nav id="mobile-nav" className="nv-menu md:hidden" data-open={open} aria-label="Mobile" inert={!open}>
          <div>
            <div className="flex flex-col gap-1 p-4 font-semibold" style={{ fontSize: "var(--step-body)" }}>
              {links.map((l, i) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="nv-menu-item py-2.5"
                  style={{ "--i": i } as React.CSSProperties}
                  aria-current={pathname === l.href ? "page" : undefined}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href={toggleLocalePath(pathname)}
                className="nv-menu-item py-2.5 text-[var(--accent-text)]"
                style={{ "--i": links.length } as React.CSSProperties}
              >
                {content.nav.switchLanguage}
              </Link>
              <div className="nv-menu-item mt-2" style={{ "--i": links.length + 1 } as React.CSSProperties}>
                <NvButton href={`${base}/contact`} className="w-full">
                  {content.nav.getInTouch}
                </NvButton>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
