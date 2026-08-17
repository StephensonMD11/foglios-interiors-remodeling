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
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
        return;
      } catch {
        // User cancelled or share failed — fall through to copy
      }
    }
    await copyLink();
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
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button type="button" className="btn btn-ghost !py-2" onClick={copyLink}>
          {copied ? "Link copied" : "Copy link"}
        </button>
        <button type="button" className="btn btn-ghost !py-2" onClick={share}>
          Share
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
      <p className="max-w-md text-right text-xs text-[color:var(--slate)]">
        {expiresAt
          ? `This share link auto-expires on ${formatShareExpiry(expiresAt)} (${PROPOSAL_SHARE_DAYS} days from when it was created). After that it won’t open.`
          : `Share links auto-expire after ${PROPOSAL_SHARE_DAYS} days.`}
      </p>
    </div>
  );
}
