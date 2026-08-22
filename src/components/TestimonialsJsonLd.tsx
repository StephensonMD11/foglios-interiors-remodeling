import type { Testimonial } from "@/lib/types";
import { getSiteUrl, siteConfig } from "@/lib/site";
import { safeJsonLd } from "@/lib/json-ld";

export function TestimonialsJsonLd({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  if (!testimonials.length) return null;

  const url = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@graph": testimonials.map((t, i) => ({
      "@type": "Review",
      "@id": `${url}/testimonials#review-${t.id}`,
      itemReviewed: {
        "@type": "HomeAndConstructionBusiness",
        "@id": `${url}/#business`,
        name: siteConfig.name,
      },
      author: {
        "@type": "Person",
        name: t.name.split(",")[0]?.trim() || t.name,
      },
      reviewBody: t.quote,
      datePublished: t.createdAt,
      ...(t.projectTag ? { name: t.projectTag } : {}),
      position: i + 1,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
