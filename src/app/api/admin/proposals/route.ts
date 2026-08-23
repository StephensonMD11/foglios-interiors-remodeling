import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { newId, readStore, writeStore } from "@/lib/content";
import {
  newProposalPublicId,
  shareExpiryIso,
} from "@/lib/proposal-share";
import type { Proposal, ProposalLineItem } from "@/lib/types";

function normalizeItems(items: ProposalLineItem[] | undefined): ProposalLineItem[] {
  return (items || []).map((item) => ({
    id: item.id || newId("line"),
    category: item.category?.trim() || "Other",
    description: item.description?.trim() || "",
    quantity: Number(item.quantity) || 0,
    unitPrice: Number(item.unitPrice) || 0,
  }));
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const store = await readStore();
  return NextResponse.json({ proposals: store.proposals });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<Proposal>;
  const now = new Date().toISOString();
  const proposal: Proposal = {
    id: newId("prop"),
    // No public link until Copy / Share / Email opens a 7-day share.
    publicId: null,
    shareExpiresAt: null,
    clientName: body.clientName?.trim() || "Client",
    clientAddress: body.clientAddress?.trim() || "",
    clientPhone: body.clientPhone?.trim() || "",
    projectTitle: body.projectTitle?.trim() || "Project proposal",
    notes: body.notes?.trim() || "",
    adminNotes: "",
    lineItems: normalizeItems(body.lineItems),
    status: body.status === "sent" ? "sent" : "draft",
    createdAt: now,
    updatedAt: now,
  };

  const store = await readStore();
  store.proposals.unshift(proposal);
  await writeStore(store);
  return NextResponse.json({ proposal });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<Proposal> & {
    id: string;
    refreshShare?: boolean;
    adminNotesOnly?: boolean;
  };
  const store = await readStore();
  const idx = store.proposals.findIndex((p) => p.id === body.id);
  if (idx < 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const current = store.proposals[idx];
  const now = new Date().toISOString();

  if (body.refreshShare) {
    store.proposals[idx] = {
      ...current,
      publicId: newProposalPublicId(),
      shareExpiresAt: shareExpiryIso(),
      status: "sent",
      updatedAt: now,
    };
    await writeStore(store);
    return NextResponse.json({ proposal: store.proposals[idx] });
  }

  if (body.adminNotesOnly) {
    store.proposals[idx] = {
      ...current,
      adminNotes: body.adminNotes?.trim() ?? "",
      updatedAt: now,
    };
    await writeStore(store);
    return NextResponse.json({ proposal: store.proposals[idx] });
  }

  store.proposals[idx] = {
    ...current,
    clientName: body.clientName?.trim() || current.clientName,
    clientAddress:
      body.clientAddress === undefined
        ? current.clientAddress
        : body.clientAddress.trim(),
    clientPhone:
      body.clientPhone === undefined
        ? current.clientPhone
        : body.clientPhone.trim(),
    projectTitle: body.projectTitle?.trim() || current.projectTitle,
    notes: body.notes === undefined ? current.notes : body.notes.trim(),
    lineItems:
      body.lineItems === undefined
        ? current.lineItems
        : normalizeItems(body.lineItems),
    status:
      body.status === "sent"
        ? "sent"
        : body.status === "draft"
          ? "draft"
          : current.status,
    updatedAt: now,
  };

  await writeStore(store);
  return NextResponse.json({ proposal: store.proposals[idx] });
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const store = await readStore();
  store.proposals = store.proposals.filter((p) => p.id !== id);
  await writeStore(store);
  return NextResponse.json({ ok: true });
}
