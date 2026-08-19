"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { checkRateLimit } from "./rate-limit";
import { recordInquiry } from "./stats";
import { siteConfig } from "./site";

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  county: string;
  projectType: string;
  message: string;
  /** Honeypot — must stay empty. */
  company?: string;
  /** Client timestamp when the form was shown. */
  formStartedAt?: number;
};

export type ContactResult = { ok: true } | { ok: false; error: string };

const MIN_FILL_MS = 3_000;
const MAX_FILL_MS = 24 * 60 * 60 * 1000;
const RATE_MAX = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

async function clientIp() {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

export async function sendContactInquiry(
  payload: ContactPayload,
): Promise<ContactResult> {
  // Bots that fill hidden fields — pretend success so they move on.
  if (payload.company?.trim()) {
    return { ok: true };
  }

  const started = Number(payload.formStartedAt) || 0;
  const elapsed = Date.now() - started;
  if (!started || elapsed < MIN_FILL_MS) {
    return {
      ok: false,
      error: "Please wait a moment and try sending again.",
    };
  }
  if (elapsed > MAX_FILL_MS) {
    return {
      ok: false,
      error: "This form expired. Refresh the page and try again.",
    };
  }

  const ip = await clientIp();
  if (
    !checkRateLimit(`contact:${ip}`, {
      max: RATE_MAX,
      windowMs: RATE_WINDOW_MS,
    })
  ) {
    return {
      ok: false,
      error: "Too many messages from this connection. Please try again later.",
    };
  }

  const name = payload.name?.trim();
  const email = payload.email?.trim();
  const message = payload.message?.trim();

  if (!name || !email || !message) {
    return { ok: false, error: "Please fill in your name, email, and message." };
  }

  if (name.length > 120 || email.length > 200 || message.length > 5000) {
    return { ok: false, error: "Please shorten your message and try again." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const to = process.env.CONTACT_TO_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;

  if (!to || !apiKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("[contact] Email is not configured in production");
      return {
        ok: false,
        error:
          "Estimate form is temporarily unavailable. Please try again later.",
      };
    }
    console.info("[contact] Inquiry received (email not configured)", {
      name,
      county: payload.county,
      projectType: payload.projectType,
    });
    try {
      await recordInquiry();
    } catch {
      // non-blocking
    }
    return { ok: true };
  }

  const resend = new Resend(apiKey);
  const from =
    process.env.CONTACT_FROM_EMAIL || "Foglio's Website <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject: `New inquiry from ${name} — ${siteConfig.shortName}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${payload.phone || "(not provided)"}`,
      `County: ${payload.county || "(not provided)"}`,
      `Project: ${payload.projectType || "(not provided)"}`,
      "",
      message,
    ].join("\n"),
  });

  if (error) {
    console.error("[contact] Resend error", error);
    return {
      ok: false,
      error: "Something went wrong sending your message. Please try again.",
    };
  }

  try {
    await recordInquiry();
  } catch {
    // non-blocking
  }

  return { ok: true };
}
