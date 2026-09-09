import { NextResponse } from "next/server";
import { Resend } from "resend";

/** Receive match only — apex MX is Outlook, not Resend. */
const BLAIR_INBOUND = "blair@fogliosinteriors.com";
/** Human inbox. Drew may instead forward M365 → this Hotmail. */
const DEFAULT_FORWARD_TO = "Leonard3587@hotmail.com";
const DEFAULT_FORWARD_FROM = "Foglio's <noreply@fogliosinteriors.com>";

function stringAddresses(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

/** Exact local+domain match, case-insensitive. Accepts `Name <addr>` or bare addr. */
function normalizeAddress(raw: string): string {
  const trimmed = raw.trim().toLowerCase();
  const angled = /<([^>]+)>/.exec(trimmed);
  return (angled?.[1] ?? trimmed).trim();
}

function isBlairInbound(to: unknown, receivedFor: unknown): boolean {
  return [...stringAddresses(to), ...stringAddresses(receivedFor)]
    .map(normalizeAddress)
    .includes(BLAIR_INBOUND);
}

export async function POST(request: Request) {
  const payload = await request.text();
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

  // Required in every environment so unsigned POSTs are never processed.
  if (!webhookSecret) {
    console.error("[resend-inbound] RESEND_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret is not configured" },
      { status: 500 },
    );
  }

  // verify() is local HMAC and does not call Resend, but the constructor
  // still requires a non-empty key string.
  const apiKey = process.env.RESEND_API_KEY;
  const resend = new Resend(apiKey || "re_unconfigured");

  let event;
  try {
    event = resend.webhooks.verify({
      payload,
      headers: {
        id: request.headers.get("svix-id") ?? "",
        timestamp: request.headers.get("svix-timestamp") ?? "",
        signature: request.headers.get("svix-signature") ?? "",
      },
      webhookSecret,
    });
  } catch (error) {
    console.error("[resend-inbound] Invalid webhook signature", error);
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }

  if (event.type !== "email.received") {
    return NextResponse.json({});
  }

  if (!isBlairInbound(event.data.to, event.data.received_for)) {
    return NextResponse.json({});
  }

  const from =
    process.env.INBOUND_FORWARD_FROM?.trim() ||
    process.env.CONTACT_FROM_EMAIL?.trim() ||
    DEFAULT_FORWARD_FROM;

  if (!apiKey) {
    console.error("[resend-inbound] RESEND_API_KEY is not set");
    return NextResponse.json(
      { error: "Resend API key is not configured" },
      { status: 500 },
    );
  }

  const to =
    process.env.INBOUND_BLAIR_FORWARD_TO?.trim() || DEFAULT_FORWARD_TO;

  try {
    const { data, error } = await resend.emails.receiving.forward({
      emailId: event.data.email_id,
      to,
      from,
    });

    if (error) {
      console.error("[resend-inbound] Forward failed", error);
      return NextResponse.json(
        { error: "Failed to forward email" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (error) {
    console.error("[resend-inbound] Forward error", error);
    return NextResponse.json(
      { error: "Failed to forward email" },
      { status: 500 },
    );
  }
}
