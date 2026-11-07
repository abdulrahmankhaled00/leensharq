import type { NewDocumentRow, NewLogoEntity, NewProjectRow } from "@/lib/db/schema";

/**
 * Starting content for the dashboard-managed collections.
 *
 * - `npm run db:seed` inserts these rows (with these IDs) into empty tables.
 * - While DATABASE_URL is not set, the public site reads these same rows instead of the database,
 *   so the site renders identically before and after the database is connected.
 *
 * IDs are stable so projects can reference clients by `clientId` before any database exists.
 * Once the database is live, edit content in the dashboard, not here.
 */

type Seed<T> = T & { id: number };

const photo = (name: string) => `/images/photos/${name}.jpg`;

// ───────── Brands (companies whose products Leen Al Sharq supplies) ─────────
const BRAND_NAMES = [
  "Fluke",
  "Corning Optical Communications",
  "Yuasa",
  "CSB Battery",
  "Cisco",
  "Linksys",
  "Schneider Electric — APC",
  "VCOM",
  "Brother",
  "CommScope",
  "KungLong",
  "Ruijie Networks",
  "B3 International",
];

export const seedBrands: Seed<NewLogoEntity>[] = BRAND_NAMES.map((name, i) => ({
  id: i + 1,
  nameAr: name,
  nameEn: name,
  logo: null,
  altTextAr: `شعار ${name}`,
  altTextEn: `${name} logo`,
  websiteUrl: null,
  isActive: true,
  showOnHomepage: true,
  sortOrder: i,
  homepageSortOrder: i,
}));

// ───────── Clients (organisations Leen Al Sharq has delivered work for) ─────────
const CLIENTS: [ar: string, en: string][] = [
  ["مدينة الأمير سلطان الطبية العسكرية", "Prince Sultan Military Medical City"],
  ["الشؤون الصحية بوزارة الحرس الوطني", "National Guard Health Affairs"],
  ["مستشفى الملك فيصل التخصصي", "King Faisal Specialist Hospital"],
  ["وزارة الدفاع", "Ministry of Defense"],
  ["مركز الملك عبدالله المالي", "King Abdullah Financial District"],
  ["جامعة الأمير سلطان", "Prince Sultan University"],
  ["جامعة الملك سعود", "King Saud University"],
  ["فندق كمبينسكي المدينة المنورة", "Kempinski Hotel Madinah"],
];

export const seedClients: Seed<NewLogoEntity>[] = CLIENTS.map(([ar, en], i) => ({
  id: i + 1,
  nameAr: ar,
  nameEn: en,
  logo: null,
  altTextAr: `شعار ${ar}`,
  altTextEn: `${en} logo`,
  websiteUrl: null,
  isActive: true,
  showOnHomepage: true,
  sortOrder: i,
  homepageSortOrder: i,
}));

// ───────── Partners (organisations that collaborate on delivery) ─────────
// None yet. The table and dashboard section exist so partners never get mixed into clients.
export const seedPartners: Seed<NewLogoEntity>[] = [];

// ───────── Projects (each delivered for one client) ─────────
const KSA = { locationAr: "الرياض، المملكة العربية السعودية", locationEn: "Riyadh, Saudi Arabia" };
const SUPPLY_INSTALL = { scopeOfWorkAr: "توريد وتركيب", scopeOfWorkEn: "Supply & Installation" };
const SECTOR = {
  healthcare: { sectorAr: "القطاع الصحي", sectorEn: "Healthcare" },
  government: { sectorAr: "القطاع الحكومي والدفاع", sectorEn: "Government & Defense" },
  education: { sectorAr: "التعليم العالي", sectorEn: "Higher Education" },
  hospitality: { sectorAr: "الضيافة", sectorEn: "Hospitality" },
};

