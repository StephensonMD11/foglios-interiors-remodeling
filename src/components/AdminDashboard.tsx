"use client";

import { useMemo, useRef, useState } from "react";
import type { Project, Proposal, ProposalLineItem, Testimonial } from "@/lib/types";
import { formatCurrency } from "@/lib/content-client";
import { LINE_CATEGORIES } from "@/lib/proposal-categories";
import { AdminTip } from "@/components/AdminTip";
import {
  formatShareExpiry,
  isShareActive,
  PROPOSAL_SHARE_DAYS,
} from "@/lib/proposal-share";
import type { StatsSummary } from "@/lib/stats";
import { formatDayLabel } from "@/lib/stats";

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const TARGET_UPLOAD_BYTES = 3.5 * 1024 * 1024;
const ALLOWED_UPLOAD_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
]);

/** Shrink large phone photos in-browser before the server upload. */
async function prepareImageForUpload(file: File): Promise<File> {
  if (file.size <= TARGET_UPLOAD_BYTES) return file;
  if (!file.type.startsWith("image/") || /heic|heif/i.test(file.type)) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const maxEdge = 2000;
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.82),
    );
    if (!blob || blob.size <= 0) return file;

    const base = file.name.replace(/\.[^.]+$/, "") || "photo";
    return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

async function readJsonSafe(res: Response): Promise<{ error?: string; url?: string }> {
  const text = await res.text();
  if (!text) {
    throw new Error(
      res.status === 413 || res.status >= 500
        ? "Upload failed — try a smaller JPG under 12MB."
        : "Upload failed — empty response from server.",
    );
  }
  try {
    return JSON.parse(text) as { error?: string; url?: string };
  } catch {
    throw new Error("Upload failed — unexpected server response.");
  }
}

type Tab = "projects" | "testimonials" | "proposals";

function newLine(): ProposalLineItem {
  return {
    id: `line_${Math.random().toString(36).slice(2, 9)}`,
    category: "Labor",
    description: "",
    quantity: 1,
    unitPrice: 0,
  };
}

function patchLine(
  items: ProposalLineItem[],
  index: number,
  patch: Partial<ProposalLineItem>,
) {
  const next = [...items];
  next[index] = { ...next[index], ...patch };
  return next;
}

function proposalUrl(publicId: string) {
  if (typeof window === "undefined") return `/p/${publicId}`;
  return `${window.location.origin}/p/${publicId}`;
}

function proposalAmount(proposal: Proposal) {
  return proposal.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
}

