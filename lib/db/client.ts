import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

let pool: mysql.Pool | null = null;

/** Lazily created, single pooled connection for the whole server process. */
export function getDb() {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    pool = mysql.createPool(process.env.DATABASE_URL);
  }
  return drizzle(pool, { schema, mode: "default" });
}
