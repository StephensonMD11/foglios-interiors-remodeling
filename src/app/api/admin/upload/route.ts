import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { newId } from "@/lib/content";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
]);

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "photo.jpg";
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN is not configured" },
      { status: 500 },
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (file.size <= 0 || file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image must be under 8MB" },
      { status: 400 },
    );
  }

  if (file.type && !ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Only image uploads are allowed" },
      { status: 400 },
    );
  }

  const blob = await put(
    `projects/${newId("img")}-${safeFileName(file.name)}`,
    file,
    {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type || "application/octet-stream",
    },
  );

  return NextResponse.json({ url: blob.url });
}
