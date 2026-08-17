export const LINE_CATEGORIES = [
  "Labor",
  "Flooring",
  "Tile",
  "Vanity",
  "Toilet",
  "Drywall",
  "Plumbing",
  "Electrical",
  "Demo / prep",
  "Other",
] as const;

export type LineCategory = (typeof LINE_CATEGORIES)[number];
