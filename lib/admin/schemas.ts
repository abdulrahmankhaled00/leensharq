import { z } from "zod";
import { fmt, type AdminDict } from "./i18n";

const flag = z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean());

/** Validation schemas with messages in the dashboard language. */
export function makeSchemas(t: AdminDict) {
  const f = t.fields;
  const lang = (label: string, l: "en" | "ar") => `${label} (${l === "en" ? t.common.langEn : t.common.langAr})`;
  const req = (label: string, max: number) =>
    z
      .string()
      .trim()
      .min(1, fmt(t.errors.required, { field: label }))
      .max(max, fmt(t.errors.tooLong, { max }));
  const opt = (max: number) => z.string().trim().max(max, fmt(t.errors.tooLong, { max }));
  const url = z.union([z.literal(""), z.url({ message: t.errors.url })]);

  return {
    logoEntity: z.object({
      nameEn: req(lang(f.name, "en"), 160),
      nameAr: req(lang(f.name, "ar"), 160),
      altTextEn: opt(255),
      altTextAr: opt(255),
      websiteUrl: url,
      isActive: flag,
      showOnHomepage: flag,
      removeLogo: flag,
    }),
    project: z.object({
      clientId: z.preprocess((v) => (v === "" || v == null ? null : Number(v)), z.number().int().positive().nullable()),
      projectNameEn: req(lang(f.projectName, "en"), 200),
      projectNameAr: req(lang(f.projectName, "ar"), 200),
      descriptionEn: opt(2000),
      descriptionAr: opt(2000),
      locationEn: req(lang(f.location, "en"), 200),
      locationAr: req(lang(f.location, "ar"), 200),
      scopeOfWorkEn: req(lang(f.scope, "en"), 255),
      scopeOfWorkAr: req(lang(f.scope, "ar"), 255),
      sectorEn: opt(120),
      sectorAr: opt(120),
      imageAltEn: opt(255),
      imageAltAr: opt(255),
      isActive: flag,
      showOnHomepage: flag,
      removeImage: flag,
    }),
    documentLabels: z.object({
      titleEn: req(lang(f.buttonLabel, "en"), 200),
      titleAr: req(lang(f.buttonLabel, "ar"), 200),
    }),
  };
}

/** Reads a FormData's text fields into a plain object (checkboxes absent → undefined → false). */
export function formObject(fd: FormData) {
  const out: Record<string, string> = {};
  for (const [k, v] of fd.entries()) if (typeof v === "string") out[k] = v;
  return out;
}

export function fieldErrors(error: z.ZodError) {
  return z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
}
