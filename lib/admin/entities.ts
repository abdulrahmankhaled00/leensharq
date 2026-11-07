import { asLogoTable, brands, clients, partners, type LogoTable } from "@/lib/db/schema";
import type { MediaFolder } from "@/lib/media";

/**
 * Brands, Clients and Partners share one shape but stay separate tables and separate dashboard sections.
 * Their interface text (labels, descriptions…) lives in lib/admin/i18n.ts under `kinds`.
 */
export const LOGO_KINDS = ["brands", "clients", "partners"] as const;
export type LogoKind = (typeof LOGO_KINDS)[number];

export const LOGO_ENTITY: Record<LogoKind, { table: LogoTable; folder: MediaFolder }> = {
  brands: { table: brands, folder: "brands" },
  clients: { table: asLogoTable(clients), folder: "clients" },
  partners: { table: asLogoTable(partners), folder: "partners" },
};

export function isLogoKind(value: string): value is LogoKind {
  return (LOGO_KINDS as readonly string[]).includes(value);
}
