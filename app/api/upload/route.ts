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
    const dir = path.join(process.cwd(), "public", "uploads", safeCategory);
    await mkdir(dir, { recursive: true });

    const ext      = path.extname(file.name) || ".bin";
    const base     = path.basename(file.name, ext).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 60);
    const filename = `${Date.now()}_${base}${ext}`;

    await writeFile(path.join(dir, filename), buffer);

    return NextResponse.json({
      url:      `/uploads/${safeCategory}/${filename}`,
      filename,
      type:     file.type.startsWith("video") ? "video" : "image",
      size:     file.size,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("[api/upload]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
