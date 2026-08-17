/** Client-safe formatting helpers (no server-only imports). */

import type { Proposal } from "./types";

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function proposalTotal(proposal: Proposal) {
  return proposal.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
}

