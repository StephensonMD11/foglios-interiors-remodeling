import { siteConfig, getSiteUrl } from "@/lib/site";

export function JsonLd() {
  const url = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HomeAndConstructionBusiness",
        "@id": `${url}/#business`,
        name: siteConfig.name,
        alternateName: "Foglio's Interiors and Remodeling",
        description: siteConfig.description,
        url,
        image: `${url}/projects/newark-bath-lvp.png`,
        priceRange: "$$",
        areaServed: [
          ...siteConfig.serviceArea.map((name) => ({
            "@type": "AdministrativeArea",
            name,
          })),
          {
            "@type": "Place",
            name: "South Jersey",
          },
        ],
        knowsAbout: [
          "Bathroom remodeling",
          "Flooring installation",
          "LVP flooring",
          "Hardwood flooring",
          "Tile bathrooms",
        ],
        address: {
          "@type": "PostalAddress",
          addressRegion: "NJ",
          addressCountry: "US",
        },
        ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Remodeling & flooring services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Bathroom remodeling",
                description:
                  "Full bathroom remodels in South Jersey — demolition, subfloors, waterproofing, tile, fixtures, and finishes.",
                areaServed: "South Jersey",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Flooring installation",
                description:
                  "LVP, hardwood, and tile flooring for kitchens, living rooms, bedrooms, and baths across South Jersey.",
                areaServed: "South Jersey",
              },
            },
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: { "@id": `${url}/#business` },
        inLanguage: "en-US",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
