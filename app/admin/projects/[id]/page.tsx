import { notFound } from "next/navigation";
import { getDbStatus } from "@/lib/db/status";
import { clientOptions, getProject, sectorOptions } from "@/lib/admin/queries";
import { deleteProject, saveProject } from "@/lib/admin/project-actions";
import { getAdminT } from "@/lib/admin/locale";
import { fmt, formatAdminDate } from "@/lib/admin/i18n";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { Badge, DbNotice, PageHeader, pickName } from "@/components/admin/ui";

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projectId = Number(id);
  if (!Number.isInteger(projectId)) notFound();
  const [{ t, locale }, status, item, clients, sectors] = await Promise.all([getAdminT(), getDbStatus(), getProject(projectId), clientOptions(), sectorOptions()]);
  if (!item) notFound();
  const name = pickName(locale, item.projectNameEn, item.projectNameAr).primary;
  const connected = status === "ok";

  return (
    <>
      <PageHeader
        t={t}
        title={name}
        crumbs={[{ href: "/admin/projects", label: t.projects.title }]}
        description={
          <>
            <Badge tone={item.isActive ? "green" : "neutral"}>{item.isActive ? t.common.active : t.common.inactive}</Badge>{" "}
            <Badge tone={item.showOnHomepage ? "teal" : "neutral"}>{item.showOnHomepage ? t.common.onHomepage : t.common.notOnHomepage}</Badge>{" "}
            <span className="ad-small">{fmt(t.common.lastUpdated, { date: formatAdminDate(item.updatedAt, locale) })}</span>
          </>
        }
        actions={<ConfirmDelete action={deleteProject.bind(null, item.id)} name={name} disabled={!connected} variant="button" />}
      />
      <DbNotice status={status} t={t} />
      <ProjectForm action={saveProject.bind(null, item.id)} item={item} clients={clients} sectors={sectors} readOnly={!connected} />
    </>
  );
}
