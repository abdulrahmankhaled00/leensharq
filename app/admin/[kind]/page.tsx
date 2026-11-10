import Link from "next/link";
import { notFound } from "next/navigation";
import { getDbStatus } from "@/lib/db/status";
import { isLogoKind } from "@/lib/admin/entities";
import { listLogoEntities, projectCountsByClient, type StatusFilter } from "@/lib/admin/queries";
import { deleteLogoEntity, moveLogoEntity, toggleLogoEntity } from "@/lib/admin/logo-actions";
import { getAdminT } from "@/lib/admin/locale";
import { fmt } from "@/lib/admin/i18n";
import { AI } from "@/components/admin/icons";
import { Badge, DbNotice, EmptyState, Notice, PageHeader, pickName, SavedNotice, Thumb } from "@/components/admin/ui";
import { MoveButtons, SwitchForm, ViewSwitch } from "@/components/admin/controls";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";

type Search = { q?: string; status?: string; view?: string; saved?: string; blocked?: string; n?: string };

export default async function LogoEntityList({ params, searchParams }: { params: Promise<{ kind: string }>; searchParams: Promise<Search> }) {
  const { kind } = await params;
  if (!isLogoKind(kind)) notFound();
  const sp = await searchParams;
  const [{ t, locale }, dbStatus] = await Promise.all([getAdminT(), getDbStatus()]);
  const k = t.kinds[kind];
  const view = sp.view === "homepage" ? "homepage" : "all";
  const status = (["active", "inactive"].includes(sp.status ?? "") ? sp.status : "all") as StatusFilter;
  const connected = dbStatus === "ok";

  const [rows, counts] = await Promise.all([listLogoEntities(kind, { q: sp.q, status, view }), kind === "clients" ? projectCountsByClient() : Promise.resolve(null)]);
  const filtered = Boolean(sp.q) || status !== "all";
  const blocked = sp.blocked ? rows.find((r) => r.id === Number(sp.blocked)) : undefined;

  return (
    <>
      <PageHeader
        t={t}
        title={k.label}
        description={k.description}
        actions={
          <Link href={`/admin/${kind}/new`} className="cms-btn cms-btn-primary" aria-disabled={!connected}>
            {AI.plus} {k.add}
          </Link>
        }
      />
      <DbNotice status={dbStatus} t={t} />
      <SavedNotice saved={sp.saved} t={t} />
      {sp.blocked && (
        <Notice tone="error">
          {fmt(t.lists.blocked, { name: blocked ? pickName(locale, blocked.nameEn, blocked.nameAr).primary : "", n: sp.n ?? "" })}{" "}
          <Link className="cms-link" href={`/admin/projects?client=${sp.blocked}`}>
            {t.lists.blockedLink}
          </Link>
          . {t.lists.blockedHide}
        </Notice>
      )}

      <section className="cms-panel">
        <form className="cms-toolbar" role="search">
          {view === "homepage" && <input type="hidden" name="view" value="homepage" />}
          <label className="cms-search">
            <span className="cms-sr">{k.search}</span>
            {AI.search}
            <input className="cms-input" type="search" name="q" defaultValue={sp.q} placeholder={k.search} dir="auto" />
          </label>
          <label>
            <span className="cms-sr">{t.common.status}</span>
            <select className="cms-select cms-select-auto" name="status" defaultValue={status}>
              <option value="all">{t.common.allStatuses}</option>
              <option value="active">{t.common.active}</option>
              <option value="inactive">{t.common.inactive}</option>
            </select>
          </label>
          <button type="submit" className="cms-btn cms-btn-secondary">
            {t.common.apply}
          </button>
          {filtered && (
            <Link href={`/admin/${kind}${view === "homepage" ? "?view=homepage" : ""}`} className="cms-btn cms-btn-ghost">
              {t.common.clear}
            </Link>
          )}
          <span className="cms-toolbar-end">
            <ViewSwitch t={t} base={`/admin/${kind}`} view={view} params={{ q: sp.q, status: status === "all" ? undefined : status }} />
          </span>
        </form>

        {view === "homepage" && <p className="cms-panel-note">{t.lists.homepageViewHint}</p>}

        {rows.length === 0 ? (
          <EmptyState
            icon={kind === "brands" ? AI.brands : kind === "clients" ? AI.clients : AI.partners}
            title={filtered ? t.lists.noMatches : view === "homepage" ? k.emptyHomepage : k.empty}
            action={
              !filtered && view === "all" && connected ? (
                <Link href={`/admin/${kind}/new`} className="cms-btn cms-btn-primary">
                  {AI.plus} {k.addFirst}
                </Link>
              ) : undefined
            }
          >
            {filtered ? t.lists.noMatchesHint : kind === "partners" ? t.kinds.partners.emptyHint : undefined}
          </EmptyState>
        ) : (
          <div className="cms-table-wrap">
            <table className="cms-table">
              <thead>
                <tr>
                  <th className="cms-col-tight">{view === "homepage" ? t.lists.colSlider : t.lists.colOrder}</th>
                  <th>{k.column}</th>
                  {counts && <th className="cms-hide-sm">{t.lists.colProjects}</th>}
                  <th>{t.lists.colStatus}</th>
                  <th>{t.lists.colHomepage}</th>
                  <th className="cms-col-tight">
                    <span className="cms-sr">{t.common.actions}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const n = counts?.get(r.id) ?? 0;
                  const name = pickName(locale, r.nameEn, r.nameAr);
                  return (
                    <tr key={r.id} data-inactive={!r.isActive}>
                      <td>
                        <MoveButtons
                          t={t}
                          position={i + 1}
                          isFirst={i === 0}
                          isLast={i === rows.length - 1}
                          up={moveLogoEntity.bind(null, kind, r.id, "up", view)}
                          down={moveLogoEntity.bind(null, kind, r.id, "down", view)}
                          disabled={!connected || filtered}
                          label={name.primary}
                        />
                      </td>
                      <td>
                        <div className="cms-cell-main">
                          <Thumb src={r.logo} label={name.primary} />
                          <span>
                            <Link href={`/admin/${kind}/${r.id}`} className="cms-cell-title" dir="auto">
                              {name.primary}
                            </Link>
                            <span className="cms-cell-sub" dir="auto">
                              {name.secondary ?? (r.logo ? t.common.logoUploaded : t.common.noLogo)}
                            </span>
                          </span>
                        </div>
                      </td>
                      {counts && (
                        <td className="cms-hide-sm">
                          {n > 0 ? (
                            <Link href={`/admin/projects?client=${r.id}`} className="cms-link">
                              {fmt(t.lists.projectCount, { n })}
                            </Link>
                          ) : (
                            <span className="cms-muted">{t.common.none}</span>
                          )}
                        </td>
                      )}
                      <td>
                        <SwitchForm action={toggleLogoEntity.bind(null, kind, r.id, "isActive", !r.isActive)} on={r.isActive} label={r.isActive ? t.common.active : t.common.inactive} disabled={!connected} />
                      </td>
                      <td>
                        <SwitchForm
                          action={toggleLogoEntity.bind(null, kind, r.id, "showOnHomepage", !r.showOnHomepage)}
                          on={r.showOnHomepage}
                          label={r.showOnHomepage ? t.common.shown : t.common.hidden}
                          disabled={!connected}
                        />
                      </td>
                      <td>
                        <div className="cms-row-actions">
                          <Link href={`/admin/${kind}/${r.id}`} className="cms-icon-btn" aria-label={fmt(t.common.editItem, { name: name.primary })} title={t.common.edit}>
                            {AI.edit}
                          </Link>
                          <ConfirmDelete
                            action={deleteLogoEntity.bind(null, kind, r.id)}
                            name={name.primary}
                            disabled={!connected}
                            detail={kind === "clients" && n > 0 ? fmt(t.lists.clientDeleteDetail, { n }) : undefined}
                          />
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
      {filtered && rows.length > 0 && <p className="cms-help cms-below">{t.lists.clearToReorder}</p>}
      {view === "all" && rows.length > 0 && !filtered && (
        <p className="cms-help cms-below">
          <Badge tone="teal" plain>
            {t.common.tip}
          </Badge>{" "}
          {k.orderTip}
        </p>
      )}
    </>
  );
}
