import type { Proposal } from "./types";

/** How long a public proposal link stays open after Copy / Share / Email. */
export const PROPOSAL_SHARE_DAYS = 7;

export function newProposalPublicId() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

export function shareExpiryIso(from = new Date()) {
  const d = new Date(from.getTime());
  d.setUTCDate(d.getUTCDate() + PROPOSAL_SHARE_DAYS);
  return d.toISOString();
}

export function isShareActive(
  proposal: Pick<Proposal, "publicId" | "shareExpiresAt">,
) {
  if (!proposal.publicId || !proposal.shareExpiresAt) return false;
  return Date.parse(proposal.shareExpiresAt) > Date.now();
}

export function formatShareExpiry(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
