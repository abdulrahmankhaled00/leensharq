import { and, asc, eq } from "drizzle-orm";
import { readyDb } from "@/lib/db/status";
import { asLogoTable, brands, clients, documents, homepageSections, partners, projects, type LogoEntity, type LogoTable } from "@/lib/db/schema";
import type { Locale, LogoItem, Project } from "@/content/types";
import {
  HOMEPAGE_SECTION_KEYS,
  seedBrands,
  seedClients,
  seedCompanyProfile,
  seedHomepageSections,
  seedPartners,
  seedProjects,
  type HomepageSectionKey,
} from "@/content/seed";

/**
 * Public-site reads for dashboard-managed content.
 * With a database: live rows. Without DATABASE_URL: the rows in content/seed.ts, filtered and
 * ordered by exactly the same rules, so the site looks the same before and after the DB is wired up.
 */

type Scope = { homepage?: boolean };

function byOrder<T extends { sortOrder?: number | null; homepageSortOrder?: number | null }>(rows: T[], homepage?: boolean) {
  const key = homepage ? "homepageSortOrder" : "sortOrder";
  return [...rows].sort((a, b) => (a[key] ?? 0) - (b[key] ?? 0));
}

function visible<T extends { isActive?: boolean | null; showOnHomepage?: boolean | null }>(rows: T[], homepage?: boolean) {
  return rows.filter((r) => (r.isActive ?? true) && (!homepage || (r.showOnHomepage ?? true)));
}

function toLogoItem(row: Pick<LogoEntity, "id" | "nameAr" | "nameEn" | "logo" | "logoWidth" | "logoHeight" | "altTextAr" | "altTextEn" | "websiteUrl">, locale: Locale): LogoItem {
  const name = locale === "ar" ? row.nameAr : row.nameEn;
  const alt = (locale === "ar" ? row.altTextAr : row.altTextEn) || name;
  return {
    id: String(row.id),
    name,
    alt,
    logo: row.logo ? { src: row.logo, width: row.logoWidth || 300, height: row.logoHeight || 100 } : undefined,
    url: row.websiteUrl ?? undefined,
  };
}

async function logoCollection(table: LogoTable, seed: typeof seedBrands, locale: Locale, { homepage }: Scope) {
  const db = await readyDb();
  if (!db) {
    return byOrder(visible(seed, homepage), homepage).map((r) => toLogoItem({ logoWidth: null, logoHeight: null, logo: null, websiteUrl: null, altTextAr: "", altTextEn: "", ...r }, locale));
  }
  const rows = await db
    .select()
    .from(table)
    .where(homepage ? and(eq(table.isActive, true), eq(table.showOnHomepage, true)) : eq(table.isActive, true))
    .orderBy(asc(homepage ? table.homepageSortOrder : table.sortOrder), asc(table.id));
  return rows.map((r) => toLogoItem(r, locale));
}

export const getBrands = (locale: Locale, scope: Scope = {}) => logoCollection(brands, seedBrands, locale, scope);
export const getClients = (locale: Locale, scope: Scope = {}) => logoCollection(asLogoTable(clients), seedClients, locale, scope);
/** Prepared for a future Partners section; not rendered anywhere yet. */
export const getPartners = (locale: Locale, scope: Scope = {}) => logoCollection(asLogoTable(partners), seedPartners, locale, scope);

export async function getProjects(locale: Locale, { homepage }: Scope = {}): Promise<Project[]> {
  const ar = locale === "ar";
  const db = await readyDb();

  type Row = (typeof seedProjects)[number] & { clientNameAr?: string | null; clientNameEn?: string | null };
  let rows: Row[];
  if (!db) {
    rows = byOrder(visible(seedProjects, homepage), homepage).map((p) => {
      const c = seedClients.find((x) => x.id === p.clientId);
      return { ...p, clientNameAr: c?.nameAr, clientNameEn: c?.nameEn };
    });
  } else {
    rows = await db
      .select({
        id: projects.id,
        clientId: projects.clientId,
        projectNameAr: projects.projectNameAr,
        projectNameEn: projects.projectNameEn,
        descriptionAr: projects.descriptionAr,
        descriptionEn: projects.descriptionEn,
        locationAr: projects.locationAr,
        locationEn: projects.locationEn,
        scopeOfWorkAr: projects.scopeOfWorkAr,
        scopeOfWorkEn: projects.scopeOfWorkEn,
        image: projects.image,
        imageAltAr: projects.imageAltAr,
        imageAltEn: projects.imageAltEn,
        clientNameAr: clients.nameAr,
        clientNameEn: clients.nameEn,
      })
      .from(projects)
      .leftJoin(clients, eq(projects.clientId, clients.id))
      .where(homepage ? and(eq(projects.isActive, true), eq(projects.showOnHomepage, true)) : eq(projects.isActive, true))
      .orderBy(asc(homepage ? projects.homepageSortOrder : projects.sortOrder), asc(projects.id));
  }

  return rows.map((p) => ({
    id: String(p.id),
    image: p.image ? { src: p.image } : undefined,
    imageAlt: (ar ? p.imageAltAr : p.imageAltEn) || "",
    projectName: ar ? p.projectNameAr : p.projectNameEn,
    client: (ar ? p.clientNameAr : p.clientNameEn) ?? "",
    location: ar ? p.locationAr : p.locationEn,
    scopeOfWork: ar ? p.scopeOfWorkAr : p.scopeOfWorkEn,
    description: (ar ? p.descriptionAr : p.descriptionEn) || undefined,
  }));
}

export interface CompanyProfileLink {
  href: string;
  label: string;
}

/**
 * The one place the site gets the company-profile PDF from (footer, contact page).
 * Returns null when there is no active PDF or its download button is switched off.
 */
export async function getCompanyProfile(locale: Locale): Promise<CompanyProfileLink | null> {
  const db = await readyDb();
  const doc = db
    ? (await db.select().from(documents).where(and(eq(documents.kind, "company-profile"), eq(documents.isActive, true))).limit(1))[0]
    : seedCompanyProfile;
  if (!doc || !doc.isActive || !doc.showDownloadButton) return null;
  return { href: doc.fileUrl, label: locale === "ar" ? doc.titleAr : doc.titleEn };
}

/** Visible homepage sections in display order. Sections missing from the table are appended, visible. */
export async function getHomepageSections(): Promise<HomepageSectionKey[]> {
  const db = await readyDb();
  const rows = db ? await db.select().from(homepageSections) : seedHomepageSections;
  const known = new Set<string>(HOMEPAGE_SECTION_KEYS);
  const listed = rows.filter((r) => known.has(r.sectionKey)).sort((a, b) => a.sortOrder - b.sortOrder);
  const missing = HOMEPAGE_SECTION_KEYS.filter((k) => !listed.some((r) => r.sectionKey === k));
  return [...listed.filter((r) => r.isVisible).map((r) => r.sectionKey as HomepageSectionKey), ...missing];
}
