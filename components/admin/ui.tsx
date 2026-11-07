import Link from "next/link";
import type { ReactNode } from "react";
import type { AdminDict } from "@/lib/admin/i18n";
import type { DbStatus } from "@/lib/db/status";
import { AI } from "./icons";

export function PageHeader({
  title,
  description,
  crumbs,
  actions,
  t,
}: {
  title: string;
  description?: ReactNode;
  crumbs?: { href: string; label: string }[];
  actions?: ReactNode;
  t: AdminDict;
}) {
  return (
    <header className="ad-header">
      <div style={{ minWidth: 0 }}>
        {crumbs && (
          <nav className="ad-crumbs" aria-label={t.nav.breadcrumb}>
            {crumbs.map((c) => (
              <span key={c.href}>
                <Link href={c.href}>{c.label}</Link> /
              </span>
            ))}
          </nav>
        )}
        <h1 className="ad-title">{title}</h1>
        {description && <div className="ad-subtitle">{description}</div>}
      </div>
      {actions && <div className="ad-header-actions">{actions}</div>}
    </header>
  );
}

export function Notice({ tone, children }: { tone: "success" | "warn" | "error"; children: ReactNode }) {
  return (
    <div className={`ad-notice ad-notice-${tone}`} role={tone === "error" ? "alert" : "status"}>
      {tone === "success" ? AI.check : tone === "warn" ? AI.info : AI.alert}
      <div>{children}</div>
    </div>
  );
}

/** Success message after a redirect (`?saved=…`). */
export function SavedNotice({ saved, t }: { saved?: string; t: AdminDict }) {
  if (!saved || !(saved in t.saved)) return null;
  return <Notice tone="success">{t.saved[saved as keyof AdminDict["saved"]]}</Notice>;
}

/** Explains exactly why the dashboard is read-only, without exposing any connection details. */
export function DbNotice({ status, t }: { status: DbStatus; t: AdminDict }) {
  if (status === "ok") return null;
  return (
    <Notice tone={status === "not-configured" || status === "migrations" ? "warn" : "error"}>
      <strong>{t.db.readOnly}</strong> {t.db[status]}
    </Notice>
  );
}

export function Badge({ tone = "neutral", children, plain }: { tone?: "neutral" | "green" | "teal" | "amber"; children: ReactNode; plain?: boolean }) {
  return <span className={`ad-badge ${tone === "neutral" ? "" : `ad-badge-${tone}`} ${plain ? "ad-badge-plain" : ""}`}>{children}</span>;
}

export function EmptyState({ icon, title, children, action }: { icon: ReactNode; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="ad-empty">
      <span className="ad-empty-icon">{icon}</span>
      <strong>{title}</strong>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

/** Small logo / photo preview for tables. */
export function Thumb({ src, label, photo }: { src: string | null; label: string; photo?: boolean }) {
  if (!src) {
    const words = label.split(/[\s—–&()-]+/).filter(Boolean);
    const initials = /^[A-Za-z0-9]/.test(label) ? words.slice(0, 2).map((w) => w[0].toUpperCase()).join("") : Array.from(words[0] ?? label)[0] ?? "";
    return (
      <span className="ad-thumb ad-thumb-empty" aria-hidden>
        {initials}
      </span>
    );
  }
  return (
    <span className={`ad-thumb ${photo ? "ad-thumb-photo" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy" />
    </span>
  );
}

/** The content name in the dashboard language first, the other language underneath. */
export function pickName(locale: "ar" | "en", en: string, ar: string) {
  return locale === "ar" ? { primary: ar || en, secondary: en !== ar ? en : null, primaryLang: "ar" as const } : { primary: en || ar, secondary: ar !== en ? ar : null, primaryLang: "en" as const };
}
