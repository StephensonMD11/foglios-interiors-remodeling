import { siteConfig, getSiteUrl } from "@/lib/site";
import { safeJsonLd } from "@/lib/json-ld";

export function JsonLd() {
  const url = getSiteUrl();
  const sameAs = [siteConfig.instagram, siteConfig.facebook].filter(Boolean);
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
        logo: `${url}/projects/newark-bath-lvp.png`,
        image: `${url}/projects/newark-bath-lvp.png`,
        priceRange: "$$",
        ...(sameAs.length ? { sameAs } : {}),
        areaServed: [
          ...siteConfig.serviceArea.map((name) => ({
            "@type": "AdministrativeArea",
            name,
          })),
          ...siteConfig.serviceTowns.map((name) => ({
            "@type": "City",
            name,
            containedInPlace: {
              "@type": "AdministrativeArea",
              name: "New Jersey",
            },
          })),
          {
            "@type": "Place",
            name: "South Jersey",
          },
        ],
        knowsAbout: [...siteConfig.services],
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
                serviceType: "Bathroom remodeling",
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
                serviceType: "Flooring installation",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Luxury vinyl plank (LVP)",
                description:
                  "Waterproof LVP flooring installation for baths, kitchens, and living areas in South Jersey homes.",
                areaServed: "South Jersey",
                serviceType: "LVP flooring",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Tile installation",
                description:
                  "Bathroom and flooring tile installation with proper prep and waterproofing where needed.",
                areaServed: "South Jersey",
                serviceType: "Tile installation",
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
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
