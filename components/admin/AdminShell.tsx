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
    <div className="ad-shell" data-collapsed={collapsed}>
      <div className="ad-overlay" data-open={open} onClick={() => setOpen(false)} aria-hidden />

      <aside id="ad-sidebar" className="ad-sidebar" data-open={open} aria-label={t.nav.mainNav}>
        <div className="ad-sidebar-inner">
          <div className="ad-sidebar-head">
            <Link href="/admin" className="ad-brand" title={t.brand.name}>
              <Image src="/icon.png" alt="" width={40} height={40} />
              <span className="ad-collapsible">
                <strong>{t.brand.name}</strong>
                <span>{t.brand.tagline}</span>
              </span>
            </Link>
            <button ref={closeRef} type="button" className="ad-icon-btn ad-icon-btn-dark ad-only-mobile" onClick={() => setOpen(false)} aria-label={t.nav.closeMenu}>
              {AI.close}
            </button>
          </div>

          <nav className="ad-nav" aria-label={t.nav.mainNav}>
            {groups.map((g, i) => (
              <div key={i} className="ad-nav-group">
                {g.label && <p className="ad-nav-label ad-collapsible">{g.label}</p>}
                {g.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="ad-nav-link"
                    aria-current={isActive(l.href) ? "page" : undefined}
                    title={collapsed ? l.label : undefined}
                  >
                    {l.icon}
                    <span className="ad-collapsible">{l.label}</span>
                  </Link>
                ))}
              </div>
            ))}
          </nav>

          <div className="ad-sidebar-foot">
            <button type="button" className="ad-nav-link ad-only-desktop" onClick={toggleCollapsed} aria-expanded={!collapsed} aria-controls="ad-sidebar" title={collapsed ? t.nav.expand : undefined}>
              <span className="ad-flip-rtl ad-collapse-icon">{AI.collapse}</span>
              <span className="ad-collapsible">{collapsed ? t.nav.expand : t.nav.collapse}</span>
            </button>
            <form action={logout}>
              <button type="submit" className="ad-nav-link" title={collapsed ? t.nav.logout : undefined}>
                <span className="ad-flip-rtl">{AI.logout}</span>
                <span className="ad-collapsible">{t.nav.logout}</span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="ad-main-col">
        <header className="ad-topbar">
          <button ref={menuRef} type="button" className="ad-icon-btn ad-only-mobile" onClick={() => setOpen(true)} aria-label={t.nav.openMenu} aria-expanded={open} aria-controls="ad-sidebar">
            {AI.menu}
          </button>
          <Link href="/admin" className="ad-topbar-brand ad-only-mobile">
            {t.brand.name}
          </Link>
          <div className="ad-topbar-actions">
            <LanguageSwitch />
            <a href="/" target="_blank" rel="noopener noreferrer" className="ad-btn ad-btn-ghost ad-btn-sm">
              <span className="ad-flip-rtl">{AI.external}</span>
              <span className="ad-hide-xs">{t.nav.viewSite}</span>
            </a>
          </div>
        </header>
        <main className="ad-main" id="ad-main">
          <div className="ad-page">{children}</div>
        </main>
      </div>
    </div>
  );
}
