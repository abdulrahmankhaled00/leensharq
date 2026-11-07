import { boolean, index, int, mysqlTable, timestamp, varchar, text, type AnyMySqlColumn } from "drizzle-orm/mysql-core";

/**
 * Columns shared by every logo collection (brands, clients, partners).
 * Brands, Clients and Partners are deliberately separate tables: they mean different things
 * and are shown in different places, so they must never share a collection.
 */
const logoEntityColumns = () => ({
  id: int("id").autoincrement().primaryKey(),
  nameAr: varchar("name_ar", { length: 160 }).notNull(),
  nameEn: varchar("name_en", { length: 160 }).notNull(),
  /** Public URL of the uploaded logo (served by app/media), or null for a placeholder. */
  logo: varchar("logo", { length: 255 }),
  /** Intrinsic logo size, read at upload time, so the site can balance logos of any shape. */
  logoWidth: int("logo_width"),
  logoHeight: int("logo_height"),
  altTextAr: varchar("alt_text_ar", { length: 255 }).notNull().default(""),
  altTextEn: varchar("alt_text_en", { length: 255 }).notNull().default(""),
  websiteUrl: varchar("website_url", { length: 255 }),
  isActive: boolean("is_active").notNull().default(true),
  showOnHomepage: boolean("show_on_homepage").notNull().default(true),
  /** Order everywhere the full list is shown (e.g. /brands). */
  sortOrder: int("sort_order").notNull().default(0),
  /** Order inside the homepage slider. */
  homepageSortOrder: int("homepage_sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const brands = mysqlTable("brands", logoEntityColumns(), (t) => [index("brands_sort_idx").on(t.sortOrder)]);
export const clients = mysqlTable("clients", logoEntityColumns(), (t) => [index("clients_sort_idx").on(t.sortOrder)]);
export const partners = mysqlTable("partners", logoEntityColumns(), (t) => [index("partners_sort_idx").on(t.sortOrder)]);

export const projects = mysqlTable(
  "projects",
  {
    id: int("id").autoincrement().primaryKey(),
    /**
     * The client this project was delivered for. RESTRICT: a client that still has projects cannot be
     * deleted (the dashboard explains why), so deleting a client never silently removes projects.
     */
    clientId: int("client_id").references((): AnyMySqlColumn => clients.id, { onDelete: "restrict", onUpdate: "cascade" }),
    projectNameAr: varchar("project_name_ar", { length: 200 }).notNull(),
    projectNameEn: varchar("project_name_en", { length: 200 }).notNull(),
    descriptionAr: text("description_ar"),
    descriptionEn: text("description_en"),
    locationAr: varchar("location_ar", { length: 200 }).notNull(),
    locationEn: varchar("location_en", { length: 200 }).notNull(),
    scopeOfWorkAr: varchar("scope_of_work_ar", { length: 255 }).notNull(),
    scopeOfWorkEn: varchar("scope_of_work_en", { length: 255 }).notNull(),
    /** Internal grouping for dashboard search and filters; not shown on the public site. */
    sectorAr: varchar("sector_ar", { length: 120 }).notNull().default(""),
    sectorEn: varchar("sector_en", { length: 120 }).notNull().default(""),
    image: varchar("image", { length: 255 }),
    imageAltAr: varchar("image_alt_ar", { length: 255 }).notNull().default(""),
    imageAltEn: varchar("image_alt_en", { length: 255 }).notNull().default(""),
    isActive: boolean("is_active").notNull().default(true),
    showOnHomepage: boolean("show_on_homepage").notNull().default(false),
    sortOrder: int("sort_order").notNull().default(0),
    homepageSortOrder: int("homepage_sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (t) => [index("projects_client_idx").on(t.clientId), index("projects_sort_idx").on(t.sortOrder)]
);

/** Downloadable documents. Only one active "company-profile" at a time (enforced by the dashboard). */
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  kind: varchar("kind", { length: 40 }).notNull().default("company-profile"),
  titleAr: varchar("title_ar", { length: 200 }).notNull(),
  titleEn: varchar("title_en", { length: 200 }).notNull(),
  fileUrl: varchar("file_url", { length: 255 }).notNull(),
  originalFileName: varchar("original_file_name", { length: 255 }).notNull(),
  fileSize: int("file_size").notNull(),
  isActive: boolean("is_active").notNull().default(false),
  showDownloadButton: boolean("show_download_button").notNull().default(true),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

/** Order and visibility of the configurable homepage sections (the hero is always first). */
export const homepageSections = mysqlTable("homepage_sections", {
  sectionKey: varchar("section_key", { length: 40 }).primaryKey(),
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: int("sort_order").notNull().default(0),
});

/** The three logo tables have identical columns; treat them as one shape in shared code. */
export type LogoTable = typeof brands;
export const asLogoTable = (t: typeof brands | typeof clients | typeof partners) => t as LogoTable;

export type Brand = typeof brands.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Partner = typeof partners.$inferSelect;
/** Brand, client and partner rows share one shape. */
export type LogoEntity = Brand;
export type NewLogoEntity = typeof brands.$inferInsert;
export type ProjectRow = typeof projects.$inferSelect;
export type NewProjectRow = typeof projects.$inferInsert;
export type DocumentRow = typeof documents.$inferSelect;
export type NewDocumentRow = typeof documents.$inferInsert;
export type HomepageSectionRow = typeof homepageSections.$inferSelect;
