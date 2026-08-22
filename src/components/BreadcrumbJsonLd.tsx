import { getSiteUrl, siteConfig } from "@/lib/site";
import { safeJsonLd } from "@/lib/json-ld";

type Crumb = { name: string; path: string };

export function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  if (items.length < 2) return null;

  const url = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${url}${item.path === "/" ? "" : item.path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}

export function pageBreadcrumbs(
  ...crumbs: { name: string; path: string }[]
): Crumb[] {
  return [{ name: siteConfig.shortName, path: "/" }, ...crumbs];
}
