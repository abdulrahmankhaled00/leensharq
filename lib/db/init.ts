import path from "path";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import * as schema from "./schema";
import { getPool, isDbConfigured } from "./client";
import { resetDbStatus } from "./status";
import { seedIfEmpty } from "./seed";

/**
 * Database initialization at server start (see instrumentation.ts).
 *
 * 1. Takes a MySQL advisory lock, so when several instances start together only one initializes;
 *    the others wait for it and then find nothing left to do.
 * 2. Applies pending migrations from ./drizzle. Drizzle records applied migrations in
 *    __drizzle_migrations and only runs new ones, so this is a no-op on an up-to-date database.
 * 3. Seeds starter content only into a completely empty database (lib/db/seed.ts).
 *
 * Nothing here deletes, resets or overwrites data. Only the migration files in ./drizzle change
 * the schema, so any future migration must itself be non-destructive.
 */

const LOCK_NAME = "leensharq:db-init";
const LOCK_WAIT_SECONDS = 120;
const MAX_ATTEMPTS = 6;
const MIGRATIONS = path.join(/*turbopackIgnore: true*/ process.cwd(), "drizzle");

const log = (msg: string) => console.log(`[db-init] ${msg}`);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Safe description of a failure: the driver error code only, never connection details. */
const describe = (e: unknown) => (e as { code?: string })?.code ?? (e as Error)?.name ?? "unknown error";

async function initOnce() {
  const pool = getPool()!;
  const conn = await pool.getConnection();
  try {
    const [lockRows] = await conn.query("SELECT GET_LOCK(?, ?) AS got", [LOCK_NAME, LOCK_WAIT_SECONDS]);
    if ((lockRows as { got: number | null }[])[0]?.got !== 1) throw Object.assign(new Error("Timed out waiting for the init lock"), { code: "INIT_LOCK_TIMEOUT" });
    try {
      // Run everything on the locked connection so the work is serialized with other instances.
      const db = drizzle(conn, { schema, mode: "default" });
      const [before] = await conn.query("SELECT COUNT(*) AS n FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = '__drizzle_migrations'");
      const hadJournal = Number((before as { n: number }[])[0]?.n) > 0;
      const applied = hadJournal ? Number(((await conn.query("SELECT COUNT(*) AS n FROM __drizzle_migrations"))[0] as { n: number }[])[0]?.n) : 0;

      await migrate(db, { migrationsFolder: MIGRATIONS });

      const after = Number(((await conn.query("SELECT COUNT(*) AS n FROM __drizzle_migrations"))[0] as { n: number }[])[0]?.n);
      log(after > applied ? `applied ${after - applied} migration(s) (${after} total)` : `schema up to date (${after} migration(s))`);

      const seed = await seedIfEmpty(db);
      log(seed.seeded ? `seeded starter content: ${JSON.stringify(seed.rows)}` : `seed skipped: ${seed.reason}`);
    } finally {
      await conn.query("SELECT RELEASE_LOCK(?)", [LOCK_NAME]).catch(() => {});
    }
  } finally {
    conn.release();
  }
}

let running: Promise<void> | null = null;

/**
 * Initializes the database, retrying transient failures. Resolves when the database is ready.
 * After the last failed attempt it exits the process, so the server never serves requests against
 * a database that could not be initialized (the host restarts the app).
 */
export function initDatabase(): Promise<void> {
  if (running) return running;
  running = (async () => {
    if (!isDbConfigured()) {
      log("no database configured; skipping (the site serves its starter content)");
      return;
    }
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        log(`starting (attempt ${attempt}/${MAX_ATTEMPTS})`);
        await initOnce();
        resetDbStatus();
        log("ready");
        return;
      } catch (e) {
        log(`attempt ${attempt} failed: ${describe(e)}`);
        if (attempt === MAX_ATTEMPTS) {
          log("giving up; exiting so the host can restart the app");
          process.exit(1);
        }
        await sleep(Math.min(2000 * 2 ** (attempt - 1), 15000));
      }
    }
  })();
  return running;
}
