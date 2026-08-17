"use client";

import { useState } from "react";
import {
  formatShareExpiry,
  PROPOSAL_SHARE_DAYS,
} from "@/lib/proposal-share";

export function ProposalActions({
  expiresAt,
}: {
  expiresAt?: string | null;
}) {
  const [copied, setCopied] = useState(false);
  const [shareNote, setShareNote] = useState("");

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", window.location.href);
    }
  }

  async function share() {
    setShareNote("");
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: document.title,
          text: "Proposal from Foglio's Interiors & Remodeling",
          url: window.location.href,
        });
        setShareNote("Shared.");
        window.setTimeout(() => setShareNote(""), 2000);
        return;
      } catch {
        // Cancelled — don't force-copy
        return;
      }
    }
    // Desktop browsers often lack the system share sheet — copy instead.
    await copyLink();
    setShareNote("Link copied — paste into a text or email.");
    window.setTimeout(() => setShareNote(""), 3000);
  }

  function emailLink() {
    const url = window.location.href;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      document.title,
    )}&body=${encodeURIComponent(
      `Here's your proposal from Foglio's Interiors & Remodeling:\n\n${url}\n`,
    )}`;
  }

  return (
    <div className="flex w-full flex-col gap-2 sm:items-end">
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <button
          type="button"
          className="btn btn-primary !py-2"
          onClick={share}
        >
          Share
        </button>
        <button type="button" className="btn btn-ghost !py-2" onClick={copyLink}>
          {copied ? "Link copied" : "Copy link"}
        </button>
        <button type="button" className="btn btn-ghost !py-2" onClick={emailLink}>
          Email link
        </button>
        <button
          type="button"
          className="btn btn-dark !py-2"
          onClick={() => window.print()}
        >
          Print / save PDF
        </button>
      </div>
      {shareNote ? (
        <p className="text-xs text-[color:var(--oak)]">{shareNote}</p>
      ) : null}
      <p className="max-w-md text-xs text-[color:var(--slate)] sm:text-right">
        {expiresAt
          ? `This share link auto-expires on ${formatShareExpiry(expiresAt)} (${PROPOSAL_SHARE_DAYS} days from when it was created). After that it won’t open.`
          : `Share links auto-expire after ${PROPOSAL_SHARE_DAYS} days.`}
      </p>
    </div>
  );
}
