/** Upload limits, shared by the browser-side checks and the server-side validation. */
export const MB = 1024 * 1024;
/** Logos (brands, clients, partners) and project photos. */
export const MAX_IMAGE_MB = 2;
export const MAX_IMAGE_BYTES = MAX_IMAGE_MB * MB;
/** Company-profile PDF (the current one is about 21 MB). */
export const MAX_PDF_MB = 32;
export const MAX_PDF_BYTES = MAX_PDF_MB * MB;

export const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp,image/svg+xml,.png,.jpg,.jpeg,.webp,.svg";
export const PDF_ACCEPT = "application/pdf,.pdf";
