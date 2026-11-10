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

      <div className="cms-grid-2">
        <div className="cms-stack">
          <section className="cms-panel">
            <div className="cms-panel-head">
              <h2 className="cms-panel-title">{p.active}</h2>
              {active && <Badge tone={active.showDownloadButton ? "green" : "amber"}>{active.showDownloadButton ? p.buttonShown : p.buttonHidden}</Badge>}
            </div>
            {active ? (
              <>
                <div className="cms-list-item">
                  <span className="cms-stat-icon">{AI.pdf}</span>
                  <span className="cms-list-item-main">
                    <strong dir="ltr">{active.originalFileName}</strong>
                    <span className="cms-cell-sub">{meta(active.fileSize, active.uploadedAt)}</span>
                  </span>
                  <a href={active.fileUrl} target="_blank" rel="noopener noreferrer" className="cms-btn cms-btn-secondary cms-btn-sm">
                    {AI.eye} {t.common.preview}
                  </a>
                </div>
                <ProfileSettingsForm action={updateCompanyProfileSettings.bind(null, active.id)} doc={active} readOnly={!connected} />
                <div className="cms-panel-body cms-panel-split">
                  <form action={deactivateDocument.bind(null, active.id)}>
                    <button type="submit" className="cms-btn cms-btn-ghost cms-btn-sm" disabled={!connected}>
                      {p.deactivate}
                    </button>
                  </form>
                  <span className="cms-help">{p.deactivateHint}</span>
                </div>
              </>
            ) : (
              <EmptyState icon={AI.pdf} title={p.noActive}>
                {p.noActiveHint}
              </EmptyState>
            )}
          </section>

          {history.length > 0 && (
            <section className="cms-panel">
              <div className="cms-panel-head">
                <h2 className="cms-panel-title">{p.earlier}</h2>
              </div>
              <div className="cms-list">
                {history.map((d) => (
                  <div key={d.id} className="cms-list-item">
                    <span className="cms-list-item-main">
                      <strong dir="ltr">{d.originalFileName}</strong>
                      <span className="cms-cell-sub">{meta(d.fileSize, d.uploadedAt)}</span>
                    </span>
                    <a href={d.fileUrl} target="_blank" rel="noopener noreferrer" className="cms-icon-btn" aria-label={fmt(t.common.previewItem, { name: d.originalFileName })} title={t.common.preview}>
                      {AI.eye}
                    </a>
                    <form action={activateDocument.bind(null, d.id)}>
                      <button type="submit" className="cms-btn cms-btn-secondary cms-btn-sm" disabled={!connected}>
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

        <section className="cms-panel cms-self-start">
          <div className="cms-panel-head">
            <h2 className="cms-panel-title">{p.uploadTitle}</h2>
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
