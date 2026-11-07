import { count } from "drizzle-orm";
import type { MySql2Database } from "drizzle-orm/mysql2";
import { brands, clients, documents, homepageSections, partners, projects } from "./schema";
import type * as schema from "./schema";
import { seedBrands, seedClients, seedCompanyProfile, seedHomepageSections, seedPartners, seedProjects } from "@/content/seed";

type Db = MySql2Database<typeof schema>;

/** Every table that receives starter content. */
const TABLES = { clients, brands, partners, projects, documents, homepage_sections: homepageSections } as const;

export type SeedResult = { seeded: boolean; reason: string; rows: Record<string, number> };

/**
 * Fills a brand-new database with the starter content from content/seed.ts.
 *
 * Safety rules:
 * - Runs only when EVERY content table is empty (a database that has never had content).
 *   Once anything exists, it does nothing, so it never overwrites rows and never brings back
 *   content an admin deliberately deleted.
 * - All inserts happen in one transaction: either everything is seeded or nothing is.
 */
export async function seedIfEmpty(db: Db): Promise<SeedResult> {
  const rows: Record<string, number> = {};
  for (const [name, table] of Object.entries(TABLES)) {
    const [{ n }] = await db.select({ n: count() }).from(table);
    rows[name] = n;
  }
  if (Object.values(rows).some((n) => n > 0)) {
    return { seeded: false, reason: "database already has content", rows };
  }

  await db.transaction(async (tx) => {
    // Clients before projects: projects reference clients by id.
    await tx.insert(clients).values(seedClients);
    await tx.insert(brands).values(seedBrands);
    if (seedPartners.length) await tx.insert(partners).values(seedPartners);
    await tx.insert(projects).values(seedProjects);
    await tx.insert(documents).values([seedCompanyProfile]);
    await tx.insert(homepageSections).values(seedHomepageSections);
  });

  return {
    seeded: true,
    reason: "empty database",
    rows: {
      clients: seedClients.length,
      brands: seedBrands.length,
      partners: seedPartners.length,
      projects: seedProjects.length,
      documents: 1,
      homepage_sections: seedHomepageSections.length,
    },
  };
}
