import { readFile } from "fs/promises";
import path from "path";
import { STORAGE_ROOT } from "@/lib/media";

const TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

/** Serves dashboard uploads from STORAGE_ROOT. File names are random UUIDs, so they can be cached forever. */
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await params;
  const target = path.resolve(/*turbopackIgnore: true*/ STORAGE_ROOT, ...parts);
  const type = TYPES[path.extname(target).toLowerCase()];
  if (!type || !target.startsWith(STORAGE_ROOT + path.sep)) return new Response("Not found", { status: 404 });

  try {
    const body = await readFile(target);
    return new Response(new Uint8Array(body), {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        // Uploaded SVGs are images, never documents that may run script.
        ...(type === "image/svg+xml" ? { "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox" } : {}),
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
