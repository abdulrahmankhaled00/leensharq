import { getDbStatus } from "@/lib/db/status";
import { clientOptions, sectorOptions } from "@/lib/admin/queries";
import { saveProject } from "@/lib/admin/project-actions";
import { getAdminT } from "@/lib/admin/locale";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { DbNotice, PageHeader } from "@/components/admin/ui";

export default async function NewProject() {
  const [{ t }, status, clients, sectors] = await Promise.all([getAdminT(), getDbStatus(), clientOptions(), sectorOptions()]);
  return (
    <>
      <PageHeader t={t} title={t.projects.new} crumbs={[{ href: "/admin/projects", label: t.projects.title }]} />
      <DbNotice status={status} t={t} />
      <ProjectForm action={saveProject.bind(null, null)} clients={clients} sectors={sectors} readOnly={status !== "ok"} />
    </>
  );
}
