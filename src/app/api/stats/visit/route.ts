import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { recordVisit } from "@/lib/stats";

function clientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/** Fire-and-forget visit ping from public pages (once per browser session). */
export async function POST(request: Request) {
  const ip = clientIp(request);
  if (
    !checkRateLimit(`visit:${ip}`, { max: 30, windowMs: 60 * 60 * 1000 })
  ) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    await recordVisit(ip);
  } catch {
    // Stats should never break the site
  }

  return new NextResponse(null, { status: 204 });
}
