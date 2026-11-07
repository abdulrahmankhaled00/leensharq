import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import { resolveDatabaseUrl } from "./config";

let pool: mysql.Pool | null = null;

/** True when DATABASE_URL or the DB_* variables are set (they may still be wrong; see lib/db/status.ts). */
export function isDbConfigured() {
  return resolveDatabaseUrl() !== null;
}

/** Lazily created pool for the whole server process. Returns null when no database is configured. */
export function getPool(): mysql.Pool | null {
  if (!isDbConfigured()) return null;
  if (!pool) {
    pool = mysql.createPool({
      uri: resolveDatabaseUrl()!,
      connectionLimit: 10,
      connectTimeout: 5000, // fail fast when the server is unreachable
      charset: "utf8mb4",
    });
  }
  return pool;
}

/**
 * Drizzle instance, or null when DATABASE_URL is not set.
 * Prefer readyDb() from lib/db/status.ts, which also confirms the database is reachable and migrated.
 */
export function getDb() {
  const p = getPool();
  return p ? drizzle(p, { schema, mode: "default" }) : null;
}
