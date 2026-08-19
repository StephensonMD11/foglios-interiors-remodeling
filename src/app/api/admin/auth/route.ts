import { NextResponse } from "next/server";
import { createSession, destroySession, verifyPassword } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 12;

function clientKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: Request) {
  const key = `admin-login:${clientKey(request)}`;
  if (!checkRateLimit(key, { max: MAX_ATTEMPTS, windowMs: WINDOW_MS })) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 },
    );
  }

  const body = (await request.json()) as { password?: string };
  if (!verifyPassword(body.password || "")) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  await createSession();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ ok: true });
}
