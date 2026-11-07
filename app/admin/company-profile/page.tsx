import { getDbStatus } from "@/lib/db/status";
import { listDocuments } from "@/lib/admin/queries";
import { activateDocument, deactivateDocument, deleteDocument, updateCompanyProfileSettings } from "@/lib/admin/site-actions";
import { getAdminT } from "@/lib/admin/locale";
import { fmt, formatAdminDate, formatBytes } from "@/lib/admin/i18n";
import { seedCompanyProfile } from "@/content/seed";
import { AI } from "@/components/admin/icons";
import { Badge, DbNotice, EmptyState, PageHeader, SavedNotice } from "@/components/admin/ui";
import { ProfileSettingsForm, ProfileUploadForm } from "@/components/admin/CompanyProfileForms";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";

export default async function CompanyProfilePage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const [{ t, locale }, status, docs] = await Promise.all([getAdminT(), getDbStatus(), listDocuments()]);
  const p = t.profile;
  const connected = status === "ok";
  const active = docs.find((d) => d.isActive);
  const history = docs.filter((d) => !d.isActive);
  const meta = (size: number, date: Date) => fmt(p.uploadedOn, { size: formatBytes(size, locale), date: formatAdminDate(date, locale) });

  return (
    <>
      <PageHeader t={t} title={p.title} description={p.description} />
      <DbNotice status={status} t={t} />
      <SavedNotice saved={saved} t={t} />

      <div className="ad-grid-2">
        <div className="ad-stack">
          <section className="ad-panel">
            <div className="ad-panel-head">
              <h2 className="ad-panel-title">{p.active}</h2>
              {active && <Badge tone={active.showDownloadButton ? "green" : "amber"}>{active.showDownloadButton ? p.buttonShown : p.buttonHidden}</Badge>}
            </div>
            {active ? (
              <>
                <div className="ad-list-item">
                  <span className="ad-stat-icon">{AI.pdf}</span>
                  <span className="ad-list-item-main">
                    <strong dir="ltr">{active.originalFileName}</strong>
                    <span className="ad-cell-sub">{meta(active.fileSize, active.uploadedAt)}</span>
                  </span>
                  <a href={active.fileUrl} target="_blank" rel="noopener noreferrer" className="ad-btn ad-btn-secondary ad-btn-sm">
                    {AI.eye} {t.common.preview}
                  </a>
                </div>
                <ProfileSettingsForm action={updateCompanyProfileSettings.bind(null, active.id)} doc={active} readOnly={!connected} />
                <div className="ad-panel-body ad-panel-split">
                  <form action={deactivateDocument.bind(null, active.id)}>
                    <button type="submit" className="ad-btn ad-btn-ghost ad-btn-sm" disabled={!connected}>
                      {p.deactivate}
                    </button>
                  </form>
                  <span className="ad-help">{p.deactivateHint}</span>
                </div>
              </>
            ) : (
              <EmptyState icon={AI.pdf} title={p.noActive}>
                {p.noActiveHint}
              </EmptyState>
            )}
          </section>

          {history.length > 0 && (
            <section className="ad-panel">
              <div className="ad-panel-head">
                <h2 className="ad-panel-title">{p.earlier}</h2>
              </div>
              <div className="ad-list">
                {history.map((d) => (
                  <div key={d.id} className="ad-list-item">
                    <span className="ad-list-item-main">
                      <strong dir="ltr">{d.originalFileName}</strong>
                      <span className="ad-cell-sub">{meta(d.fileSize, d.uploadedAt)}</span>
                    </span>
                    <a href={d.fileUrl} target="_blank" rel="noopener noreferrer" className="ad-icon-btn" aria-label={fmt(t.common.previewItem, { name: d.originalFileName })} title={t.common.preview}>
                      {AI.eye}
                    </a>
                    <form action={activateDocument.bind(null, d.id)}>
                      <button type="submit" className="ad-btn ad-btn-secondary ad-btn-sm" disabled={!connected}>
                        {p.makeActive}
                      </button>
                    </form>
                    <ConfirmDelete action={deleteDocument.bind(null, d.id)} name={d.originalFileName} disabled={!connected} detail={p.deleteDetail} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <section className="ad-panel ad-self-start">
          <div className="ad-panel-head">
            <h2 className="ad-panel-title">{p.uploadTitle}</h2>
          </div>
          <ProfileUploadForm
            defaults={{ titleEn: active?.titleEn ?? seedCompanyProfile.titleEn, titleAr: active?.titleAr ?? seedCompanyProfile.titleAr }}
            readOnly={!connected}
          />
        </section>
      </div>
    </>
  );
}
