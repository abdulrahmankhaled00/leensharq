"use server";

import { and, eq, ne } from "drizzle-orm";
import { redirect } from "next/navigation";
import { documents, homepageSections } from "@/lib/db/schema";
import { HOMEPAGE_SECTION_KEYS } from "@/content/seed";
import { removeMedia } from "@/lib/media";
import { errorMessage, requireAdmin, requireDb, revalidateSite, type FormState } from "./guard";
import { getAdminT } from "./locale";
import { fieldErrors, formObject, makeSchemas } from "./schemas";
import { moveInList } from "./reorder";
import { adminHomepageSections } from "./queries";

// ───────── Company profile PDF ─────────
// Uploading a new PDF is handled by app/admin/api/company-profile/route.ts, which alone accepts
// bodies up to 32 MB; Server Actions keep a small limit sized for 2 MB images.

/** Edits the button labels and visibility of the active PDF without replacing the file. */
export async function updateCompanyProfileSettings(id: number, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const { t } = await getAdminT();
  const values = formObject(fd);
  const parsed = makeSchemas(t).documentLabels.safeParse(values);
  if (!parsed.success) return { error: t.errors.fixFields, fieldErrors: fieldErrors(parsed.error), values };
  try {
    const db = await requireDb();
    await db
      .update(documents)
      .set({ ...parsed.data, showDownloadButton: fd.get("showDownloadButton") === "on" })
      .where(eq(documents.id, id));
  } catch (e) {
    return { error: errorMessage(e, t), values };
  }
  revalidateSite();
  redirect("/admin/company-profile?saved=updated");
}

/** Makes an older upload the active PDF again. Only one company profile is ever active. */
export async function activateDocument(id: number) {
  await requireAdmin();
  const db = await requireDb();
  const doc = (await db.select().from(documents).where(eq(documents.id, id)).limit(1))[0];
  if (!doc) return;
  await db.transaction(async (tx) => {
    await tx.update(documents).set({ isActive: false }).where(and(eq(documents.kind, doc.kind), ne(documents.id, id)));
    await tx.update(documents).set({ isActive: true }).where(eq(documents.id, id));
  });
  revalidateSite();
  redirect("/admin/company-profile?saved=activated");
}

/** Switches the active PDF off: the site hides every download button until one is activated. */
export async function deactivateDocument(id: number) {
  await requireAdmin();
  const db = await requireDb();
  await db.update(documents).set({ isActive: false }).where(eq(documents.id, id));
  revalidateSite();
  redirect("/admin/company-profile?saved=deactivated");
}

export async function deleteDocument(id: number) {
  await requireAdmin();
  const db = await requireDb();
  const doc = (await db.select().from(documents).where(eq(documents.id, id)).limit(1))[0];
  if (doc) {
    await db.delete(documents).where(eq(documents.id, id));
    await removeMedia(doc.fileUrl);
  }
  revalidateSite();
  redirect("/admin/company-profile?saved=deleted");
}

// ───────── Homepage sections ─────────

async function writeSections(rows: { sectionKey: string; isVisible: boolean }[]) {
  const db = await requireDb();
  await db.transaction(async (tx) => {
    for (const [i, r] of rows.entries()) {
      await tx
        .insert(homepageSections)
        .values({ sectionKey: r.sectionKey, isVisible: r.isVisible, sortOrder: i })
        .onDuplicateKeyUpdate({ set: { isVisible: r.isVisible, sortOrder: i } });
    }
  });
  revalidateSite();
}

export async function toggleHomepageSection(key: string, isVisible: boolean) {
  await requireAdmin();
  if (!(HOMEPAGE_SECTION_KEYS as readonly string[]).includes(key)) return;
  const rows = await adminHomepageSections();
  await writeSections(rows.map((r) => (r.sectionKey === key ? { ...r, isVisible } : r)));
}

export async function moveHomepageSection(key: string, direction: "up" | "down") {
  await requireAdmin();
  const rows = await adminHomepageSections();
  const keys = rows.map((r) => r.sectionKey);
  const idx = moveInList(
    keys.map((_, i) => i),
    keys.indexOf(key),
    direction
  );
  if (!idx) return;
  await writeSections(idx.map((i) => rows[i]));
}
