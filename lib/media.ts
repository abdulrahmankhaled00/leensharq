import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { MAX_IMAGE_BYTES, MAX_PDF_BYTES } from "./upload-limits";

/**
 * Dashboard uploads live outside /public (files added to /public after `next build` are not
 * reliably served) and are served by app/media/[...path]/route.ts at /media/<folder>/<file>.
 * Set UPLOAD_DIR to keep them on a persistent volume in production.
 */
// Runtime-only location: tell the bundler not to trace (and ship) the whole project for it.
export const STORAGE_ROOT = path.resolve(/*turbopackIgnore: true*/ process.env.UPLOAD_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), "storage", "uploads"));
export const MEDIA_PREFIX = "/media/";

export type MediaFolder = "brands" | "clients" | "partners" | "projects" | "documents";

/** Upload problems as codes; the dashboard turns them into localized messages. */
export type UploadErrorCode = "imageType" | "imageTooLarge" | "imageInvalid" | "svgUnsafe" | "pdfRequired" | "pdfInvalid" | "pdfTooLarge";
export class UploadError extends Error {
  constructor(public code: UploadErrorCode) {
    super(code);
  }
}

export function hasFile(value: FormDataEntryValue | null): value is File {
  return typeof value === "object" && value !== null && "size" in value && value.size > 0;
}

type ImageKind = "png" | "jpg" | "webp" | "svg";

/** Identify an image by its bytes, never by the browser-supplied MIME type or file name. */
export function sniffImage(buf: Buffer): ImageKind | null {
  if (buf.length >= 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.length >= 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "webp";
  const head = buf.toString("utf8", 0, Math.min(buf.length, 2048)).replace(/^﻿/, "").trimStart();
  if (/^(<\?xml[^>]*>\s*)?(<!--[\s\S]*?-->\s*)*(<!DOCTYPE svg[^>]*>\s*)?<svg[\s>]/i.test(head)) return "svg";
  return null;
}

/** Width/height from the file header (PNG, JPEG, WebP, SVG), without an image library. */
export function readImageSize(buf: Buffer, kind: ImageKind): { width: number; height: number } | null {
  try {
    if (kind === "png" && buf.length > 24) return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    if (kind === "jpg") {
      let i = 2;
      while (i + 9 < buf.length) {
        if (buf[i] !== 0xff) return null;
        const marker = buf[i + 1];
        const len = buf.readUInt16BE(i + 2);
        // SOF0..SOF15 except DHT(C4), JPG(C8), DAC(CC)
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
        }
        i += 2 + len;
      }
      return null;
    }
    if (kind === "webp") {
      const chunk = buf.toString("ascii", 12, 16);
      if (chunk === "VP8X") return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
      if (chunk === "VP8L") {
        const b = buf.readUInt32LE(21);
        return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
      }
      if (chunk === "VP8 ") return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
      return null;
    }
    if (kind === "svg") {
      const head = buf.toString("utf8", 0, Math.min(buf.length, 4096));
      const vb = head.match(/viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
      if (vb) return { width: Math.round(Number(vb[1])), height: Math.round(Number(vb[2])) };
      const w = head.match(/\swidth\s*=\s*["']([\d.]+)/i);
      const h = head.match(/\sheight\s*=\s*["']([\d.]+)/i);
      if (w && h) return { width: Math.round(Number(w[1])), height: Math.round(Number(h[1])) };
    }
  } catch {
    /* fall through */
  }
  return null;
}

/** SVGs can carry script; refuse anything that could execute when the file is opened directly. */
function assertSafeSvg(buf: Buffer) {
  const text = buf.toString("utf8").toLowerCase();
  if (/<script|\son[a-z]+\s*=|javascript:|<foreignobject|<iframe|<embed|<object|xlink:href\s*=\s*["']\s*data:/.test(text)) {
    throw new UploadError("svgUnsafe");
  }
}

async function store(folder: MediaFolder, ext: string, buf: Buffer): Promise<string> {
  const dir = path.join(/*turbopackIgnore: true*/ STORAGE_ROOT, folder);
  await mkdir(dir, { recursive: true });
  const name = `${randomUUID()}.${ext}`;
  await writeFile(path.join(/*turbopackIgnore: true*/ dir, name), buf);
  return `${MEDIA_PREFIX}${folder}/${name}`;
}

/**
 * Validates and stores a logo or photo (max 2 MB). Nothing is written unless every check passes.
 * The caller removes the returned file if its database write then fails (see removeMedia).
 */
export async function saveImage(file: File, folder: MediaFolder) {
  if (file.size > MAX_IMAGE_BYTES) throw new UploadError("imageTooLarge");
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > MAX_IMAGE_BYTES) throw new UploadError("imageTooLarge");
  const kind = sniffImage(buf);
  if (!kind) throw new UploadError(/\.(png|jpe?g|webp|svg)$/i.test(file.name) ? "imageInvalid" : "imageType");
  if (kind === "svg") assertSafeSvg(buf);
  const size = readImageSize(buf, kind);
  if (kind !== "svg" && !size) throw new UploadError("imageInvalid");
  const url = await store(folder, kind, buf);
  return { url, width: size?.width ?? null, height: size?.height ?? null };
}

/** Validates and stores a company-profile PDF (max 32 MB, real %PDF header). */
export async function savePdf(file: File) {
  if (file.size > MAX_PDF_BYTES) throw new UploadError("pdfTooLarge");
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > MAX_PDF_BYTES) throw new UploadError("pdfTooLarge");
  // A PDF starts with %PDF- within its first 1 KB; a renamed file of any other type does not.
  if (!buf.subarray(0, 1024).includes("%PDF-")) throw new UploadError("pdfInvalid");
  const url = await store("documents", "pdf", buf);
  const name = path.basename(file.name || "company-profile.pdf").slice(0, 255);
  return { url, size: buf.length, originalName: name };
}

/** Deletes a file previously saved by this module. Ignores bundled /public paths and missing files. */
export async function removeMedia(url: string | null | undefined) {
  if (!url || !url.startsWith(MEDIA_PREFIX)) return;
  const target = path.resolve(/*turbopackIgnore: true*/ STORAGE_ROOT, url.slice(MEDIA_PREFIX.length));
  if (!target.startsWith(STORAGE_ROOT + path.sep)) return;
  await unlink(target).catch(() => {});
}
