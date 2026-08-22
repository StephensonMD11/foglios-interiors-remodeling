import { ProjectGrid } from "@/components/ProjectGrid";
import {
  BreadcrumbJsonLd,
  pageBreadcrumbs,
} from "@/components/BreadcrumbJsonLd";
import { ProjectsJsonLd } from "@/components/ProjectsJsonLd";
import { getPublishedProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Bathroom & Flooring Projects in South Jersey",
  description:
    "Browse bathroom remodel and flooring projects from Foglio's across South Jersey — Vineland, Cape May County, Atlantic County, and nearby towns. Baths, LVP, hardwood, and tile.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <>
      <BreadcrumbJsonLd
        items={pageBreadcrumbs({ name: "Projects", path: "/projects" })}
      />
      <ProjectsJsonLd projects={projects} />
      <section className="bg-[color:var(--sea-deep)] pb-16 pt-32 text-white">
        <div className="container-page">
          <p className="section-label !text-[color:var(--oak)]">Projects</p>
          <h1 className="font-display max-w-3xl text-5xl leading-tight tracking-tight md:text-6xl">
            Work that speaks for itself.
          </h1>
          <p className="mt-5 max-w-xl text-white/75">
            A living gallery — updated as new bathrooms and floors are finished
            across South Jersey.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container-page">
          <ProjectGrid projects={projects} />
        </div>
      </section>
    </>
  );
}
