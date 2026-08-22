import { getSiteUrl } from "@/lib/site";
import { safeJsonLd } from "@/lib/json-ld";

export type FaqItem = {
  question: string;
  answer: string;
};

export function FaqJsonLd({ faqs }: { faqs: FaqItem[] }) {
  if (!faqs.length) return null;

  const url = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}/services#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
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
