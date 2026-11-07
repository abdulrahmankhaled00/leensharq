import Link from "next/link";
import { getDbStatus } from "@/lib/db/status";
import { clientOptions, listProjects, sectorOptions, type StatusFilter } from "@/lib/admin/queries";
import { deleteProject, moveProject, toggleProject } from "@/lib/admin/project-actions";
import { getAdminT } from "@/lib/admin/locale";
import { fmt } from "@/lib/admin/i18n";
import { AI } from "@/components/admin/icons";
import { DbNotice, EmptyState, PageHeader, pickName, SavedNotice, Thumb } from "@/components/admin/ui";
import { MoveButtons, SwitchForm, ViewSwitch } from "@/components/admin/controls";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";

type Search = { q?: string; status?: string; view?: string; client?: string; sector?: string; saved?: string };

export default async function ProjectsList({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const [{ t, locale }, dbStatus] = await Promise.all([getAdminT(), getDbStatus()]);
  const p = t.projects;
  const view = sp.view === "homepage" ? "homepage" : "all";
  const status = (["active", "inactive"].includes(sp.status ?? "") ? sp.status : "all") as StatusFilter;
  const clientId = sp.client ? Number(sp.client) || undefined : undefined;
  const connected = dbStatus === "ok";

  const [rows, clients, sectors] = await Promise.all([listProjects({ q: sp.q, status, view, clientId, sector: sp.sector }), clientOptions(), sectorOptions()]);
  const filtered = Boolean(sp.q || clientId || sp.sector) || status !== "all";
  const client = clientId ? clients.find((c) => c.id === clientId) : undefined;

  return (
    <>
      <PageHeader
        t={t}
        title={p.title}
        description={p.description}
        actions={
          <Link href="/admin/projects/new" className="ad-btn ad-btn-primary" aria-disabled={!connected}>
            {AI.plus} {p.add}
          </Link>
        }
      />
      <DbNotice status={dbStatus} t={t} />
      <SavedNotice saved={sp.saved} t={t} />

      <section className="ad-panel">
        <form className="ad-toolbar" role="search">
          {view === "homepage" && <input type="hidden" name="view" value="homepage" />}
          <label className="ad-search">
            <span className="ad-sr">{p.search}</span>
            {AI.search}
            <input className="ad-input" type="search" name="q" defaultValue={sp.q} placeholder={p.search} dir="auto" />
          </label>
          <label>
            <span className="ad-sr">{p.clientFilter}</span>
            <select className="ad-select ad-select-auto" name="client" defaultValue={sp.client ?? ""} style={{ maxWidth: "15rem" }}>
              <option value="">{p.allClients}</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {pickName(locale, c.nameEn, c.nameAr).primary}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="ad-sr">{p.sectorFilter}</span>
            <select className="ad-select ad-select-auto" name="sector" defaultValue={sp.sector ?? ""}>
              <option value="">{p.allSectors}</option>
              {sectors.map((s) => (
                <option key={s.en} value={s.en}>
                  {locale === "ar" ? s.ar : s.en}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="ad-sr">{t.common.status}</span>
            <select className="ad-select ad-select-auto" name="status" defaultValue={status}>
              <option value="all">{t.common.allStatuses}</option>
              <option value="active">{t.common.active}</option>
              <option value="inactive">{t.common.inactive}</option>
            </select>
          </label>
          <button type="submit" className="ad-btn ad-btn-secondary">
            {t.common.apply}
          </button>
          {filtered && (
            <Link href={`/admin/projects${view === "homepage" ? "?view=homepage" : ""}`} className="ad-btn ad-btn-ghost">
              {t.common.clear}
            </Link>
          )}
          <span className="ad-toolbar-end">
            <ViewSwitch t={t} base="/admin/projects" view={view} params={{ q: sp.q, client: sp.client, sector: sp.sector, status: status === "all" ? undefined : status }} />
          </span>
        </form>

        {client && (
          <p className="ad-panel-note">
            {p.showingFor} <strong dir="auto">{pickName(locale, client.nameEn, client.nameAr).primary}</strong>
          </p>
        )}
        {view === "homepage" && <p className="ad-panel-note">{t.lists.homepageViewHint}</p>}

        {rows.length === 0 ? (
          <EmptyState
            icon={AI.projects}
            title={filtered ? p.emptyFiltered : view === "homepage" ? p.emptyHomepage : p.empty}
            action={
              !filtered && view === "all" && connected ? (
                <Link href="/admin/projects/new" className="ad-btn ad-btn-primary">
                  {AI.plus} {p.addFirst}
                </Link>
              ) : undefined
            }
          >
            {filtered ? t.lists.noMatchesHint : view === "homepage" ? p.emptyHomepageHint : undefined}
          </EmptyState>
        ) : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th className="ad-col-tight">{view === "homepage" ? t.lists.colHomepage : t.lists.colOrder}</th>
                  <th>{p.colProject}</th>
                  <th className="ad-hide-sm">{p.colSector}</th>
                  <th>{t.lists.colStatus}</th>
                  <th>{t.lists.colHomepage}</th>
                  <th className="ad-col-tight">
                    <span className="ad-sr">{t.common.actions}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const name = pickName(locale, r.projectNameEn, r.projectNameAr).primary;
                  const clientName = r.clientNameEn ? pickName(locale, r.clientNameEn, r.clientNameAr ?? r.clientNameEn).primary : null;
                  const location = locale === "ar" ? r.locationAr || r.locationEn : r.locationEn;
                  const sector = locale === "ar" ? r.sectorAr || r.sectorEn : r.sectorEn;
                  return (
                    <tr key={r.id} data-inactive={!r.isActive}>
                      <td>
                        <MoveButtons
                          t={t}
                          position={i + 1}
                          isFirst={i === 0}
                          isLast={i === rows.length - 1}
                          up={moveProject.bind(null, r.id, "up", view)}
                          down={moveProject.bind(null, r.id, "down", view)}
                          disabled={!connected || filtered}
                          label={name}
                        />
                      </td>
                      <td>
                        <div className="ad-cell-main">
                          <Thumb src={r.image} label={name} photo />
                          <span>
                            <Link href={`/admin/projects/${r.id}`} className="ad-cell-title" dir="auto">
                              {name}
                            </Link>
                            <span className="ad-cell-sub" dir="auto">
                              {clientName ?? <em>{t.common.noClient}</em>} · {location}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="ad-hide-sm">{sector || <span className="ad-muted">{t.common.none}</span>}</td>
                      <td>
                        <SwitchForm action={toggleProject.bind(null, r.id, "isActive", !r.isActive)} on={r.isActive} label={r.isActive ? t.common.active : t.common.inactive} disabled={!connected} />
                      </td>
                      <td>
                        <SwitchForm
                          action={toggleProject.bind(null, r.id, "showOnHomepage", !r.showOnHomepage)}
                          on={r.showOnHomepage}
                          label={r.showOnHomepage ? t.common.featured : t.common.no}
                          disabled={!connected}
                        />
                      </td>
                      <td>
                        <div className="ad-row-actions">
                          <Link href={`/admin/projects/${r.id}`} className="ad-icon-btn" aria-label={fmt(t.common.editItem, { name })} title={t.common.edit}>
                            {AI.edit}
                          </Link>
                          <ConfirmDelete action={deleteProject.bind(null, r.id)} name={name} disabled={!connected} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {filtered && rows.length > 0 && <p className="ad-help ad-below">{t.lists.clearToReorder}</p>}
    </>
  );
}
