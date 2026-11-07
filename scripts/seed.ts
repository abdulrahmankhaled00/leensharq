/**
 * Manual seed: fills a brand-new database with the starter content from content/seed.ts.
 * Uses the same rule as the automatic startup init (lib/db/init.ts): it seeds only when every
 * content table is empty, in one transaction, and never changes existing rows.
 * Usage: npm run db:seed (requires the migration to have run: npm run db:migrate).
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { getDb } from "../lib/db/client";
import { seedIfEmpty } from "../lib/db/seed";

async function main() {
  const db = getDb();
  if (!db) {
    console.error("No database configured (DATABASE_URL or DB_HOST/DB_USER/DB_NAME) — nothing to seed.");
    process.exit(1);
  }
  const result = await seedIfEmpty(db);
  console.log(result.seeded ? `Seeded starter content: ${JSON.stringify(result.rows)}` : `Skipped: ${result.reason} ${JSON.stringify(result.rows)}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Seed failed:", (e as { code?: string })?.code ?? (e as Error)?.message);
    process.exit(1);
  });
