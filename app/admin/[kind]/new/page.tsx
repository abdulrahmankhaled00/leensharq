import { notFound } from "next/navigation";
import { getDbStatus } from "@/lib/db/status";
import { isLogoKind } from "@/lib/admin/entities";
import { saveLogoEntity } from "@/lib/admin/logo-actions";
import { getAdminT } from "@/lib/admin/locale";
import { LogoEntityForm } from "@/components/admin/LogoEntityForm";
import { DbNotice, PageHeader } from "@/components/admin/ui";

export default async function NewLogoEntity({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!isLogoKind(kind)) notFound();
  const [{ t }, status] = await Promise.all([getAdminT(), getDbStatus()]);
  const k = t.kinds[kind];
  return (
    <>
      <PageHeader t={t} title={k.new} crumbs={[{ href: `/admin/${kind}`, label: k.label }]} />
      <DbNotice status={status} t={t} />
      <LogoEntityForm action={saveLogoEntity.bind(null, kind, null)} kind={kind} readOnly={status !== "ok"} />
    </>
  );
}
