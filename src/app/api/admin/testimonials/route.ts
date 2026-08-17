import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { newId, readStore, writeStore } from "@/lib/content";
import type { Testimonial } from "@/lib/types";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const store = await readStore();
  return NextResponse.json({ testimonials: store.testimonials });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<Testimonial>;
  const now = new Date().toISOString();
  const testimonial: Testimonial = {
    id: newId("test"),
    name: body.name?.trim() || "Homeowner",
    quote: body.quote?.trim() || "",
    projectTag: body.projectTag?.trim() || "",
    published: Boolean(body.published ?? true),
    createdAt: now,
    updatedAt: now,
  };

  const store = await readStore();
  store.testimonials.unshift(testimonial);
  await writeStore(store);
  return NextResponse.json({ testimonial });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<Testimonial> & { id: string };
  const store = await readStore();
  const idx = store.testimonials.findIndex((t) => t.id === body.id);
  if (idx < 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  store.testimonials[idx] = {
    ...store.testimonials[idx],
    name: body.name?.trim() || store.testimonials[idx].name,
    quote: body.quote?.trim() || store.testimonials[idx].quote,
    projectTag:
      body.projectTag === undefined
        ? store.testimonials[idx].projectTag
        : body.projectTag.trim(),
    published:
      body.published === undefined
        ? store.testimonials[idx].published
        : Boolean(body.published),
    updatedAt: new Date().toISOString(),
  };

  await writeStore(store);
  return NextResponse.json({ testimonial: store.testimonials[idx] });
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
  store.testimonials = store.testimonials.filter((t) => t.id !== id);
  await writeStore(store);
  return NextResponse.json({ ok: true });
}
