import { eq } from "drizzle-orm";
import { documents } from "@/lib/db/schema";
import { isAuthenticated } from "@/lib/auth/session";
import { hasFile, removeMedia, savePdf, UploadError } from "@/lib/media";
import { MAX_PDF_BYTES, MAX_PDF_MB } from "@/lib/upload-limits";
import { errorMessage, requireDb, revalidateSite } from "@/lib/admin/guard";
import { getAdminT } from "@/lib/admin/locale";
import { fieldErrors, formObject, makeSchemas } from "@/lib/admin/schemas";
import { fmt } from "@/lib/admin/i18n";

/** Room for the form fields and multipart boundaries around a maximum-size PDF. */
const MAX_BODY = MAX_PDF_BYTES + 512 * 1024;

const json = (body: unknown, status = 200) => Response.json(body, { status });

/**
 * Uploads a new company-profile PDF and makes it the active one.
 * A route handler rather than a Server Action so that only this endpoint accepts large bodies.
 */
export async function POST(request: Request) {
  const { t } = await getAdminT();
  if (!(await isAuthenticated())) return json({ error: t.errors.sessionExpired }, 401);

  // Same-origin only (Server Actions get this check from Next; route handlers must do it themselves).
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host) return json({ error: t.errors.uploadFailed }, 403);

  // Reject oversized uploads before reading the body.
  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > MAX_BODY) return json({ error: t.errors.fixFields, fieldErrors: { file: [fmt(t.errors.pdfTooLarge, { max: MAX_PDF_MB })] } }, 413);

  let fd: FormData;
  try {
    fd = await request.formData();
  } catch {
    return json({ error: t.errors.uploadFailed }, 400);
  }

  const values = formObject(fd);
  const parsed = makeSchemas(t).documentLabels.safeParse(values);
  const file = fd.get("file");
  if (!parsed.success || !hasFile(file)) {
    const errors = parsed.success ? {} : fieldErrors(parsed.error);
    if (!hasFile(file)) errors.file = [t.errors.pdfRequired];
    return json({ error: t.errors.fixFields, fieldErrors: errors }, 422);
  }

  let saved: Awaited<ReturnType<typeof savePdf>> | null = null;
  try {
    const db = await requireDb();
    saved = await savePdf(file);
    const doc = saved;
    await db.transaction(async (tx) => {
      await tx.update(documents).set({ isActive: false }).where(eq(documents.kind, "company-profile"));
      await tx.insert(documents).values({
        kind: "company-profile",
        titleEn: parsed.data.titleEn,
        titleAr: parsed.data.titleAr,
        fileUrl: doc.url,
        originalFileName: doc.originalName,
        fileSize: doc.size,
        isActive: true,
        showDownloadButton: fd.get("showDownloadButton") === "on",
      });
    });
  } catch (e) {
    if (saved) await removeMedia(saved.url); // never leave an orphaned PDF behind
    const message = errorMessage(e, t);
    if (e instanceof UploadError) return json({ error: t.errors.fixFields, fieldErrors: { file: [message] } }, 422);
    return json({ error: message }, 500);
  }

  revalidateSite();
  return json({ ok: true });
}
