import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/auth";

export const maxDuration = 60;

const ALLOWED_TYPES = [
  "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/avif",
  "video/mp4", "video/mov", "video/quicktime", "video/webm", "video/avi",
  "video/x-msvideo", "video/x-ms-wmv",
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

// Persist a file. In production, Replit Object Storage is required — disk
// fallback is intentionally disabled because Autoscale disks are ephemeral
// and any file written to disk will be lost on the next deploy/restart.
async function uploadFile(
  buffer: Buffer,
  key: string,
): Promise<string> {
  const isProduction = process.env.NODE_ENV === "production";

  // Attempt Replit Object Storage first
  try {
    const { Client } = await import("@replit/object-storage");
    const client = new Client();
    const result = await client.uploadFromBytes(key, buffer) as unknown;
    // Surface upload errors from Replit Object Storage instead of silently falling through.
    if (result && typeof result === "object" && "ok" in result && (result as { ok: boolean }).ok === false) {
      throw new Error(
        `Object storage upload failed: ${(result as { error?: { message?: string } }).error?.message ?? "unknown"}`,
      );
    }
    // Return a proxy URL so the browser can fetch via our serve-upload route
    return `/api/serve-upload?key=${encodeURIComponent(key)}`;
  } catch (err) {
    if (isProduction) {
      // Hard fail — disk is ephemeral on Autoscale, so a silent fallback would
      // lose every uploaded file on the next redeploy.
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(
        `Object storage is required in production but is unavailable: ${message}`,
      );
    }
    // Dev only: fall back to local disk so contributors can run without a bucket
    const parts = key.split("/"); // uploads/category/filename
    const filename  = parts.pop()!;
    const category  = parts.join("/");
    const dir = path.join(process.cwd(), "public", category);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buffer);
    return `/${category}/${filename}`;
  }
}

// POST — admin only
export async function POST(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;

  try {
    const formData = await req.formData();
    const file     = formData.get("file")     as File   | null;
    const category = formData.get("category") as string | null ?? "misc";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `File type '${file.type}' is not allowed` }, { status: 415 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large (max 50 MB)" }, { status: 413 });
    }

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeCategory = category.replace(/[^a-zA-Z0-9_-]/g, "");
    const ext      = path.extname(file.name) || ".bin";
    const base     = path.basename(file.name, ext).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 60);
    const filename = `${Date.now()}_${base}${ext}`;
    const key      = `uploads/${safeCategory}/${filename}`;

    const url = await uploadFile(buffer, key);

    return NextResponse.json({
      url,
      filename,
      type: file.type.startsWith("video") ? "video" : "image",
      size: file.size,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("[api/upload]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
