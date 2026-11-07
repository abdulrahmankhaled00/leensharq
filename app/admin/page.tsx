import Link from "next/link";
import { getDbStatus } from "@/lib/db/status";
import { overviewStats } from "@/lib/admin/queries";
import { getAdminT } from "@/lib/admin/locale";
import { fmt, formatAdminDate, formatBytes } from "@/lib/admin/i18n";
import { AI } from "@/components/admin/icons";
import { Badge, DbNotice, PageHeader, pickName } from "@/components/admin/ui";

export default async function AdminOverview() {
  const [{ t, locale }, s, status] = await Promise.all([getAdminT(), overviewStats(), getDbStatus()]);
  const o = t.overview;

  const cards = [
    { href: "/admin/projects", label: t.nav.projects, icon: AI.projects, stat: s.projects, homepage: o.onHomepage },
    { href: "/admin/clients", label: t.nav.clients, icon: AI.clients, stat: s.clients, homepage: o.inSlider },
    { href: "/admin/brands", label: t.nav.brands, icon: AI.brands, stat: s.brands, homepage: o.inSlider },
    { href: "/admin/partners", label: t.nav.partners, icon: AI.partners, stat: s.partners, homepage: o.onHomepage },
  ];
  const kindLabel = { brands: o.kindBrand, clients: o.kindClient, partners: o.kindPartner, projects: o.kindProject };

  return (
    <>
      <PageHeader
        t={t}
        title={o.title}
        description={o.description}
        actions={
          <Link href="/admin/projects/new" className="ad-btn ad-btn-primary">
            {AI.plus} {o.newProject}
          </Link>
        }
      />
      <DbNotice status={status} t={t} />

      <div className="ad-stack">
        <div className="ad-stats">
          {cards.map((c) => (
            <Link key={c.href} href={c.href} className="ad-panel ad-stat">
              <span className="ad-stat-top">
                <span className="ad-stat-icon">{c.icon}</span>
                <span className="ad-stat-n">{c.stat.total}</span>
              </span>
              <span className="ad-stat-label">{c.label}</span>
              <span className="ad-stat-meta">
                <Badge tone="green">{fmt(o.activeCount, { n: c.stat.active })}</Badge>
                <Badge tone="teal">{fmt(c.homepage, { n: c.stat.homepage })}</Badge>
              </span>
            </Link>
          ))}
        </div>

        <div className="ad-grid-2">
          <section className="ad-panel">
            <div className="ad-panel-head">
              <h2 className="ad-panel-title">{o.recent}</h2>
            </div>
            {s.recent.length === 0 ? (
              <p className="ad-panel-body ad-muted">{o.recentEmpty}</p>
            ) : (
              <div className="ad-list">
                {s.recent.map((r) => {
                  const n = pickName(locale, r.nameEn, r.nameAr);
                  return (
                    <Link key={r.href} href={r.href} className="ad-list-item">
                      <span className="ad-list-item-main">
                        <strong dir="auto">{n.primary}</strong>
                        <span className="ad-cell-sub">{kindLabel[r.kind]}</span>
                      </span>
                      <span className="ad-muted ad-small">{formatAdminDate(r.updatedAt, locale)}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          <div className="ad-stack">
            <section className="ad-panel">
              <div className="ad-panel-head">
                <h2 className="ad-panel-title">{o.profile}</h2>
                <Link href="/admin/company-profile" className="ad-link">
                  {o.manage}
                </Link>
              </div>
              <div className="ad-panel-body">
                {s.profile ? (
                  <div className="ad-list-item ad-list-item-flat">
                    <span className="ad-stat-icon">{AI.pdf}</span>
                    <span className="ad-list-item-main">
                      <strong dir="ltr">{s.profile.originalFileName}</strong>
                      <span className="ad-cell-sub">
                        {formatBytes(s.profile.fileSize, locale)} · {s.profile.showDownloadButton ? o.buttonShown : o.buttonHidden}
                      </span>
                    </span>
                  </div>
                ) : (
                  <p className="ad-muted">{o.noProfile}</p>
                )}
              </div>
            </section>

            <section className="ad-panel">
              <div className="ad-panel-head">
                <h2 className="ad-panel-title">{o.layout}</h2>
                <Link href="/admin/homepage" className="ad-link">
                  {o.arrange}
                </Link>
              </div>
              <p className="ad-panel-body ad-muted">
                {s.hiddenSections === 0 ? o.layoutAllVisible : fmt(o.layoutHidden, { n: s.hiddenSections })} {o.layoutHint}
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
