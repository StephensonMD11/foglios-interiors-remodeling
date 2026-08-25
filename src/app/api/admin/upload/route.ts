import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { newId } from "@/lib/content";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 12 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
]);

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "photo.jpg";
}

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

/**
 * Server-side image upload to Vercel Blob.
 * Browser compresses photos first; this route always returns JSON so the
 * admin UI never hits "Unexpected end of JSON input".
 */
export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return jsonError("Unauthorized", 401);
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return jsonError("BLOB_READ_WRITE_TOKEN is not configured", 500);
    }

    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return jsonError(
        "Could not read the upload. Try a smaller JPG under 12MB.",
        413,
      );
    }

    const file = form.get("file");
    if (!(file instanceof File)) {
      return jsonError("No file uploaded", 400);
    }

    if (file.size <= 0 || file.size > MAX_BYTES) {
      return jsonError("Image must be under 12MB", 400);
    }

    const type = (file.type || "").toLowerCase();
    if (type && !ALLOWED_TYPES.has(type)) {
      return jsonError("Only image uploads are allowed (JPG, PNG, WebP, GIF, HEIC)", 400);
    }

    const blob = await put(
      `projects/${newId("img")}-${safeFileName(file.name)}`,
      file,
      {
        access: "public",
        addRandomSuffix: true,
        contentType: type || "application/octet-stream",
      },
    );

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("[upload]", err);
    return jsonError(
      err instanceof Error ? err.message : "Upload failed",
      500,
    );
  }
}
