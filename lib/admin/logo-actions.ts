"use server";

import { asc, count, eq, max } from "drizzle-orm";
import { redirect } from "next/navigation";
import { projects } from "@/lib/db/schema";
import { hasFile, removeMedia, saveImage, UploadError } from "@/lib/media";
import { isLogoKind, LOGO_ENTITY, type LogoKind } from "./entities";
import { errorMessage, requireAdmin, requireDb, revalidateSite, type FormState } from "./guard";
import { getAdminT } from "./locale";
import { fieldErrors, formObject, makeSchemas } from "./schemas";
import { moveInList } from "./reorder";

function config(kind: string) {
  if (!isLogoKind(kind)) throw new Error("Unknown collection.");
  return LOGO_ENTITY[kind];
}

export async function saveLogoEntity(kind: LogoKind, id: number | null, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const { t } = await getAdminT();
  const { table, folder } = config(kind);
  const values = formObject(fd);
  const parsed = makeSchemas(t).logoEntity.safeParse(values);
  if (!parsed.success) return { error: t.errors.fixFields, fieldErrors: fieldErrors(parsed.error), values };
  const { removeLogo, websiteUrl, ...data } = parsed.data;

  let uploaded: string | null = null;
  try {
    const db = await requireDb();
    const existing = id ? (await db.select().from(table).where(eq(table.id, id)).limit(1))[0] : undefined;
    if (id && !existing) return { error: t.errors.itemGone, values };

    let logo = existing?.logo ?? null;
    let logoWidth = existing?.logoWidth ?? null;
    let logoHeight = existing?.logoHeight ?? null;
    const file = fd.get("logo");
    if (hasFile(file)) {
      const saved = await saveImage(file, folder);
      uploaded = saved.url;
      ({ url: logo, width: logoWidth, height: logoHeight } = saved);
    } else if (removeLogo) {
      logo = logoWidth = logoHeight = null;
    }

    const row = { ...data, websiteUrl: websiteUrl || null, logo, logoWidth, logoHeight };
    if (existing) {
      await db.update(table).set(row).where(eq(table.id, existing.id));
    } else {
      const [{ s, h }] = await db.select({ s: max(table.sortOrder), h: max(table.homepageSortOrder) }).from(table);
      await db.insert(table).values({ ...row, sortOrder: (s ?? -1) + 1, homepageSortOrder: (h ?? -1) + 1 });
    }
    // Only after the row is saved: drop the file it no longer points to.
    if (existing?.logo && existing.logo !== logo) await removeMedia(existing.logo);
    uploaded = null;
  } catch (e) {
    if (uploaded) await removeMedia(uploaded); // never leave an orphaned upload behind
    const message = errorMessage(e, t);
    if (e instanceof UploadError) return { error: t.errors.fixFields, fieldErrors: { logo: [message] }, values };
    return { error: message, values };
  }

  revalidateSite();
  redirect(`/admin/${kind}?saved=${id ? "updated" : "created"}`);
}

export async function deleteLogoEntity(kind: LogoKind, id: number) {
  await requireAdmin();
  const { table } = config(kind);
  const db = await requireDb();

  if (kind === "clients") {
    const [{ n }] = await db.select({ n: count() }).from(projects).where(eq(projects.clientId, id));
    if (n > 0) redirect(`/admin/clients?blocked=${id}&n=${n}`);
  }

  const existing = (await db.select().from(table).where(eq(table.id, id)).limit(1))[0];
  if (existing) {
    await db.delete(table).where(eq(table.id, id));
    await removeMedia(existing.logo);
  }
  revalidateSite();
  redirect(`/admin/${kind}?saved=deleted`);
}

export async function toggleLogoEntity(kind: LogoKind, id: number, field: "isActive" | "showOnHomepage", value: boolean) {
  await requireAdmin();
  const { table } = config(kind);
  const db = await requireDb();
  await db.update(table).set({ [field]: value }).where(eq(table.id, id));
  revalidateSite();
}

export async function moveLogoEntity(kind: LogoKind, id: number, direction: "up" | "down", scope: "all" | "homepage") {
  await requireAdmin();
  const { table } = config(kind);
  const db = await requireDb();
  const homepage = scope === "homepage";
  const col = homepage ? table.homepageSortOrder : table.sortOrder;
  const rows = await db
    .select({ id: table.id })
    .from(table)
    .where(homepage ? eq(table.showOnHomepage, true) : undefined)
    .orderBy(asc(col), asc(table.id));
  const next = moveInList(
    rows.map((r) => r.id),
    id,
    direction
  );
  if (!next) return;
  await db.transaction(async (tx) => {
    for (const [i, rowId] of next.entries()) {
      await tx.update(table).set(homepage ? { homepageSortOrder: i } : { sortOrder: i }).where(eq(table.id, rowId));
    }
  });
  revalidateSite();
}
