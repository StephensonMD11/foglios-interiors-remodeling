export const siteConfig = {
  name: "Foglio's Interiors & Remodeling",
  shortName: "Foglio's",
  tagline: "Bathroom remodeling & flooring across South Jersey",
  description:
    "South Jersey bathroom remodeling and flooring contractor serving Cape May, Cumberland, Salem, Atlantic, and Gloucester counties. Full bathroom remodels, tile, and LVP or hardwood floors installed with care.",
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
  ],
  phone: process.env.NEXT_PUBLIC_PHONE || "",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM || "",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK || "",
  emailPublic: false,
} as const;

export function getSiteUrl() {
  return siteConfig.url.replace(/\/$/, "");
}
