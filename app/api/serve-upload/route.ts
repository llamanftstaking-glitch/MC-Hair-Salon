import { NextRequest, NextResponse } from "next/server";

// GET — proxy file from Replit Object Storage
export async function GET(req: NextRequest) {
  const key = new URL(req.url).searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  // Sanitize key: must start with "uploads/"
  if (!key.startsWith("uploads/")) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  try {
    const { Client } = await import("@replit/object-storage");
    const client = new Client();
    const result = await client.downloadAsBytes(key);
    if (!result.ok) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    const bytes = result.value;

    // Guess content type from extension
    const ext = key.split(".").pop()?.toLowerCase() ?? "";
    const contentType = {
      jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
      webp: "image/webp", gif: "image/gif", avif: "image/avif",
      mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime",
    }[ext] ?? "application/octet-stream";

    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to serve file";
    console.error("[api/serve-upload]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
