export const siteConfig = {
  name: "Foglio's Interiors & Remodeling",
  shortName: "Foglio's",
  tagline: "Bathroom remodeling & flooring across South Jersey",
  description:
    "South Jersey bathroom remodeling and flooring contractor — shore towns from Cape May to Atlantic City, plus Vineland, Millville, Glassboro, and communities across Cape May, Cumberland, Salem, Atlantic, and Gloucester counties. Full bathroom remodels, tile, and LVP or hardwood floors installed with care.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  serviceArea: [
    "Cape May County",
    "Cumberland County",
    "Salem County",
    "Atlantic County",
    "Gloucester County",
  ],
  serviceAreaLabel:
    "Cape May, Cumberland, Salem, Atlantic, and Gloucester counties",
  /** Jersey Shore towns — a major part of our service area. */
  shoreTowns: [
    "Cape May",
    "Wildwood",
    "Wildwood Crest",
    "North Wildwood",
    "Stone Harbor",
    "Avalon",
    "Sea Isle City",
    "Ocean City",
    "Strathmere",
    "Townsend's Inlet",
    "Brigantine",
    "Atlantic City",
    "Ventnor City",
    "Margate City",
    "Longport",
  ],
  /** Inland / mainland towns for local SEO + schema areaServed. */
  serviceTowns: [
    "Vineland",
    "Millville",
    "Bridgeton",
    "Glassboro",
    "Woodbury",
    "Mullica Hill",
    "Hammonton",
    "Swedesboro",
    "Pitman",
  ],
  services: [
    "Bathroom remodeling",
    "Flooring installation",
    "Luxury vinyl plank (LVP)",
    "Hardwood flooring",
    "Tile installation",
    "Drywall and finishes",
    "Subfloor repair",
  ],
  keywords: [
    "South Jersey bathroom remodeling",
    "bathroom remodel South Jersey",
    "flooring contractor South Jersey",
    "LVP flooring Cape May County",
    "bathroom renovation Atlantic County",
    "flooring installation Gloucester County",
    "tile bathroom remodel New Jersey",
    "hardwood floors South Jersey",
    "Cumberland County bathroom remodel",
    "Salem County flooring contractor",
    "luxury vinyl plank South Jersey",
    "bathroom contractor near me South Jersey",
    "shore town bathroom remodeling",
    "Wildwood bathroom remodel",
    "Wildwood Crest flooring contractor",
    "North Wildwood bathroom renovation",
    "Stone Harbor bathroom remodeling",
    "Avalon flooring installation",
    "Sea Isle City bathroom remodel",
    "Ocean City flooring contractor",
    "Brigantine bathroom renovation",
    "Atlantic City flooring installation",
    "Ventnor bathroom remodel",
    "Margate City flooring",
    "Longport bathroom remodeling",
    "Cape May bathroom remodel",
    "Vineland bathroom remodeling",
    "Millville flooring contractor",
    "Glassboro bathroom remodel",
    "Bridgeton LVP flooring",
    "Woodbury hardwood floors",
  ],
  phone: process.env.NEXT_PUBLIC_PHONE || "",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM || "",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK || "",
  emailPublic: false,
} as const;

export function getSiteUrl() {
  return siteConfig.url.replace(/\/$/, "");
}

/** All named towns for schema and copy — shore first, then inland. */
export function allServiceTowns() {
  return [...siteConfig.shoreTowns, ...siteConfig.serviceTowns];
}
