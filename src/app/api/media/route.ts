import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isVercelBlobUrl } from "@/lib/media";

export const runtime = "nodejs";

/**
 * Public proxy for private Vercel Blob project photos.
 * Only allows vercel-storage.com URLs (SSRF-safe).
 */
export async function GET(request: Request) {
  const src = new URL(request.url).searchParams.get("u");
  if (!src || !isVercelBlobUrl(src)) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return new NextResponse("Media unavailable", { status: 503 });
  }

  try {
    const result = await get(src, { access: "private" });
    if (!result || result.statusCode !== 200 || !result.stream) {
      return new NextResponse("Not found", { status: 404 });
    }

    const headers = new Headers();
    headers.set(
      "Content-Type",
      result.blob.contentType || "application/octet-stream",
    );
    headers.set(
      "Cache-Control",
      "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
    );
    if (result.blob.size != null) {
      headers.set("Content-Length", String(result.blob.size));
    }

    return new NextResponse(result.stream, { status: 200, headers });
  } catch (err) {
    console.error("[media]", err);
    return new NextResponse("Not found", { status: 404 });
  }
}
