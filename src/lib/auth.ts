import { createHash, timingSafeEqual } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "foglio_admin_session";

function getSecret() {
  const secret =
    process.env.SESSION_SECRET?.trim() || process.env.ADMIN_PASSWORD?.trim();
  if (!secret) {
    throw new Error("SESSION_SECRET or ADMIN_PASSWORD must be set");
  }
  return new TextEncoder().encode(secret);
}

export async function createSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const jar = await cookies();
    const token = jar.get(COOKIE_NAME)?.value;
    if (!token) return false;
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export function verifyPassword(password: string): boolean {
  // Trim both sides — trailing spaces/newlines from Vercel env paste
  // are a common reason a known password suddenly "doesn't work."
  const expected = process.env.ADMIN_PASSWORD?.trim();
  const attempt = password.trim();
  if (!expected || !attempt) return false;

  const a = createHash("sha256").update(attempt).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}
