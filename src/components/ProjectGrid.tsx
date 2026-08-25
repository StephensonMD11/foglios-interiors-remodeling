import Link from "next/link";
import type { Project } from "@/lib/types";
import { ProjectPhotoRotator } from "@/components/ProjectPhotoRotator";

export function ProjectGrid({
  projects,
  compact = false,
}: {
  projects: Project[];
  compact?: boolean;
}) {
  if (!projects.length) {
    return (
      <p className="text-[color:var(--slate)]">
        Project photos will appear here once uploaded from the owner dashboard.
      </p>
    );
  }

  return (
    <div
      className={`grid gap-5 ${compact ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-3"}`}
    >
      {projects.map((project, i) => (
        <article
          key={project.id}
          className={`group reveal reveal-delay-${Math.min(i + 1, 3)}`}
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--fog)]">
            {project.images.length ? (
              <ProjectPhotoRotator
                images={project.images}
                alt={project.title}
              />
            ) : null}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--oak)]">
                {project.roomType}
              </p>
              <h3 className="font-display mt-1 text-2xl leading-tight">
                {project.title}
              </h3>
              {!compact ? (
                <p className="mt-2 line-clamp-2 text-sm text-white/75">
                  {project.caption}
                </p>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ProjectsCta() {
  return (
    <div className="mt-10 text-center">
      <Link href="/projects" className="btn btn-dark">
        View all projects
      </Link>
    </div>
  );
}
