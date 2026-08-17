import { NextResponse } from "next/server";
import { createSession, destroySession, verifyPassword } from "@/lib/auth";

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 12;

function clientKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function allowAttempt(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (current.count >= MAX_ATTEMPTS) return false;
  current.count += 1;
  return true;
}

export async function POST(request: Request) {
  const key = clientKey(request);
  if (!allowAttempt(key)) {
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
