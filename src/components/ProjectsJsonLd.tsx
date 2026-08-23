import type { Project } from "@/lib/types";
import { getSiteUrl, siteConfig } from "@/lib/site";
import { safeJsonLd } from "@/lib/json-ld";

export function ProjectsJsonLd({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  const url = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${url}/projects#gallery`,
    name: `${siteConfig.shortName} bathroom & flooring projects`,
    description:
      "Selected bathroom remodeling and flooring projects across South Jersey.",
    numberOfItems: projects.length,
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        "@id": `${url}/projects#${p.id}`,
        name: p.title,
        description: p.caption,
        about: p.roomType,
        dateCreated: p.createdAt,
        dateModified: p.updatedAt,
        ...(p.images[0]
          ? {
              image: p.images[0].startsWith("http")
                ? p.images[0]
                : `${url}${p.images[0]}`,
            }
          : {}),
        creator: { "@id": `${url}/#business` },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
