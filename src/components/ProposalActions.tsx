"use client";

import { useState } from "react";

export function ProposalActions() {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
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

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" className="btn btn-ghost !py-2" onClick={copyLink}>
        {copied ? "Link copied" : "Copy link"}
      </button>
      <button type="button" className="btn btn-ghost !py-2" onClick={share}>
        Share
      </button>
      <button
        type="button"
        className="btn btn-dark !py-2"
        onClick={() => window.print()}
      >
        Print / save PDF
      </button>
    </div>
  );
}
