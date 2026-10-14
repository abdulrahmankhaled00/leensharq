import { z } from "zod";

export const partnerFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  descriptionAr: z.string().trim().min(1, "Arabic description is required").max(2000),
  descriptionEn: z.string().trim().min(1, "English description is required").max(2000),
  websiteUrl: z.union([z.literal(""), z.string().trim().url("Must be a valid URL")]).optional(),
  isActive: z.boolean(),
  displayOrder: z.coerce.number().int().min(0).max(9999),
});

export type PartnerFormValues = z.infer<typeof partnerFormSchema>;

export const ALLOWED_LOGO_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
export const MAX_LOGO_BYTES = 2 * 1024 * 1024; // 2MB
