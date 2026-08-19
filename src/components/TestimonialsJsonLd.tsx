import type { Testimonial } from "@/lib/types";
import { getSiteUrl, siteConfig } from "@/lib/site";

function safeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

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
