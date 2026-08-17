import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ProposalDocument } from "@/components/ProposalDocument";
import { PrintButton } from "@/components/PrintButton";
import { isAuthenticated } from "@/lib/auth";
import { getProposalById } from "@/lib/content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const proposal = await getProposalById(id);
  return {
    title: proposal
      ? `Preview — ${proposal.projectTitle}`
      : "Proposal preview",
    robots: { index: false, follow: false },
  };
}

export default async function AdminProposalPreviewPage({ params }: Props) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const proposal = await getProposalById(id);
  if (!proposal) notFound();

  return (
    <div className="min-h-screen bg-[color:var(--cream)] text-[color:var(--ink)]">
      <div className="no-print border-b border-[color:var(--line)] bg-white px-4 py-3">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/admin" className="text-sm text-[color:var(--slate)]">
            ← Back to admin
          </Link>
          <div className="flex flex-col items-start gap-1 sm:items-end">
            <PrintButton />
            <p className="text-xs text-[color:var(--slate)]">
              Private preview — no public link created. Use Copy link / Share
              from admin when you&apos;re ready to send it.
            </p>
          </div>
        </div>
      </div>

      <ProposalDocument proposal={proposal} />
    </div>
  );
}
