import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProposalActions } from "@/components/ProposalActions";
import { ProposalDocument } from "@/components/ProposalDocument";
import { getProposalByPublicId } from "@/lib/content";
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

  return (
    <div className="min-h-screen bg-[color:var(--cream)] text-[color:var(--ink)]">
      <div className="no-print border-b border-[color:var(--line)] bg-white px-4 py-3">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <Link href="/" className="text-sm text-[color:var(--slate)]">
            ← {siteConfig.shortName}
          </Link>
          <ProposalActions expiresAt={proposal.shareExpiresAt} />
        </div>
      </div>

      <ProposalDocument proposal={proposal} showExpiryNotice />
    </div>
  );
}
