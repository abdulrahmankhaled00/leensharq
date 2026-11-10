"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ADMIN_SIDEBAR_COOKIE } from "@/lib/admin/i18n";
import { useAdminI18n } from "./I18n";
import { LanguageSwitch } from "./LanguageSwitch";
import { AI } from "./icons";

/**
 * Dashboard frame.
 * - Desktop: a sidebar grid column whose background stretches with the page, holding a sticky,
 *   viewport-tall navigation that scrolls on its own. It can collapse to an icon rail.
 * - Below 1024px: the sidebar becomes a full-height drawer from the start side (right in Arabic,
 *   left in English) over a full-viewport overlay, with page scrolling locked while open.
 */
export function AdminShell({ children, logout, initialCollapsed }: { children: ReactNode; logout: () => Promise<void>; initialCollapsed: boolean }) {
  const { t } = useAdminI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);

  // Close the drawer on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Drawer: lock page scroll, close on Escape, move focus in and back out.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.matchMedia("(min-width: 1024px)").matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    const menu = menuRef.current;
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      menu?.focus();
    };
  }, [open]);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    document.cookie = `${ADMIN_SIDEBAR_COOKIE}=${next ? "collapsed" : "expanded"}; path=/admin; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  };

  const groups: { label?: string; links: { href: string; label: string; icon: ReactNode }[] }[] = [
    { links: [{ href: "/admin", label: t.nav.overview, icon: AI.overview }] },
    {
      label: t.nav.content,
      links: [
        { href: "/admin/projects", label: t.nav.projects, icon: AI.projects },
        { href: "/admin/clients", label: t.nav.clients, icon: AI.clients },
        { href: "/admin/brands", label: t.nav.brands, icon: AI.brands },
        { href: "/admin/partners", label: t.nav.partners, icon: AI.partners },
      ],
    },
    {
      label: t.nav.site,
      links: [
        { href: "/admin/homepage", label: t.nav.homepage, icon: AI.homepage },
        { href: "/admin/company-profile", label: t.nav.profile, icon: AI.pdf },
      ],
    },
  ];
  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <div className="cms-shell" data-collapsed={collapsed}>
      <div className="cms-overlay" data-open={open} onClick={() => setOpen(false)} aria-hidden />

      <aside id="cms-sidebar" className="cms-sidebar" data-open={open} aria-label={t.nav.mainNav}>
        <div className="cms-sidebar-inner">
          <div className="cms-sidebar-head">
            <Link href="/admin" className="cms-brand" title={t.brand.name}>
              <Image src="/icon.png" alt="" width={40} height={40} />
              <span className="cms-collapsible">
                <strong>{t.brand.name}</strong>
                <span>{t.brand.tagline}</span>
              </span>
            </Link>
            <button ref={closeRef} type="button" className="cms-icon-btn cms-icon-btn-dark cms-only-mobile" onClick={() => setOpen(false)} aria-label={t.nav.closeMenu}>
              {AI.close}
            </button>
          </div>

          <nav className="cms-nav" aria-label={t.nav.mainNav}>
            {groups.map((g, i) => (
              <div key={i} className="cms-nav-group">
                {g.label && <p className="cms-nav-label cms-collapsible">{g.label}</p>}
                {g.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="cms-nav-link"
                    aria-current={isActive(l.href) ? "page" : undefined}
                    title={collapsed ? l.label : undefined}
                  >
                    {l.icon}
                    <span className="cms-collapsible">{l.label}</span>
                  </Link>
                ))}
              </div>
            ))}
          </nav>

          <div className="cms-sidebar-foot">
            <button type="button" className="cms-nav-link cms-only-desktop" onClick={toggleCollapsed} aria-expanded={!collapsed} aria-controls="cms-sidebar" title={collapsed ? t.nav.expand : undefined}>
              <span className="cms-flip-rtl cms-collapse-icon">{AI.collapse}</span>
              <span className="cms-collapsible">{collapsed ? t.nav.expand : t.nav.collapse}</span>
            </button>
            <form action={logout}>
              <button type="submit" className="cms-nav-link" title={collapsed ? t.nav.logout : undefined}>
                <span className="cms-flip-rtl">{AI.logout}</span>
                <span className="cms-collapsible">{t.nav.logout}</span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="cms-main-col">
        <header className="cms-topbar">
          <button ref={menuRef} type="button" className="cms-icon-btn cms-only-mobile" onClick={() => setOpen(true)} aria-label={t.nav.openMenu} aria-expanded={open} aria-controls="cms-sidebar">
            {AI.menu}
          </button>
          <Link href="/admin" className="cms-topbar-brand cms-only-mobile">
            {t.brand.name}
          </Link>
          <div className="cms-topbar-actions">
            <LanguageSwitch />
            <a href="/" target="_blank" rel="noopener noreferrer" className="cms-btn cms-btn-ghost cms-btn-sm">
              <span className="cms-flip-rtl">{AI.external}</span>
              <span className="cms-hide-xs">{t.nav.viewSite}</span>
            </a>
          </div>
        </header>
        <main className="cms-main" id="cms-main">
          <div className="cms-page">{children}</div>
        </main>
      </div>
    </div>
  );
}
