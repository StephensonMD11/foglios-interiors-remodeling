"use server";

import { Resend } from "resend";
import { siteConfig } from "./site";

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  county: string;
  projectType: string;
  message: string;
};

export type ContactResult = { ok: true } | { ok: false; error: string };

export async function sendContactInquiry(
  payload: ContactPayload,
): Promise<ContactResult> {
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

  return { ok: true };
}
