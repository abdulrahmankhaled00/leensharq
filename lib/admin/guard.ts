import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth/session";
import { getDbStatus, readyDb, type DbStatus } from "@/lib/db/status";
import { UploadError } from "@/lib/media";
import { MAX_IMAGE_MB, MAX_PDF_MB } from "@/lib/upload-limits";
import { fmt, type AdminDict } from "./i18n";

/** Every dashboard Server Action starts here: actions are public POST endpoints, so re-check the session. */
export async function requireAdmin() {
  if (!(await isAuthenticated())) throw new Error("Not authenticated.");
}

export class DbUnavailableError extends Error {
  constructor(public status: DbStatus) {
    super(`Database unavailable: ${status}`);
  }
}

/** Drizzle instance for a write, or a DbUnavailableError carrying the reason. */
export async function requireDb() {
  const db = await readyDb();
  if (!db) throw new DbUnavailableError(await getDbStatus());
  return db;
}

/** Refresh the whole public site plus the dashboard after a content change. */
export function revalidateSite() {
  revalidatePath("/", "layout");
}

/**
 * Result of a dashboard form action. On failure it echoes the submitted text `values` back, because
 * React resets uncontrolled forms after an action and the admin's input would otherwise be lost.
 */
export type FormState = { error?: string; fieldErrors?: Record<string, string[] | undefined>; values?: Record<string, string> } | undefined;

/** Safe, localized message for anything thrown while saving. Raw errors go to the server log only. */
export function errorMessage(e: unknown, t: AdminDict): string {
  if (e instanceof UploadError) return fmt(t.errors[e.code], { max: e.code.startsWith("pdf") ? MAX_PDF_MB : MAX_IMAGE_MB });
  if (e instanceof DbUnavailableError) return `${t.db.readOnly} ${t.db[e.status === "ok" ? "error" : e.status]}`;
  console.error("[admin] save failed:", (e as { code?: string })?.code ?? (e as Error)?.name ?? "unknown");
  return t.errors.saveFailed;
}
