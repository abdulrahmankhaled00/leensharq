import { and, asc, count, desc, eq, like, or, type SQL } from "drizzle-orm";
import { readyDb } from "@/lib/db/status";
import { clients, documents, homepageSections, projects, type DocumentRow, type LogoEntity, type ProjectRow } from "@/lib/db/schema";
import { seedBrands, seedClients, seedCompanyProfile, seedHomepageSections, seedPartners, seedProjects, HOMEPAGE_SECTION_KEYS } from "@/content/seed";
import { LOGO_ENTITY, type LogoKind } from "./entities";

/**
 * Dashboard reads. Without DATABASE_URL they return the seed rows so the dashboard can be
 * explored read-only; every write action refuses until the database is connected.
 */

const EPOCH = new Date(0);
const SEED_LOGOS: Record<LogoKind, typeof seedBrands> = { brands: seedBrands, clients: seedClients, partners: seedPartners };

function seedLogoRow(r: (typeof seedBrands)[number]): LogoEntity {
  return {
    logo: null,
    logoWidth: null,
    logoHeight: null,
    altTextAr: "",
    altTextEn: "",
    websiteUrl: null,
    isActive: true,
    showOnHomepage: true,
    sortOrder: 0,
    homepageSortOrder: 0,
    createdAt: EPOCH,
    updatedAt: EPOCH,
    ...r,
  } as LogoEntity;
}

export type StatusFilter = "all" | "active" | "inactive";
export interface ListFilters {
  q?: string;
  status?: StatusFilter;
  /** "homepage" lists only homepage items in homepage order. */
  view?: "all" | "homepage";
}

const matches = (q: string, ...values: (string | null | undefined)[]) => values.some((v) => v?.toLowerCase().includes(q.toLowerCase()));

export async function listLogoEntities(kind: LogoKind, f: ListFilters = {}): Promise<LogoEntity[]> {
  const db = await readyDb();
  const homepage = f.view === "homepage";
  if (!db) {
    return SEED_LOGOS[kind]
      .map(seedLogoRow)
      .filter((r) => (!f.q || matches(f.q, r.nameEn, r.nameAr)) && (f.status === "active" ? r.isActive : f.status === "inactive" ? !r.isActive : true) && (!homepage || r.showOnHomepage))
      .sort((a, b) => (homepage ? a.homepageSortOrder - b.homepageSortOrder : a.sortOrder - b.sortOrder));
  }
  const t = LOGO_ENTITY[kind].table;
  const where: SQL[] = [];
  if (f.q) where.push(or(like(t.nameEn, `%${f.q}%`), like(t.nameAr, `%${f.q}%`))!);
  if (f.status === "active") where.push(eq(t.isActive, true));
  if (f.status === "inactive") where.push(eq(t.isActive, false));
  if (homepage) where.push(eq(t.showOnHomepage, true));
  return db
    .select()
    .from(t)
    .where(where.length ? and(...where) : undefined)
    .orderBy(asc(homepage ? t.homepageSortOrder : t.sortOrder), asc(t.id));
}

export async function getLogoEntity(kind: LogoKind, id: number): Promise<LogoEntity | undefined> {
  const db = await readyDb();
  if (!db) {
    const r = SEED_LOGOS[kind].find((x) => x.id === id);
    return r ? seedLogoRow(r) : undefined;
  }
  const t = LOGO_ENTITY[kind].table;
  return (await db.select().from(t).where(eq(t.id, id)).limit(1))[0];
}

export type ProjectListRow = ProjectRow & { clientNameEn: string | null; clientNameAr?: string | null };

export interface ProjectFilters extends ListFilters {
  clientId?: number;
  sector?: string;
}

function seedProjectRow(p: (typeof seedProjects)[number]): ProjectListRow {
  return {
    descriptionAr: null,
    descriptionEn: null,
    image: null,
    clientId: null,
    createdAt: EPOCH,
    updatedAt: EPOCH,
    sectorAr: "",
    sectorEn: "",
    imageAltAr: "",
    imageAltEn: "",
    isActive: true,
    showOnHomepage: false,
    sortOrder: 0,
    homepageSortOrder: 0,
    ...p,
    clientNameEn: seedClients.find((c) => c.id === p.clientId)?.nameEn ?? null,
    clientNameAr: seedClients.find((c) => c.id === p.clientId)?.nameAr ?? null,
  } as ProjectListRow;
}

export async function listProjects(f: ProjectFilters = {}): Promise<ProjectListRow[]> {
  const db = await readyDb();
  const homepage = f.view === "homepage";
  if (!db) {
    return seedProjects
      .map(seedProjectRow)
      .filter(
        (p) =>
          (!f.q || matches(f.q, p.projectNameEn, p.projectNameAr, p.clientNameEn, p.locationEn)) &&
          (!f.clientId || p.clientId === f.clientId) &&
          (!f.sector || p.sectorEn === f.sector) &&
          (f.status === "active" ? p.isActive : f.status === "inactive" ? !p.isActive : true) &&
          (!homepage || p.showOnHomepage)
      )
      .sort((a, b) => (homepage ? a.homepageSortOrder - b.homepageSortOrder : a.sortOrder - b.sortOrder));
  }
  const where: SQL[] = [];
  if (f.q) {
    const q = `%${f.q}%`;
    where.push(or(like(projects.projectNameEn, q), like(projects.projectNameAr, q), like(projects.locationEn, q), like(clients.nameEn, q), like(clients.nameAr, q))!);
  }
  if (f.clientId) where.push(eq(projects.clientId, f.clientId));
  if (f.sector) where.push(eq(projects.sectorEn, f.sector));
  if (f.status === "active") where.push(eq(projects.isActive, true));
  if (f.status === "inactive") where.push(eq(projects.isActive, false));
  if (homepage) where.push(eq(projects.showOnHomepage, true));
  const rows = await db
    .select({ p: projects, clientNameEn: clients.nameEn, clientNameAr: clients.nameAr })
    .from(projects)
    .leftJoin(clients, eq(projects.clientId, clients.id))
    .where(where.length ? and(...where) : undefined)
    .orderBy(asc(homepage ? projects.homepageSortOrder : projects.sortOrder), asc(projects.id));
  return rows.map((r) => ({ ...r.p, clientNameEn: r.clientNameEn, clientNameAr: r.clientNameAr }));
}

