import { notFound } from "next/navigation";
import { getDbStatus } from "@/lib/db/status";
import { isLogoKind } from "@/lib/admin/entities";
import { getLogoEntity } from "@/lib/admin/queries";
import { deleteLogoEntity, saveLogoEntity } from "@/lib/admin/logo-actions";
import { getAdminT } from "@/lib/admin/locale";
import { fmt, formatAdminDate } from "@/lib/admin/i18n";
import { LogoEntityForm } from "@/components/admin/LogoEntityForm";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { Badge, DbNotice, PageHeader, pickName } from "@/components/admin/ui";

export default async function EditLogoEntity({ params }: { params: Promise<{ kind: string; id: string }> }) {
  const { kind, id } = await params;
  if (!isLogoKind(kind)) notFound();
  const itemId = Number(id);
  if (!Number.isInteger(itemId)) notFound();
  const [{ t, locale }, status, item] = await Promise.all([getAdminT(), getDbStatus(), getLogoEntity(kind, itemId)]);
  if (!item) notFound();
  const k = t.kinds[kind];
  const name = pickName(locale, item.nameEn, item.nameAr).primary;
  const connected = status === "ok";

  return (
    <>
      <PageHeader
        t={t}
        title={name}
        crumbs={[{ href: `/admin/${kind}`, label: k.label }]}
        description={
          <>
            <Badge tone={item.isActive ? "green" : "neutral"}>{item.isActive ? t.common.active : t.common.inactive}</Badge>{" "}
            <Badge tone={item.showOnHomepage ? "teal" : "neutral"}>{item.showOnHomepage ? t.common.onHomepage : t.common.notOnHomepage}</Badge>{" "}
            <span className="ad-small">{fmt(t.common.lastUpdated, { date: formatAdminDate(item.updatedAt, locale) })}</span>
          </>
        }
        actions={<ConfirmDelete action={deleteLogoEntity.bind(null, kind, item.id)} name={name} disabled={!connected} variant="button" />}
      />
      <DbNotice status={status} t={t} />
      <LogoEntityForm action={saveLogoEntity.bind(null, kind, item.id)} item={item} kind={kind} readOnly={!connected} />
    </>
  );
}
