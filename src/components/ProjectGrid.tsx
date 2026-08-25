import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { publicImageSrc } from "@/lib/media";

function ProjectImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const image = publicImageSrc(src);
  const isProxied = image.startsWith("/api/media");

  // Private Blob photos go through /api/media — use a plain img so query-string
  // URLs always render (next/image can omit them during static generation).
  if (isProxied) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
      />
    );
  }

  return (
    <Image
      src={image}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 33vw"
      className="object-cover transition duration-700 group-hover:scale-[1.04]"
    />
  );
}

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
      {projects.map((project, i) => {
        const image = project.images[0] || null;
        return (
          <article
            key={project.id}
            className={`group reveal reveal-delay-${Math.min(i + 1, 3)}`}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--fog)]">
              {image ? <ProjectImage src={image} alt={project.title} /> : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
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
        );
      })}
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