export async function getProject(id: number): Promise<ProjectRow | undefined> {
  const db = await readyDb();
  if (!db) {
    const p = seedProjects.find((x) => x.id === id);
    return p ? seedProjectRow(p) : undefined;
  }
  return (await db.select().from(projects).where(eq(projects.id, id)).limit(1))[0];
}

export async function clientOptions(): Promise<{ id: number; nameEn: string; nameAr: string; isActive: boolean }[]> {
  const db = await readyDb();
  if (!db) return seedClients.map((c) => ({ id: c.id, nameEn: c.nameEn, nameAr: c.nameAr, isActive: c.isActive ?? true }));
  return db.select({ id: clients.id, nameEn: clients.nameEn, nameAr: clients.nameAr, isActive: clients.isActive }).from(clients).orderBy(asc(clients.nameEn));
}

/** Distinct sectors, keyed by the English value (used for filtering), with the Arabic label. */
export async function sectorOptions(): Promise<{ en: string; ar: string }[]> {
  const db = await readyDb();
  const rows = db
    ? await db.selectDistinct({ en: projects.sectorEn, ar: projects.sectorAr }).from(projects)
    : seedProjects.map((p) => ({ en: p.sectorEn ?? "", ar: p.sectorAr ?? "" }));
  const map = new Map<string, string>();
  for (const r of rows) if (r.en && !map.has(r.en)) map.set(r.en, r.ar || r.en);
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([en, ar]) => ({ en, ar }));
}

export async function projectCountsByClient(): Promise<Map<number, number>> {
  const db = await readyDb();
  const map = new Map<number, number>();
  if (!db) {
    for (const p of seedProjects) if (p.clientId) map.set(p.clientId, (map.get(p.clientId) ?? 0) + 1);
    return map;
  }
  const rows = await db.select({ clientId: projects.clientId, n: count() }).from(projects).groupBy(projects.clientId);
  for (const r of rows) if (r.clientId) map.set(r.clientId, r.n);
  return map;
}

export async function listDocuments(): Promise<DocumentRow[]> {
  const db = await readyDb();
  if (!db) return [{ ...seedCompanyProfile, uploadedAt: EPOCH, updatedAt: EPOCH } as DocumentRow];
  return db.select().from(documents).where(eq(documents.kind, "company-profile")).orderBy(desc(documents.isActive), desc(documents.uploadedAt));
}

export async function adminHomepageSections() {
  const db = await readyDb();
  const rows = db ? await db.select().from(homepageSections) : seedHomepageSections;
  const listed = [...rows].filter((r) => (HOMEPAGE_SECTION_KEYS as readonly string[]).includes(r.sectionKey)).sort((a, b) => a.sortOrder - b.sortOrder);
  const missing = HOMEPAGE_SECTION_KEYS.filter((k) => !listed.some((r) => r.sectionKey === k)).map((k, i) => ({ sectionKey: k, isVisible: true, sortOrder: listed.length + i }));
  return [...listed, ...missing];
}

export async function overviewStats() {
  const [b, c, p, pr, docs, sections] = await Promise.all([
    listLogoEntities("brands"),
    listLogoEntities("clients"),
    listLogoEntities("partners"),
    listProjects(),
    listDocuments(),
    adminHomepageSections(),
  ]);
  const summary = (rows: { isActive: boolean; showOnHomepage: boolean }[]) => ({
    total: rows.length,
    active: rows.filter((r) => r.isActive).length,
    homepage: rows.filter((r) => r.isActive && r.showOnHomepage).length,
  });
  const recent = [
    ...b.map((r) => ({ kind: "brands" as const, href: `/admin/brands/${r.id}`, nameEn: r.nameEn, nameAr: r.nameAr, updatedAt: r.updatedAt })),
    ...c.map((r) => ({ kind: "clients" as const, href: `/admin/clients/${r.id}`, nameEn: r.nameEn, nameAr: r.nameAr, updatedAt: r.updatedAt })),
    ...p.map((r) => ({ kind: "partners" as const, href: `/admin/partners/${r.id}`, nameEn: r.nameEn, nameAr: r.nameAr, updatedAt: r.updatedAt })),
    ...pr.map((r) => ({ kind: "projects" as const, href: `/admin/projects/${r.id}`, nameEn: r.projectNameEn, nameAr: r.projectNameAr, updatedAt: r.updatedAt })),
  ]
    .filter((r) => r.updatedAt.getTime() > 0)
    .sort((x, y) => y.updatedAt.getTime() - x.updatedAt.getTime())
    .slice(0, 6);
  return {
    brands: summary(b),
    clients: summary(c),
    partners: summary(p),
    projects: summary(pr),
    profile: docs.find((d) => d.isActive) ?? null,
    hiddenSections: sections.filter((s) => !s.isVisible).length,
    recent,
  };
}