const PROJECTS: Omit<Seed<NewProjectRow>, "sortOrder" | "homepageSortOrder" | "isActive">[] = [
  {
    id: 1,
    clientId: 1,
    projectNameAr: "صيانة وترقية وتشغيل الشبكات والخوادم",
    projectNameEn: "Network & Server Maintenance",
    ...KSA,
    scopeOfWorkAr: "صيانة وترقية وتشغيل",
    scopeOfWorkEn: "Maintenance, upgrade and operation",
    ...SECTOR.healthcare,
    image: photo("data-center-aerial"),
    imageAltAr: "منظر علوي لقاعة خوادم في مركز بيانات",
    imageAltEn: "Aerial view of a data center server hall",
    showOnHomepage: true,
  },
  {
    id: 2,
    clientId: 2,
    projectNameAr: "توريد وتركيب أنظمة المراقبة بالفيديو",
    projectNameEn: "CCTV Systems — Supply & Installation",
    ...KSA,
    ...SUPPLY_INSTALL,
    ...SECTOR.healthcare,
    image: photo("cctv-cameras"),
    imageAltAr: "كاميرات مراقبة أمنية",
    imageAltEn: "CCTV security cameras",
    showOnHomepage: true,
  },
  {
    id: 3,
    clientId: 3,
    projectNameAr: "أنظمة الشبكات النشطة والتحكم بالدخول",
    projectNameEn: "Active Network & Access Control Systems",
    ...KSA,
    ...SUPPLY_INSTALL,
    ...SECTOR.healthcare,
    image: photo("hospital-mri"),
    imageAltAr: "غرفة تصوير بالرنين المغناطيسي في مستشفى",
    imageAltEn: "An MRI suite in a hospital",
    showOnHomepage: false,
  },
  {
    id: 4,
    clientId: 4,
    projectNameAr: "مستشفى القوات المسلحة بالخرج",
    projectNameEn: "Armed Forces Hospital, Al Kharj",
    locationAr: "الخرج، الرياض، المملكة العربية السعودية",
    locationEn: "Al Kharj, Riyadh, Saudi Arabia",
    ...SUPPLY_INSTALL,
    ...SECTOR.government,
    image: photo("switchgear-room"),
    imageAltAr: "غرفة لوحات توزيع كهربائية",
    imageAltEn: "An electrical switchgear room",
    showOnHomepage: false,
  },
  {
    id: 5,
    clientId: 5,
    projectNameAr: "نظام البيانات والتحكم بالدخول",
    projectNameEn: "Data System & Access Control, KAFD",
    ...KSA,
    ...SUPPLY_INSTALL,
    ...SECTOR.government,
    image: photo("riyadh-kafd"),
    imageAltAr: "أبراج مركز الملك عبدالله المالي في الرياض",
    imageAltEn: "The towers of the King Abdullah Financial District in Riyadh",
    showOnHomepage: false,
  },
  {
    id: 6,
    clientId: 6,
    projectNameAr: "نظام الشبكة النشطة والعناصر السلبية",
    projectNameEn: "Active Network System & Passive Items (PSU)",
    ...KSA,
    scopeOfWorkAr: "توريد وتركيب واختبار وتشغيل",
    scopeOfWorkEn: "Supply, installation, testing and commissioning",
    ...SECTOR.education,
    image: photo("network-cables"),
    imageAltAr: "محوّل شبكة موصول بكابلات إيثرنت",
    imageAltEn: "A network switch patched with Ethernet cables",
    showOnHomepage: false,
  },
  {
    id: 7,
    clientId: 7,
    projectNameAr: "نظام التحكم بالدخول",
    projectNameEn: "Access Control System",
    ...KSA,
    ...SUPPLY_INSTALL,
    ...SECTOR.education,
    image: photo("ksu-gate"),
    imageAltAr: "بوابة مدخل جامعة الملك سعود في الرياض",
    imageAltEn: "The entrance gate of King Saud University in Riyadh",
    showOnHomepage: false,
  },
  {
    id: 8,
    clientId: 8,
    projectNameAr: "البنية التحتية الفندقية",
    projectNameEn: "Hotel Infrastructure — Supply & Installation",
    locationAr: "المدينة المنورة، المملكة العربية السعودية",
    locationEn: "Madinah, Saudi Arabia",
    ...SUPPLY_INSTALL,
    ...SECTOR.hospitality,
    image: photo("sector-hospitality"),
    imageAltAr: "غرفة فندقية فاخرة",
    imageAltEn: "A luxury hotel room",
    showOnHomepage: false,
  },
];

let homepageRank = 0;
export const seedProjects: Seed<NewProjectRow>[] = PROJECTS.map((p, i) => ({
  ...p,
  isActive: true,
  sortOrder: i,
  homepageSortOrder: p.showOnHomepage ? homepageRank++ : 0,
}));

// ───────── Company profile PDF ─────────
/** The PDF shipped with the site; used until one is uploaded in the dashboard. */
export const seedCompanyProfile: Seed<NewDocumentRow> = {
  id: 1,
  kind: "company-profile",
  titleAr: "تنزيل الملف التعريفي",
  titleEn: "Download profile",
  fileUrl: "/leen-profile.pdf",
  originalFileName: "leen-profile.pdf",
  fileSize: 21002220,
  isActive: true,
  showDownloadButton: true,
};

// ───────── Homepage section order ─────────
export const HOMEPAGE_SECTION_KEYS = ["services", "brands", "projects", "sectors", "about", "clients"] as const;
export type HomepageSectionKey = (typeof HOMEPAGE_SECTION_KEYS)[number];

export const seedHomepageSections = HOMEPAGE_SECTION_KEYS.map((sectionKey, i) => ({ sectionKey, isVisible: true, sortOrder: i }));