function formatAdminNoteWhen(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function AdminDashboard({
  initialProjects,
  initialTestimonials,
  initialProposals,
  initialStats,
}: {
  initialProjects: Project[];
  initialTestimonials: Testimonial[];
  initialProposals: Proposal[];
  initialStats: StatsSummary;
}) {
  const [tab, setTab] = useState<Tab>("projects");
  const [projects, setProjects] = useState(initialProjects);
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [proposals, setProposals] = useState(initialProposals);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [statsDetail, setStatsDetail] = useState<null | "day" | "week">(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [projectForm, setProjectForm] = useState({
    title: "",
    roomType: "Bathroom",
    caption: "",
    images: [] as string[],
    published: true,
    featured: false,
  });

  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    quote: "",
    projectTag: "",
    published: true,
  });

  const [proposalForm, setProposalForm] = useState({
    clientName: "",
    clientAddress: "",
    clientPhone: "",
    projectTitle: "",
    notes: "",
    lineItems: [newLine()],
    status: "draft" as "draft" | "sent",
  });

  const proposalTotal = useMemo(
    () =>
      proposalForm.lineItems.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      ),
    [proposalForm.lineItems],
  );

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  async function uploadImage(file: File) {
    if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES) {
      throw new Error(`“${file.name}” must be under 12MB`);
    }
    if (file.type && !ALLOWED_UPLOAD_TYPES.has(file.type)) {
      throw new Error(`“${file.name}” must be JPG, PNG, WebP, GIF, or HEIC`);
    }

    const prepared = await prepareImageForUpload(file);
    if (prepared.size > MAX_UPLOAD_BYTES) {
      throw new Error(
        `“${file.name}” is still too large after compression. Try a smaller JPG.`,
      );
    }

    const form = new FormData();
    form.append("file", prepared);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await readJsonSafe(res);
    if (!res.ok) throw new Error(data.error || "Upload failed");
    if (!data.url) throw new Error("Upload failed — no image URL returned");
    return data.url;
  }

  async function onProjectImage(files: FileList | File[] | null) {
    if (!files?.length) return;
    setBusy(true);
    setMessage("");
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        urls.push(await uploadImage(file));
      }
      setProjectForm((f) => ({ ...f, images: [...f.images, ...urls] }));
      setMessage(
        urls.length === 1 ? "Photo uploaded." : `${urls.length} photos uploaded.`,
      );
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function addPhotosToProject(project: Project, files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setMessage("");
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        urls.push(await uploadImage(file));
      }
      const images = [...project.images, ...urls];
      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: project.id, images }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save photos");
      setProjects((list) =>
        list.map((p) => (p.id === project.id ? data.project : p)),
      );
      setMessage("Photos added to project.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function saveProject() {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save project");
      setProjects((list) => [data.project, ...list]);
      setProjectForm({
        title: "",
        roomType: "Bathroom",
        caption: "",
        images: [],
        published: true,
        featured: false,
      });
      setMessage("Project saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
    if (res.ok) setProjects((list) => list.filter((p) => p.id !== id));
  }

  async function toggleProject(project: Project, field: "published" | "featured") {
    const res = await fetch("/api/admin/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: project.id, [field]: !project[field] }),
    });
    const data = await res.json();
    if (res.ok) {
      setProjects((list) =>
        list.map((p) => (p.id === project.id ? data.project : p)),
      );
    }
  }

  async function saveTestimonial() {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testimonialForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save testimonial");
      setTestimonials((list) => [data.testimonial, ...list]);
      setTestimonialForm({
        name: "",
        quote: "",
        projectTag: "",
        published: true,
      });
      setMessage("Testimonial saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function deleteTestimonial(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    const res = await fetch(`/api/admin/testimonials?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) setTestimonials((list) => list.filter((t) => t.id !== id));
  }

  async function saveProposal() {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proposalForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save proposal");
      setProposalForm({
        clientName: "",
        clientAddress: "",
        clientPhone: "",
        projectTitle: "",
        notes: "",
        lineItems: [newLine()],
        status: "draft",
      });
      // Open a fresh 7-day share and copy it — proposal stays in admin forever.
      const shared = await refreshProposalShare(data.proposal.id);
      setProposals((list) => [shared, ...list]);
      const url = proposalUrl(shared.publicId!);
      try {
        await navigator.clipboard.writeText(url);
        setMessage(
          `Proposal saved. 7-day link copied — expires ${formatShareExpiry(shared.shareExpiresAt!)}.`,
        );
      } catch {
        setMessage(
          `Proposal saved. Share link (expires ${formatShareExpiry(shared.shareExpiresAt!)}): ${url}`,
        );
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function deleteProposal(id: string) {
    if (!confirm("Delete this proposal?")) return;
    const res = await fetch(`/api/admin/proposals?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) setProposals((list) => list.filter((p) => p.id !== id));
  }

  /** Creates a new public URL and starts a fresh 7-day window (old links die). */
  async function refreshProposalShare(id: string) {
    const res = await fetch("/api/admin/proposals", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, refreshShare: true }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not create share link");
    return data.proposal as Proposal;
  }

  function upsertProposal(proposal: Proposal) {
    setProposals((list) =>
      list.map((p) => (p.id === proposal.id ? proposal : p)),
    );
  }

  async function addAdminNote(id: string) {
    const text = noteDrafts[id]?.trim();
    if (!text) return;

    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/proposals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, addAdminNote: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save note");
      upsertProposal(data.proposal as Proposal);
      setNoteDrafts((drafts) => ({ ...drafts, [id]: "" }));
      setMessage("Note saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not save note");
    } finally {
      setBusy(false);
    }
  }

  async function copyProposalLink(proposal: Proposal) {
    setBusy(true);
    setMessage("");
    try {
      const shared = await refreshProposalShare(proposal.id);
      upsertProposal(shared);
      const url = proposalUrl(shared.publicId!);
      try {
        await navigator.clipboard.writeText(url);
        setMessage(
          `New link copied — works until ${formatShareExpiry(shared.shareExpiresAt!)}. Old links stop working.`,
        );
      } catch {
        window.prompt("Copy this proposal link:", url);
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not copy link");
    } finally {
      setBusy(false);
    }
  }

  async function shareProposal(proposal: Proposal) {
    setBusy(true);
    setMessage("");
    try {
      const shared = await refreshProposalShare(proposal.id);
      upsertProposal(shared);
      const url = proposalUrl(shared.publicId!);
      if (typeof navigator.share === "function") {
        try {
          await navigator.share({
            title: `Proposal — ${shared.projectTitle}`,
            text: `Proposal from Foglio's (link expires ${formatShareExpiry(shared.shareExpiresAt!)}): ${shared.projectTitle}`,
            url,
          });
          setMessage(
            `Shared — link works until ${formatShareExpiry(shared.shareExpiresAt!)}.`,
          );
          return;
        } catch {
          // Cancelled or unavailable — fall through to copy
        }
      }
      try {
        await navigator.clipboard.writeText(url);
        setMessage(
          `New link copied — works until ${formatShareExpiry(shared.shareExpiresAt!)}.`,
        );
      } catch {
        window.prompt("Copy this proposal link:", url);
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not share");
    } finally {
      setBusy(false);
    }
  }

  async function emailProposalLink(proposal: Proposal) {
    setBusy(true);
    setMessage("");
    try {
      const shared = await refreshProposalShare(proposal.id);
      upsertProposal(shared);
      const full = proposalUrl(shared.publicId!);
      setMessage(
        `Link ready until ${formatShareExpiry(shared.shareExpiresAt!)} — opening email…`,
      );
      window.location.href = `mailto:?subject=${encodeURIComponent(
        `Proposal — ${shared.projectTitle}`,
      )}&body=${encodeURIComponent(
        `Here's your proposal from Foglio's Interiors & Remodeling.\nThis link works until ${formatShareExpiry(shared.shareExpiresAt!)}:\n\n${full}\n`,
      )}`;
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not email link");
    } finally {
      setBusy(false);
    }
  }

  async function openProposalPreview(proposal: Proposal) {
    window.open(
      `/admin/proposals/${proposal.id}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div className="admin-shell">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--oak)]">
              Dashboard
            </p>
            <h1 className="font-display text-4xl">Content & proposals</h1>
          </div>
          <button type="button" className="btn btn-ghost" onClick={logout}>
            Sign out
          </button>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="admin-card">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/45">
              Estimate inquiries
            </p>
            <p className="mt-2 font-display text-3xl">{initialStats.inquiryCount}</p>
            <p className="mt-1 text-xs text-white/50">
              {initialStats.inquiriesThisMonth} this month
            </p>
          </div>
          <button
            type="button"
            className={`admin-card w-full text-left transition ${
              statsDetail === "day"
                ? "ring-1 ring-[color:var(--oak)]"
                : "hover:bg-white/5"
            }`}
            onClick={() =>
              setStatsDetail((d) => (d === "day" ? null : "day"))
            }
          >
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/45">
              Unique visitors today
            </p>
            <p className="mt-2 font-display text-3xl">
              {initialStats.uniqueVisitorsToday}
            </p>
            <p className="mt-1 text-xs text-white/50">
              {statsDetail === "day"
                ? "Click to hide day-by-day"
                : "Click for day-by-day"}
            </p>
          </button>
          <button
            type="button"
            className={`admin-card w-full text-left transition ${
              statsDetail === "week"
                ? "ring-1 ring-[color:var(--oak)]"
                : "hover:bg-white/5"
            }`}
            onClick={() =>
              setStatsDetail((d) => (d === "week" ? null : "week"))
            }
          >
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/45">
              Unique visitors this month
            </p>
            <p className="mt-2 font-display text-3xl">
              {initialStats.uniqueVisitorsThisMonth}
            </p>
            <p className="mt-1 text-xs text-white/50">
              {statsDetail === "week"
                ? "Click to hide weekly breakdown"
                : "Click for weekly breakdown"}
            </p>
          </button>
          <div className="admin-card">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/45">
              Saved proposals
            </p>
            <p className="mt-2 font-display text-3xl">{initialProposals.length}</p>
            <p className="mt-1 text-xs text-white/50">In your admin library</p>
          </div>
        </div>
        {!initialStats.trackingEnabled ? (
          <p className="mt-3 text-xs text-white/45">
            Live stats need Blob storage in production — counters start at zero locally.
          </p>
        ) : null}

        {statsDetail === "day" ? (
          <div className="admin-card mt-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/45">
                  Visitors by day
                </p>
                <p className="mt-1 text-xs text-white/40">
                  Last 14 days · unique per day (UTC)
                </p>
              </div>
              <button
                type="button"
                className="text-xs text-white/50 underline hover:text-white"
                onClick={() => setStatsDetail(null)}
              >
                Close
              </button>
            </div>
            <ul className="mt-4 space-y-2">
              {initialStats.visitorsByDay.map((day) => {
                const max = Math.max(
                  1,
                  ...initialStats.visitorsByDay.map((d) => d.count),
                );
                const width = Math.round((day.count / max) * 100);
                return (
                  <li key={day.date} className="flex items-center gap-3 text-sm">
                    <span className="w-28 shrink-0 text-white/55">
                      {formatDayLabel(day.date)}
                    </span>
                    <div className="h-2 min-w-0 flex-1 rounded-full bg-white/10">
                      <div
                        className="h-2 rounded-full bg-[color:var(--oak)]"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <span className="w-8 shrink-0 text-right font-semibold tabular-nums">
                      {day.count}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {statsDetail === "week" ? (
          <div className="admin-card mt-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/45">
                  Visitors by week
                </p>
                <p className="mt-1 text-xs text-white/40">
                  Last 5 weeks · unique across each week
                </p>
              </div>
              <button
                type="button"
                className="text-xs text-white/50 underline hover:text-white"
                onClick={() => setStatsDetail(null)}
              >
                Close
              </button>
            </div>
            <ul className="mt-4 space-y-2">
              {initialStats.visitorsByWeek.map((week) => {
                const max = Math.max(
                  1,
                  ...initialStats.visitorsByWeek.map((w) => w.count),
                );
                const width = Math.round((week.count / max) * 100);
                return (
                  <li
                    key={week.weekStart}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="w-36 shrink-0 text-white/55">
                      {week.label}
                    </span>
                    <div className="h-2 min-w-0 flex-1 rounded-full bg-white/10">
                      <div
                        className="h-2 rounded-full bg-[color:var(--oak)]"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <span className="w-8 shrink-0 text-right font-semibold tabular-nums">
                      {week.count}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-2">
          {(
            [
              ["projects", "Projects"],
              ["testimonials", "Testimonials"],
              ["proposals", "Proposals"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`btn ${tab === id ? "btn-primary" : "btn-ghost"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {message ? (
          <p className="mt-4 rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
            {message}
          </p>
        ) : null}

        {tab === "projects" ? (
          <div className="mt-8 space-y-6">
            <AdminTip>
              <p>
                Projects are the photo galleries on the public site. Upload
                before/after or finished-job photos, write a short caption, and
                turn on <strong>Published</strong> so they show under Projects.
              </p>
              <p>
                Mark one or two as <strong>Featured</strong> to highlight them
                on the homepage. You can add more photos later from a saved
                project card.
              </p>
            </AdminTip>
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div className="admin-card space-y-3">
              <h2 className="font-display text-2xl">Add project</h2>
              <input
                className="admin-input"
                placeholder="Title"
                value={projectForm.title}
                onChange={(e) =>
                  setProjectForm((f) => ({ ...f, title: e.target.value }))
                }
              />
              <input
                className="admin-input"
                placeholder="Room type (Bathroom, Flooring…)"
                value={projectForm.roomType}
                onChange={(e) =>
                  setProjectForm((f) => ({ ...f, roomType: e.target.value }))
                }
              />
              <textarea
                className="admin-input min-h-24"
                placeholder="Short caption"
                value={projectForm.caption}
                onChange={(e) =>
                  setProjectForm((f) => ({ ...f, caption: e.target.value }))
                }
              />

              <div>
                <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/50">
                  Project photos
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(e) => {
                    onProjectImage(e.target.files);
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  className={`admin-dropzone w-full ${dragging ? "is-dragging" : ""}`}
                  disabled={busy}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    onProjectImage(e.dataTransfer.files);
                  }}
                >
                  <span className="text-sm font-semibold">
                    {busy ? "Uploading…" : "Drop photos here or click to upload"}
                  </span>
                  <span className="text-xs text-white/45">
                    JPG, PNG, or HEIC under 12MB — add as many as you want
                  </span>
                </button>
                {projectForm.images.length ? (
                  <div className="admin-thumbs mt-3">
                    {projectForm.images.map((url) => (
                      <div key={url} className="relative aspect-[4/5] overflow-hidden bg-black/30">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          className="absolute right-1 top-1 bg-black/70 px-1.5 py-0.5 text-[10px] uppercase tracking-wide"
                          onClick={() =>
                            setProjectForm((f) => ({
                              ...f,
                              images: f.images.filter((src) => src !== url),
                            }))
                          }
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={projectForm.published}
                  onChange={(e) =>
                    setProjectForm((f) => ({
                      ...f,
                      published: e.target.checked,
                    }))
                  }
                />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={projectForm.featured}
                  onChange={(e) =>
                    setProjectForm((f) => ({
                      ...f,
                      featured: e.target.checked,
                    }))
                  }
                />
                Featured on homepage
              </label>
              <button
                type="button"
                className="btn btn-primary"
                disabled={busy}
                onClick={saveProject}
              >
                Save project
              </button>
            </div>
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="admin-card">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
                      {project.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={project.images[0]}
                          alt=""
                          className="h-16 w-12 shrink-0 object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-12 shrink-0 items-center justify-center bg-black/30 text-[10px] text-white/40">
                          No photo
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{project.title}</p>
                        <p className="text-xs text-white/50">
                          {project.roomType}
                          {project.images.length
                            ? ` · ${project.images.length} photo${project.images.length === 1 ? "" : "s"}`
                            : ""}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-xs text-red-300"
                      onClick={() => deleteProject(project.id)}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => toggleProject(project, "published")}
                      className="underline"
                    >
                      {project.published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleProject(project, "featured")}
                      className="underline"
                    >
                      {project.featured ? "Unfeature" : "Feature"}
                    </button>
                    <label className="cursor-pointer underline">
                      Add photos
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="sr-only"
                        onChange={(e) => {
                          addPhotosToProject(project, e.target.files);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
        ) : null}

        {tab === "testimonials" ? (
          <div className="mt-8 space-y-6">
            <AdminTip>
              <p>
                Testimonials show on the Reviews page. Use the customer&apos;s
                first name (or &quot;Homeowner, County&quot;) and their words
                about the job — short quotes work best.
              </p>
              <p>
                Optional project tag (like &quot;Bath LVP floors&quot;) helps
                visitors know what kind of work it was. Save when you&apos;re
                ready; published quotes appear on the site right away.
              </p>
            </AdminTip>
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div className="admin-card space-y-3">
              <h2 className="font-display text-2xl">Add testimonial</h2>
              <input
                className="admin-input"
                placeholder='Name (e.g. "Homeowner, Atlantic County")'
                value={testimonialForm.name}
                onChange={(e) =>
                  setTestimonialForm((f) => ({ ...f, name: e.target.value }))
                }
              />
              <textarea
                className="admin-input min-h-28"
                placeholder="Quote"
                value={testimonialForm.quote}
                onChange={(e) =>
                  setTestimonialForm((f) => ({ ...f, quote: e.target.value }))
                }
              />
              <input
                className="admin-input"
                placeholder="Optional project tag"
                value={testimonialForm.projectTag}
                onChange={(e) =>
                  setTestimonialForm((f) => ({
                    ...f,
                    projectTag: e.target.value,
                  }))
                }
              />
              <button
                type="button"
                className="btn btn-primary"
                disabled={busy}
                onClick={saveTestimonial}
              >
                Save testimonial
              </button>
            </div>
            <div className="space-y-3">
              {testimonials.map((t) => (
                <div key={t.id} className="admin-card">
                  <div className="flex justify-between gap-3">
                    <p className="font-semibold">{t.name}</p>
                    <button
                      type="button"
                      className="text-xs text-red-300"
                      onClick={() => deleteTestimonial(t.id)}
                    >
                      Delete
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-white/70">“{t.quote}”</p>
                </div>
              ))}
            </div>
            </div>
          </div>
        ) : null}

        {tab === "proposals" ? (
          <div className="mt-8 space-y-8">
            <AdminTip>
              <p>
                Build a proposal with line items and save it — it stays in your
                admin forever. Job address and phone stay in this dashboard only
                (for your records) and never appear on the printable / shared
                proposal. Copy link, Share, or Email creates a{" "}
                <strong>temporary public page</strong> that works for{" "}
                {PROPOSAL_SHARE_DAYS} days, then turns itself off. Creating a
                new link invalidates the old one.
              </p>
              <p>
                Use <strong>Preview</strong> anytime to see the printable
                proposal without creating a public link. Copy link, Share, or
                Email is what opens the temporary customer page. On your phone,
                Share opens Messages so you can text the customer.
              </p>
            </AdminTip>

            <div>
              <h3 className="mb-3 font-display text-xl">Saved proposals</h3>
              {proposals.length ? (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {proposals.map((proposal) => {
                    const total = proposalAmount(proposal);
                    const active = isShareActive(proposal);
                    return (
                      <div key={proposal.id} className="admin-card">
                        <div className="flex justify-between gap-3">
                          <div>
                            <p className="font-semibold">
                              {proposal.projectTitle}
                            </p>
                            <p className="text-xs text-white/50">
                              {proposal.clientName}
                            </p>
                            {(proposal.clientPhone || proposal.clientAddress) && (
                              <div className="mt-2 space-y-0.5 text-xs text-white/55">
                                {proposal.clientPhone ? (
                                  <p>Phone: {proposal.clientPhone}</p>
                                ) : null}
                                {proposal.clientAddress ? (
                                  <p>Job: {proposal.clientAddress}</p>
                                ) : null}
                              </div>
                            )}
                            <p className="mt-2 text-sm font-semibold text-[color:var(--oak)]">
                              Total {formatCurrency(total)}
                            </p>
                            <p className="mt-1 text-xs text-white/45">
                              {active
                                ? `Public link active until ${formatShareExpiry(proposal.shareExpiresAt!)}`
                                : "No public link right now — Copy / Share opens a 7-day link"}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="text-xs text-red-300"
                            onClick={() => deleteProposal(proposal.id)}
                          >
                            Delete
                          </button>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-sm">
                          <button
                            type="button"
                            className="text-[color:var(--oak)] underline"
                            disabled={busy}
                            onClick={() => openProposalPreview(proposal)}
                          >
                            Preview
                          </button>
                          <button
                            type="button"
                            className="underline text-white/70"
                            disabled={busy}
                            onClick={() => copyProposalLink(proposal)}
                          >
                            Copy link
                          </button>
                          <button
                            type="button"
                            className="underline text-white/70"
                            disabled={busy}
                            onClick={() => shareProposal(proposal)}
                          >
                            Share
                          </button>
                          <button
                            type="button"
                            className="underline text-white/70"
                            disabled={busy}
                            onClick={() => emailProposalLink(proposal)}
                          >
                            Email link
                          </button>
                        </div>
                        <div className="mt-4">
                          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/45">
                            Follow-up notes (admin only)
                          </p>
                          {proposal.adminNotes.length ? (
                            <ul className="mt-2 max-h-36 space-y-2 overflow-y-auto">
                              {proposal.adminNotes.map((note) => (
                                <li
                                  key={note.id}
                                  className="rounded border border-white/10 bg-black/20 px-3 py-2"
                                >
                                  <p className="text-[0.65rem] text-white/45">
                                    {formatAdminNoteWhen(note.createdAt)}
                                  </p>
                                  <p className="mt-1 text-sm leading-snug text-white/80">
                                    {note.text}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-2 text-xs text-white/35">
                              No follow-up notes yet.
                            </p>
                          )}
                          <div className="mt-2 flex gap-2">
                            <input
                              className="admin-input min-w-0 flex-1 py-2 text-sm"
                              placeholder="Customer follow-up, scheduling…"
                              value={noteDrafts[proposal.id] ?? ""}
                              disabled={busy}
                              onChange={(e) =>
                                setNoteDrafts((drafts) => ({
                                  ...drafts,
                                  [proposal.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  void addAdminNote(proposal.id);
                                }
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-primary shrink-0 !px-3 !py-2 text-xs"
                              disabled={
                                busy || !noteDrafts[proposal.id]?.trim()
                              }
                              onClick={() => void addAdminNote(proposal.id)}
                            >
                              Save note
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-white/50">
                  No proposals yet — open New proposal below to create one.
                </p>
              )}
            </div>

            <details className="admin-card admin-collapse space-y-4">
              <summary>
                <h2 className="font-display text-2xl">New proposal</h2>
              </summary>
              <div className="space-y-4">
              <div className="grid gap-3 lg:grid-cols-2">
                <input
                  className="admin-input"
                  placeholder="Client name"
                  value={proposalForm.clientName}
                  onChange={(e) =>
                    setProposalForm((f) => ({ ...f, clientName: e.target.value }))
                  }
                />
                <input
                  className="admin-input"
                  placeholder="Phone (admin only — not on proposal)"
                  value={proposalForm.clientPhone}
                  onChange={(e) =>
                    setProposalForm((f) => ({
                      ...f,
                      clientPhone: e.target.value,
                    }))
                  }
                />
                <input
                  className="admin-input lg:col-span-2"
                  placeholder="Job address (admin only — not on proposal)"
                  value={proposalForm.clientAddress}
                  onChange={(e) =>
                    setProposalForm((f) => ({
                      ...f,
                      clientAddress: e.target.value,
                    }))
                  }
                />
              </div>
              <input
                className="admin-input"
                placeholder="Project title"
                value={proposalForm.projectTitle}
                onChange={(e) =>
                  setProposalForm((f) => ({
                    ...f,
                    projectTitle: e.target.value,
                  }))
                }
              />
              <div className="space-y-4 border border-white/10 p-4 md:p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-white/50">
                  Line items
                </p>
                {proposalForm.lineItems.map((item, index) => {
                  const lineTotal = item.quantity * item.unitPrice;
                  return (
                    <div
                      key={item.id}
                      className="space-y-3 rounded border border-white/10 bg-black/20 p-4"
                    >
                      <div className="grid gap-3 lg:grid-cols-[14rem_minmax(0,1fr)]">
                        <label className="block">
                          <span className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/45">
                            Category
                          </span>
                          <select
                            className="admin-input"
                            value={item.category || "Other"}
                            onChange={(e) =>
                              setProposalForm((f) => ({
                                ...f,
                                lineItems: patchLine(f.lineItems, index, {
                                  category: e.target.value,
                                }),
                              }))
                            }
                          >
                            {LINE_CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block">
                          <span className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/45">
                            Description
                          </span>
                          <input
                            className="admin-input"
                            placeholder="What this line covers — type whatever you need"
                            value={item.description}
                            onChange={(e) =>
                              setProposalForm((f) => ({
                                ...f,
                                lineItems: patchLine(f.lineItems, index, {
                                  description: e.target.value,
                                }),
                              }))
                            }
                          />
                        </label>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[10rem_12rem_minmax(0,1fr)_auto] lg:items-end">
                        <label className="block">
                          <span className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/45">
                            Qty
                          </span>
                          <input
                            className="admin-input"
                            type="number"
                            min={0}
                            step={1}
                            value={item.quantity}
                            onChange={(e) =>
                              setProposalForm((f) => ({
                                ...f,
                                lineItems: patchLine(f.lineItems, index, {
                                  quantity: Number(e.target.value),
                                }),
                              }))
                            }
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/45">
                            Unit price
                          </span>
                          <input
                            className="admin-input"
                            type="number"
                            min={0}
                            step={0.01}
                            value={item.unitPrice}
                            onChange={(e) =>
                              setProposalForm((f) => ({
                                ...f,
                                lineItems: patchLine(f.lineItems, index, {
                                  unitPrice: Number(e.target.value),
                                }),
                              }))
                            }
                          />
                        </label>
                        <div className="flex h-[2.85rem] items-center text-sm text-white/70">
                          Line total{" "}
                          <span className="ml-2 font-semibold text-white">
                            {formatCurrency(lineTotal)}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="justify-self-start text-sm text-red-300 lg:mb-2 lg:justify-self-end"
                          onClick={() =>
                            setProposalForm((f) => ({
                              ...f,
                              lineItems:
                                f.lineItems.length > 1
                                  ? f.lineItems.filter((_, i) => i !== index)
                                  : f.lineItems,
                            }))
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    className="btn btn-ghost !py-2"
                    onClick={() =>
                      setProposalForm((f) => ({
                        ...f,
                        lineItems: [...f.lineItems, newLine()],
                      }))
                    }
                  >
                    Add line
                  </button>
                  <p className="text-base font-semibold">
                    Proposal total {formatCurrency(proposalTotal)}
                  </p>
                </div>
              </div>
              <textarea
                className="admin-input min-h-28"
                placeholder="Notes / exclusions / timeline (shown on proposal)"
                value={proposalForm.notes}
                onChange={(e) =>
                  setProposalForm((f) => ({ ...f, notes: e.target.value }))
                }
              />
              <button
                type="button"
                className="btn btn-primary"
                disabled={busy}
                onClick={saveProposal}
              >
                Save proposal
              </button>
              </div>
            </details>
          </div>
        ) : null}
      </div>
    </div>
  );
}
