import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";

const ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/estimate", changeFrequency: "monthly", priority: 0.9 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.85 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.8 },
  { path: "/testimonials", changeFrequency: "weekly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const built = new Date("2026-08-24T12:00:00.000Z");
  const projects = await getPublishedProjects();

  const pages: MetadataRoute.Sitemap = ROUTES.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${base}${path}`,
      lastModified: built,
      changeFrequency,
      priority,
      ...(path === "/projects" && projects.length
        ? {
            images: projects
              .flatMap((p) => p.images)
              .filter((src) => src.startsWith("/") || src.startsWith("http"))
              .slice(0, 12)
              .map((src) =>
                src.startsWith("http") ? src : `${base}${src}`,
              ),
          }
        : {}),
    }),
  );

  return pages;
}
