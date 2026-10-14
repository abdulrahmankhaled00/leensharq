"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { SiteContent } from "@/content/types";
import { toggleLocalePath } from "@/lib/locale-path";

export function Header({ content }: { content: SiteContent }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const home = content.locale === "ar" ? "/" : "/en";
  const base = content.locale === "ar" ? "" : "/en";

  const links = [
    { href: `${base}/about`, label: content.nav.about },
    { href: `${base}/services`, label: content.nav.services },
    { href: `${base}/brands`, label: content.nav.brands },
    { href: `${base}/projects`, label: content.nav.projects },
  ];

  return (
    <header className="sticky top-0 z-50 wrap pt-3">
      <div className="board" style={{ gridTemplateColumns: "repeat(12, minmax(0,1fr))" }}>
        <Link
          href={home}
          className="col-span-2 md:col-span-1 flex items-center justify-center min-h-14 rounded-[var(--radius)] bg-[var(--teal-900)] p-2"
          aria-label={content.meta.siteName}
        >
          <Image src="/icon.png" alt="" width={36} height={36} className="h-8 w-8 object-contain" priority />
        </Link>

        <nav
          className="col-span-7 hidden md:flex items-center gap-7 min-h-14 rounded-[var(--radius)] bg-[var(--surface)] px-7 text-small font-semibold"
          aria-label="Primary"
        >
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={active ? "text-[var(--teal-700)]" : "hover:text-[var(--teal-700)] transition-colors"}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="col-span-7 md:hidden flex items-center justify-between min-h-14 rounded-[var(--radius)] bg-[var(--surface)] px-5 text-small font-semibold"
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          <span>{content.nav.home}</span>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            {open ? (
              <path d="M3 3l12 12M15 3L3 15" />
            ) : (
              <path d="M2 5h14M2 9h14M2 13h14" />
            )}
          </svg>
        </button>

        <Link
          href={`${base}/contact`}
          className="col-span-3 md:col-span-3 flex items-center justify-center min-h-14 rounded-[var(--radius)] bg-[var(--teal-900)] text-white text-small font-semibold hover:bg-[var(--teal-700)] transition-colors"
        >
          {content.nav.getInTouch}
        </Link>

        <Link
          href={toggleLocalePath(pathname)}
          className="hidden md:flex col-span-1 items-center justify-center min-h-14 rounded-[var(--radius)] bg-[var(--surface-2)] text-small font-semibold hover:bg-[var(--surface)] transition-colors"
        >
          {content.nav.switchLanguage}
        </Link>
      </div>

      {open && (
        <nav id="mobile-nav" className="md:hidden mt-2 rounded-[var(--radius)] bg-[var(--surface)] p-4 flex flex-col gap-1 text-body font-semibold">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-2">
              {l.label}
            </Link>
          ))}
          <Link href={toggleLocalePath(pathname)} onClick={() => setOpen(false)} className="py-2 text-[var(--teal-700)]">
            {content.nav.switchLanguage}
          </Link>
        </nav>
      )}
    </header>
  );
}
