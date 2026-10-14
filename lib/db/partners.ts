import { asc, eq } from "drizzle-orm";
import { getDb } from "./client";
import { partners, type Partner } from "./schema";
import { ar } from "@/content/ar";
import { en } from "@/content/en";

/** Seed/fallback data used before the DB is wired up, and to seed the real table once it is. */
export function getSeedPartners(): Omit<Partner, "id" | "createdAt" | "updatedAt">[] {
  return ar.brands.seed.map((brand, i) => ({
    name: brand.name,
    descriptionAr: brand.description,
    descriptionEn: en.brands.seed[i]?.description ?? "",
    websiteUrl: null,
    logoPath: null,
    isActive: true,
    displayOrder: i,
  }));
}

export async function getActivePartners(): Promise<Partner[]> {
  const db = getDb();
  if (!db) {
    return getSeedPartners().map((p, i) => ({ ...p, id: -1 - i, createdAt: new Date(), updatedAt: new Date() }));
  }
  return db.select().from(partners).where(eq(partners.isActive, true)).orderBy(asc(partners.displayOrder));
}

export async function getAllPartners(): Promise<Partner[]> {
  const db = getDb();
  if (!db) {
    return getSeedPartners().map((p, i) => ({ ...p, id: -1 - i, createdAt: new Date(), updatedAt: new Date() }));
  }
  return db.select().from(partners).orderBy(asc(partners.displayOrder));
}

export async function getPartnerById(id: number): Promise<Partner | undefined> {
  const db = getDb();
  if (!db) return undefined;
  const rows = await db.select().from(partners).where(eq(partners.id, id));
  return rows[0];
}
