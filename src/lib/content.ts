import { put, list, del, get } from "@vercel/blob";
import type { ContentStore, Project, Proposal, Testimonial } from "./types";

const CONTENT_PATH = "content/store.json";

const emptyStore = (): ContentStore => ({
  projects: [],
  testimonials: [],
  proposals: [],
});

const fallbackStore = (): ContentStore => ({
  projects: [
    {
      id: "proj-newark-lvp",
      title: "Two bath LVP floors",
      roomType: "Flooring",
      caption:
        "Luxury vinyl plank installed in two small bathrooms in Newark, Delaware — clean finish on short notice.",
      images: ["/projects/newark-bath-lvp.png"],
      published: true,
      featured: true,
      createdAt: "2026-07-10T12:00:00.000Z",
      updatedAt: "2026-07-10T12:00:00.000Z",
    },
    {
      id: "demo-bath-1",
      title: "Primary bath refresh",
      roomType: "Bathroom",
      caption:
        "Full gut remodel — waterproofing, tile, vanity, and lighting coordinated start to finish.",
      images: [
        "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1600&q=80",
      ],
      published: true,
      featured: true,
      createdAt: "2026-08-01T12:00:00.000Z",
      updatedAt: "2026-08-01T12:00:00.000Z",
    },
    {
      id: "demo-floor-1",
      title: "Living room hardwood",
      roomType: "Flooring",
      caption:
        "New hardwood throughout the main living space with careful transitions and base finishes.",
      images: [
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80",
      ],
      published: true,
      featured: true,
      createdAt: "2026-07-15T12:00:00.000Z",
      updatedAt: "2026-07-15T12:00:00.000Z",
    },
  ],
  testimonials: [
    {
      id: "rev-michael-s",
      name: "Michael S., Newark, Delaware",
      quote:
        "They came out to Newark, Delaware and floored two small bathrooms with LVP. Fantastic job on very short notice — clean, professional work from start to finish.",
      projectTag: "Bathroom flooring · July 2026",
      published: true,
      createdAt: "2026-07-12T12:00:00.000Z",
      updatedAt: "2026-07-12T12:00:00.000Z",
    },
    {
      id: "demo-t1",
      name: "Homeowner, Cape May County",
      quote:
        "They tore our bathroom down to the studs and brought it back better than we imagined. Clear communication the whole way.",
      projectTag: "Bathroom remodel",
      published: true,
      createdAt: "2026-05-01T12:00:00.000Z",
      updatedAt: "2026-05-01T12:00:00.000Z",
    },
    {
      id: "demo-t2",
      name: "Homeowner, Atlantic County",
      quote:
        "New floors in the kitchen and living room look incredible. Showed up when they said they would and left the house clean.",
      projectTag: "Flooring",
      published: true,
      createdAt: "2026-04-01T12:00:00.000Z",
      updatedAt: "2026-04-01T12:00:00.000Z",
    },
  ],
  proposals: [],
});

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function streamToText(stream: ReadableStream<Uint8Array>) {
  return new Response(stream).text();
}

function normalizeProposal(proposal: Proposal): Proposal {
  return {
    ...proposal,
    publicId: proposal.publicId || null,
    shareExpiresAt: proposal.shareExpiresAt ?? null,
    clientAddress: proposal.clientAddress ?? "",
    clientPhone: proposal.clientPhone ?? "",
  };
}

function normalizeStore(data: Partial<ContentStore>): ContentStore {
  return {
    projects: data.projects ?? [],
    testimonials: data.testimonials ?? [],
    proposals: (data.proposals ?? []).map(normalizeProposal),
  };
}

export async function readStore(): Promise<ContentStore> {
  if (!hasBlobToken()) {
    return fallbackStore();
  }

  try {
    const result = await get(CONTENT_PATH, {
      access: "private",
      useCache: false,
    });

    if (!result || result.statusCode !== 200 || !result.stream) {
      const legacy = await list({ prefix: CONTENT_PATH, limit: 10 });
      const publicMatch = legacy.blobs.find((b) => b.pathname === CONTENT_PATH);
      if (publicMatch?.url) {
        try {
          const res = await fetch(publicMatch.url, { cache: "no-store" });
          if (res.ok) {
            const migrated = normalizeStore((await res.json()) as ContentStore);
            await writeStore(migrated);
            try {
              await del(publicMatch.url);
            } catch {
              // best-effort cleanup of legacy public JSON
            }
            return migrated;
          }
        } catch {
          // fall through to seed
        }
      }

      const seed = fallbackStore();
      await writeStore(seed);
      return seed;
    }

    const raw = await streamToText(result.stream);
    return normalizeStore(JSON.parse(raw) as ContentStore);
  } catch {
    return fallbackStore();
  }
}

export async function writeStore(store: ContentStore): Promise<void> {
  if (!hasBlobToken()) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not configured. Add it in Vercel / .env.local to save content.",
    );
  }

  await put(CONTENT_PATH, JSON.stringify(store, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function getPublishedProjects(): Promise<Project[]> {
  const store = await readStore();
  return store.projects
    .filter((p) => p.published)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getPublishedProjects();
  const featured = projects.filter((p) => p.featured);
  return featured.length ? featured.slice(0, 3) : projects.slice(0, 3);
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  const store = await readStore();
  return store.testimonials
    .filter((t) => t.published)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getProposalByPublicId(
  publicId: string,
): Promise<Proposal | null> {
  if (!publicId) return null;
  const store = await readStore();
  const idx = store.proposals.findIndex((p) => p.publicId === publicId);
  if (idx < 0) return null;

  const proposal = store.proposals[idx];
  const expiresAt = proposal.shareExpiresAt;
  if (!expiresAt || Date.parse(expiresAt) <= Date.now()) {
    // Public link expired — clear it so the URL no longer resolves.
    store.proposals[idx] = {
      ...proposal,
      publicId: null,
      shareExpiresAt: null,
      updatedAt: new Date().toISOString(),
    };
    await writeStore(store);
    return null;
  }

  return proposal;
}

export function newId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

export function proposalTotal(proposal: Proposal) {
  return proposal.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export { emptyStore };
