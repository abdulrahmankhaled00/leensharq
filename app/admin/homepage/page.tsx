import Link from "next/link";
import { getDbStatus } from "@/lib/db/status";
import { adminHomepageSections } from "@/lib/admin/queries";
import { moveHomepageSection, toggleHomepageSection } from "@/lib/admin/site-actions";
import { getAdminT } from "@/lib/admin/locale";
import { AI } from "@/components/admin/icons";
import { DbNotice, PageHeader } from "@/components/admin/ui";
import { MoveButtons, SwitchForm } from "@/components/admin/controls";

const ITEM_ORDER: Record<string, string> = {
  brands: "/admin/brands?view=homepage",
  clients: "/admin/clients?view=homepage",
  projects: "/admin/projects?view=homepage",
};

export default async function HomepageLayout() {
  const [{ t, locale }, status, sections] = await Promise.all([getAdminT(), getDbStatus(), adminHomepageSections()]);
  const h = t.homepage;
  const connected = status === "ok";
  // Public homepage in the same language as the dashboard.
  const previewHref = locale === "ar" ? "/" : "/en";

  return (
    <>
      <PageHeader
        t={t}
        title={h.title}
        description={h.description}
        actions={
          <a href={previewHref} target="_blank" rel="noopener noreferrer" className="ad-btn ad-btn-secondary">
            <span className="ad-flip-rtl">{AI.external}</span> {h.preview}
          </a>
        }
      />
      <DbNotice status={status} t={t} />

      <section className="ad-panel">
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th className="ad-col-tight">{h.colPosition}</th>
                <th>{h.colSection}</th>
                <th>{h.colVisible}</th>
                <th className="ad-hide-sm">{h.colItems}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="ad-muted">{t.common.none}</td>
                <td>
                  <span className="ad-cell-title">{h.hero}</span>
                  <span className="ad-cell-sub">{h.heroHint}</span>
                </td>
                <td className="ad-muted">{h.always}</td>
                <td className="ad-hide-sm" />
              </tr>
              {sections.map((s, i) => {
                const [label, hint] = h.sections[s.sectionKey] ?? [s.sectionKey, ""];
                return (
                  <tr key={s.sectionKey} data-inactive={!s.isVisible}>
                    <td>
                      <MoveButtons
                        t={t}
                        position={i + 1}
                        isFirst={i === 0}
                        isLast={i === sections.length - 1}
                        up={moveHomepageSection.bind(null, s.sectionKey, "up")}
                        down={moveHomepageSection.bind(null, s.sectionKey, "down")}
                        disabled={!connected}
                        label={label}
                      />
                    </td>
                    <td>
                      <div className="ad-cell-main ad-cell-main-narrow">
                        <span>
                          <span className="ad-cell-title">{label}</span>
                          <span className="ad-cell-sub">{hint}</span>
                        </span>
                      </div>
                    </td>
                    <td>
                      <SwitchForm action={toggleHomepageSection.bind(null, s.sectionKey, !s.isVisible)} on={s.isVisible} label={s.isVisible ? t.common.shown : t.common.hidden} disabled={!connected} />
                    </td>
                    <td className="ad-hide-sm">
                      {ITEM_ORDER[s.sectionKey] ? (
                        <Link href={ITEM_ORDER[s.sectionKey]} className="ad-link">
                          {h.orderItems}
                        </Link>
                      ) : (
                        <span className="ad-muted">{h.fixed}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
