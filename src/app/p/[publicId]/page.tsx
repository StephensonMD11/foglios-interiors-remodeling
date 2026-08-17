import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProposalActions } from "@/components/ProposalActions";
import {
  formatCurrency,
  getProposalByPublicId,
  proposalTotal,
} from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ publicId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { publicId } = await params;
  const proposal = await getProposalByPublicId(publicId);
  return {
    title: proposal ? `Proposal — ${proposal.projectTitle}` : "Proposal",
    robots: { index: false, follow: false },
  };
}

export default async function ProposalPublicPage({ params }: Props) {
  const { publicId } = await params;
  const proposal = await getProposalByPublicId(publicId);
  if (!proposal) notFound();

  const total = proposalTotal(proposal);
  const date = new Date(proposal.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[color:var(--cream)] text-[color:var(--ink)]">
      <div className="no-print border-b border-[color:var(--line)] bg-white px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <Link href="/" className="text-sm text-[color:var(--slate)]">
            ← {siteConfig.shortName}
          </Link>
          <ProposalActions expiresAt={proposal.shareExpiresAt} />
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <header className="border-b border-[color:var(--line)] pb-8">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--oak)]">
            Proposal
          </p>
          <h1 className="font-display mt-2 text-4xl tracking-tight md:text-5xl">
            {siteConfig.name}
          </h1>
          <p className="mt-2 text-[color:var(--slate)]">{date}</p>
        </header>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--slate)]">
              Prepared for
            </p>
            <p className="mt-2 text-lg font-semibold">{proposal.clientName}</p>
          </div>
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--slate)]">
              Project
            </p>
            <p className="mt-2 text-lg font-semibold">{proposal.projectTitle}</p>
          </div>
        </div>

        <p className="no-print mt-6 border border-[color:var(--line)] bg-[color:var(--paper)] px-4 py-3 text-sm text-[color:var(--slate)]">
          This shared link auto-expires after 7 days for privacy. After it
          expires, this page will no longer open. Print or save a PDF if you
          want a lasting copy.
        </p>

        <div className="mt-10 overflow-hidden border border-[color:var(--line)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[color:var(--paper)] text-[0.7rem] uppercase tracking-[0.12em] text-[color:var(--slate)]">
              <tr>
                <th className="px-4 py-3 font-semibold">Item</th>
                <th className="px-4 py-3 font-semibold">Qty</th>
                <th className="px-4 py-3 font-semibold">Unit</th>
                <th className="px-4 py-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {proposal.lineItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-[color:var(--line)]"
                >
                  <td className="px-4 py-3">
                    {item.category ? (
                      <span className="mb-1 block text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--oak)]">
                        {item.category}
                      </span>
                    ) : null}
                    {item.description}
                  </td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[color:var(--ink)] bg-[color:var(--paper)]">
                <td
                  colSpan={3}
                  className="px-4 py-4 text-right text-sm font-semibold uppercase tracking-[0.1em]"
                >
                  Total
                </td>
                <td className="px-4 py-4 text-right text-lg font-semibold">
                  {formatCurrency(total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {proposal.notes ? (
          <div className="mt-8">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--slate)]">
              Notes
            </p>
            <p className="mt-3 whitespace-pre-wrap text-[color:var(--ink-soft)]">
              {proposal.notes}
            </p>
          </div>
        ) : null}

        <p className="mt-12 text-sm text-[color:var(--slate)]">
          This proposal is an estimate of scope and pricing. Final pricing may
          vary based on site conditions, material selections, and a signed
          agreement. Thank you for considering {siteConfig.shortName}.
        </p>
      </article>
    </div>
  );
}
