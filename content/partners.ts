/**
 * Partners shown in the Home page "Partners" section.
 *
 * These are PLACEHOLDERS — no real partner is implied. To go live, for each entry:
 *   1. drop the logo file into `public/images/partners/` (PNG/SVG/WebP, ideally on a transparent background),
 *   2. set `logo` to its public path (e.g. "/images/partners/acme.svg"),
 *   3. replace `name.ar` / `name.en` with the real name, and optionally set `url`.
 * Add or remove entries freely — the grid adapts. Entries without `logo` render a labelled placeholder.
 */
export interface PartnerEntry {
  id: string;
  name: { ar: string; en: string };
  /** Public path of the logo, e.g. "/images/partners/acme.svg". Omit while it is still a placeholder. */
  logo?: string;
  /** Optional website; when set the card links out. */
  url?: string;
}

export const homePartners: PartnerEntry[] = [
  { id: "partner-01", name: { ar: "شريك 01", en: "Partner 01" } },
  { id: "partner-02", name: { ar: "شريك 02", en: "Partner 02" } },
  { id: "partner-03", name: { ar: "شريك 03", en: "Partner 03" } },
  { id: "partner-04", name: { ar: "شريك 04", en: "Partner 04" } },
  { id: "partner-05", name: { ar: "شريك 05", en: "Partner 05" } },
  { id: "partner-06", name: { ar: "شريك 06", en: "Partner 06" } },
];
