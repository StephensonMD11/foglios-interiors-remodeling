import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { newId, readStore, writeStore } from "@/lib/content";
import type { Project } from "@/lib/types";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const store = await readStore();
  return NextResponse.json({ projects: store.projects });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<Project>;
  const now = new Date().toISOString();
  const project: Project = {
    id: newId("proj"),
    title: body.title?.trim() || "Untitled project",
    roomType: body.roomType?.trim() || "Project",
    caption: body.caption?.trim() || "",
    images: body.images?.filter(Boolean) || [],
    published: Boolean(body.published),
    featured: Boolean(body.featured),
    createdAt: now,
    updatedAt: now,
  };

  const store = await readStore();
  store.projects.unshift(project);
  await writeStore(store);
  return NextResponse.json({ project });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<Project> & { id: string };
  const store = await readStore();
  const idx = store.projects.findIndex((p) => p.id === body.id);
  if (idx < 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  store.projects[idx] = {
    ...store.projects[idx],
    ...body,
    title: body.title?.trim() || store.projects[idx].title,
    roomType: body.roomType?.trim() || store.projects[idx].roomType,
    caption: body.caption ?? store.projects[idx].caption,
    images: body.images ?? store.projects[idx].images,
    published:
      body.published === undefined
        ? store.projects[idx].published
        : Boolean(body.published),
    featured:
      body.featured === undefined
        ? store.projects[idx].featured
        : Boolean(body.featured),
    updatedAt: new Date().toISOString(),
  };

  await writeStore(store);
  return NextResponse.json({ project: store.projects[idx] });
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
  store.projects = store.projects.filter((p) => p.id !== id);
  await writeStore(store);
  return NextResponse.json({ ok: true });
}
