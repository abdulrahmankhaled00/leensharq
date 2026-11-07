/**
 * Runs once when a server instance starts, and Next.js waits for it before handling requests.
 * Creates / migrates the database tables and seeds a brand-new database (lib/db/init.ts), so
 * hosts without a terminal (no `npm run db:migrate`) still end up with a ready database.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return; // the database layer is Node-only
  if (process.env.NEXT_PHASE === "phase-production-build") return; // never during `next build`
  if (process.env.SKIP_DB_INIT === "1") return; // escape hatch for one-off tooling
  const { initDatabase } = await import("./lib/db/init");
  await initDatabase();
}
