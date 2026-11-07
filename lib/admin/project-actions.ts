"use server";

import { asc, eq, max } from "drizzle-orm";
import { redirect } from "next/navigation";
import { clients, projects } from "@/lib/db/schema";
import { hasFile, removeMedia, saveImage, UploadError } from "@/lib/media";
import { errorMessage, requireAdmin, requireDb, revalidateSite, type FormState } from "./guard";
import { getAdminT } from "./locale";
import { fieldErrors, formObject, makeSchemas } from "./schemas";
import { moveInList } from "./reorder";

export async function saveProject(id: number | null, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const { t } = await getAdminT();
  const values = formObject(fd);
  const parsed = makeSchemas(t).project.safeParse(values);
  if (!parsed.success) return { error: t.errors.fixFields, fieldErrors: fieldErrors(parsed.error), values };
  const { removeImage, descriptionAr, descriptionEn, ...data } = parsed.data;

  let uploaded: string | null = null;
  try {
    const db = await requireDb();
    if (data.clientId) {
      const client = (await db.select({ id: clients.id }).from(clients).where(eq(clients.id, data.clientId)).limit(1))[0];
      if (!client) return { error: t.errors.fixFields, fieldErrors: { clientId: [t.errors.clientGone] }, values };
    }
    const existing = id ? (await db.select().from(projects).where(eq(projects.id, id)).limit(1))[0] : undefined;
    if (id && !existing) return { error: t.errors.projectGone, values };

    let image = existing?.image ?? null;
    const file = fd.get("image");
    if (hasFile(file)) {
      uploaded = (await saveImage(file, "projects")).url;
      image = uploaded;
    } else if (removeImage) {
      image = null;
    }

    const row = { ...data, descriptionAr: descriptionAr || null, descriptionEn: descriptionEn || null, image };
    if (existing) {
      await db.update(projects).set(row).where(eq(projects.id, existing.id));
    } else {
      const [{ s, h }] = await db.select({ s: max(projects.sortOrder), h: max(projects.homepageSortOrder) }).from(projects);
      await db.insert(projects).values({ ...row, sortOrder: (s ?? -1) + 1, homepageSortOrder: (h ?? -1) + 1 });
    }
    if (existing?.image && existing.image !== image) await removeMedia(existing.image);
    uploaded = null;
  } catch (e) {
    if (uploaded) await removeMedia(uploaded); // never leave an orphaned upload behind
    const message = errorMessage(e, t);
    if (e instanceof UploadError) return { error: t.errors.fixFields, fieldErrors: { image: [message] }, values };
    return { error: message, values };
  }

  revalidateSite();
  redirect(`/admin/projects?saved=${id ? "updated" : "created"}`);
}

export async function deleteProject(id: number) {
  await requireAdmin();
  const db = await requireDb();
  const existing = (await db.select().from(projects).where(eq(projects.id, id)).limit(1))[0];
  if (existing) {
    await db.delete(projects).where(eq(projects.id, id));
    await removeMedia(existing.image);
  }
  revalidateSite();
  redirect("/admin/projects?saved=deleted");
}

export async function toggleProject(id: number, field: "isActive" | "showOnHomepage", value: boolean) {
  await requireAdmin();
  const db = await requireDb();
  await db.update(projects).set({ [field]: value }).where(eq(projects.id, id));
  revalidateSite();
}

export async function moveProject(id: number, direction: "up" | "down", scope: "all" | "homepage") {
  await requireAdmin();
  const db = await requireDb();
  const homepage = scope === "homepage";
  const rows = await db
    .select({ id: projects.id })
    .from(projects)
    .where(homepage ? eq(projects.showOnHomepage, true) : undefined)
    .orderBy(asc(homepage ? projects.homepageSortOrder : projects.sortOrder), asc(projects.id));
  const next = moveInList(
    rows.map((r) => r.id),
    id,
    direction
  );
  if (!next) return;
  await db.transaction(async (tx) => {
    for (const [i, rowId] of next.entries()) {
      await tx.update(projects).set(homepage ? { homepageSortOrder: i } : { sortOrder: i }).where(eq(projects.id, rowId));
    }
  });
  revalidateSite();
}
