"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { partners } from "@/lib/db/schema";
import { partnerFormSchema, ALLOWED_LOGO_TYPES, MAX_LOGO_BYTES } from "./schema";
import { isAuthenticated } from "@/lib/auth/session";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "partners");

function parseForm(formData: FormData) {
  return partnerFormSchema.safeParse({
    name: formData.get("name"),
    descriptionAr: formData.get("descriptionAr"),
    descriptionEn: formData.get("descriptionEn"),
    websiteUrl: formData.get("websiteUrl") ?? "",
    isActive: formData.get("isActive") === "on",
    displayOrder: formData.get("displayOrder") ?? 0,
  });
}

async function saveLogo(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
    throw new Error("Unsupported logo file type.");
  }
  if (file.size > MAX_LOGO_BYTES) {
    throw new Error("Logo must be 2MB or smaller.");
  }
  await mkdir(UPLOAD_DIR, { recursive: true });
  const ext = file.type === "image/svg+xml" ? "svg" : file.type.split("/")[1];
  const fileName = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, fileName), buffer);
  return `/uploads/partners/${fileName}`;
}

async function requireAdmin() {
  if (!(await isAuthenticated())) {
    throw new Error("Not authenticated.");
  }
}

export async function createPartner(_prevState: { error?: string } | undefined, formData: FormData) {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const db = getDb();
  if (!db) return { error: "Database is not configured yet." };

  let logoPath: string | null = null;
  try {
    const logo = formData.get("logo") as File | null;
    if (logo) logoPath = await saveLogo(logo);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Logo upload failed." };
  }

  await db.insert(partners).values({
    name: parsed.data.name,
    descriptionAr: parsed.data.descriptionAr,
    descriptionEn: parsed.data.descriptionEn,
    websiteUrl: parsed.data.websiteUrl || null,
    logoPath,
    isActive: parsed.data.isActive,
    displayOrder: parsed.data.displayOrder,
  });

  revalidatePath("/admin/partners");
  revalidatePath("/brands");
  revalidatePath("/en/brands");
  redirect("/admin/partners");
}

export async function updatePartner(
  id: number,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const db = getDb();
  if (!db) return { error: "Database is not configured yet." };

  const existing = (await db.select().from(partners).where(eq(partners.id, id)))[0];
  if (!existing) return { error: "Partner not found." };

  let logoPath = existing.logoPath;
  try {
    const logo = formData.get("logo") as File | null;
    if (logo && logo.size > 0) {
      const newPath = await saveLogo(logo);
      if (newPath) {
        if (existing.logoPath) {
          await unlink(path.join(process.cwd(), "public", existing.logoPath)).catch(() => {});
        }
        logoPath = newPath;
      }
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Logo upload failed." };
  }

  await db
    .update(partners)
    .set({
      name: parsed.data.name,
      descriptionAr: parsed.data.descriptionAr,
      descriptionEn: parsed.data.descriptionEn,
      websiteUrl: parsed.data.websiteUrl || null,
      logoPath,
      isActive: parsed.data.isActive,
      displayOrder: parsed.data.displayOrder,
    })
    .where(eq(partners.id, id));

  revalidatePath("/admin/partners");
  revalidatePath("/brands");
  revalidatePath("/en/brands");
  redirect("/admin/partners");
}

export async function deletePartner(id: number) {
  await requireAdmin();
  const db = getDb();
  if (!db) return;

  const existing = (await db.select().from(partners).where(eq(partners.id, id)))[0];
  if (existing?.logoPath) {
    await unlink(path.join(process.cwd(), "public", existing.logoPath)).catch(() => {});
  }
  await db.delete(partners).where(eq(partners.id, id));

  revalidatePath("/admin/partners");
  revalidatePath("/brands");
  revalidatePath("/en/brands");
}

export async function toggleActive(id: number, isActive: boolean) {
  await requireAdmin();
  const db = getDb();
  if (!db) return;
  await db.update(partners).set({ isActive }).where(eq(partners.id, id));
  revalidatePath("/admin/partners");
  revalidatePath("/brands");
  revalidatePath("/en/brands");
}
