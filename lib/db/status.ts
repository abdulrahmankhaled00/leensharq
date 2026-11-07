import { getDb, getPool, isDbConfigured } from "./client";
import { resolveDatabaseUrl } from "./config";

/**
 * Database health, classified so the dashboard can show a precise, safe message.
 * Raw driver errors (which can contain the host, user or database name) are only logged on the
 * server, never returned to the browser.
 */
export type DbStatus =
  | "ok"
  | "not-configured" // neither DATABASE_URL nor DB_HOST/DB_USER/DB_NAME is set
  | "invalid-config" // the connection settings don't form a valid mysql:// URL
  | "auth" // wrong username / password, or no access to the database
  | "no-database" // the database named in DATABASE_URL does not exist
  | "unreachable" // server down, wrong host/port, or timeout
  | "migrations" // connected, but the tables have not been created
  | "error"; // anything else

/** Every table the app needs. Missing any of them means `npm run db:migrate` has not been run. */
const REQUIRED_TABLES = ["brands", "clients", "partners", "projects", "documents", "homepage_sections"];

function classify(e: unknown): DbStatus {
  const code = (e as { code?: string })?.code ?? "";
  if (["ER_ACCESS_DENIED_ERROR", "ER_DBACCESS_DENIED_ERROR", "ER_NOT_SUPPORTED_AUTH_MODE", "ER_ACCESS_DENIED_NO_PASSWORD_ERROR"].includes(code)) return "auth";
  if (code === "ER_BAD_DB_ERROR") return "no-database";
  if (["ECONNREFUSED", "ENOTFOUND", "ETIMEDOUT", "EHOSTUNREACH", "ECONNRESET", "EAI_AGAIN", "PROTOCOL_CONNECTION_LOST"].includes(code)) return "unreachable";
  if (code === "ERR_INVALID_URL" || e instanceof TypeError) return "invalid-config";
  return "error";
}

let cached: { status: DbStatus; at: number } | null = null;

async function probe(): Promise<DbStatus> {
  if (!isDbConfigured()) return "not-configured";
  try {
    const url = new URL(resolveDatabaseUrl()!);
    if (!/^mysql2?:$/.test(url.protocol) || !url.pathname.replace("/", "")) return "invalid-config";
  } catch {
    return "invalid-config";
  }
  try {
    const pool = getPool()!;
    const [rows] = await pool.query("SELECT table_name AS t FROM information_schema.tables WHERE table_schema = DATABASE()");
    const present = new Set((rows as { t: string }[]).map((r) => String(r.t).toLowerCase()));
    return REQUIRED_TABLES.every((t) => present.has(t)) ? "ok" : "migrations";
  } catch (e) {
    const status = classify(e);
    // Server log only: code + status, never the connection string.
    console.error(`[db] status=${status} code=${(e as { code?: string })?.code ?? "unknown"}`);
    return status;
  }
}

/** Current status, re-checked at most every few seconds (healthy) or every second (failing). */
export async function getDbStatus(): Promise<DbStatus> {
  const ttl = cached?.status === "ok" ? 5000 : 1000;
  if (cached && Date.now() - cached.at < ttl) return cached.status;
  const status = await probe();
  cached = { status, at: Date.now() };
  return status;
}

/** Drizzle instance only when the database is reachable and migrated; otherwise null. */
export async function readyDb() {
  return (await getDbStatus()) === "ok" ? getDb() : null;
}

/** Forget the cached status (e.g. right after a failed query). */
export function resetDbStatus() {
  cached = null;
}
