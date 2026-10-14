/**
 * Idempotent seed: inserts the verified brand list only if the partners table is empty.
 * Never overwrites existing rows, so running this again after Admin edits is always safe.
 * Usage: npm run db:seed (requires DATABASE_URL in .env.local)
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { getDb } from "../lib/db/client";
import { partners } from "../lib/db/schema";
import { getSeedPartners } from "../lib/db/partners";

async function main() {
  const db = getDb();
  if (!db) {
    console.error("DATABASE_URL is not set — nothing to seed.");
    process.exit(1);
  }

  const existing = await db.select().from(partners);
  if (existing.length > 0) {
    console.log(`Partners table already has ${existing.length} row(s) — skipping seed.`);
    return;
  }

  const seed = getSeedPartners();
  await db.insert(partners).values(seed);
  console.log(`Seeded ${seed.length} partners.`);
}

main().then(() => process.exit(0));
