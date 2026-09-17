import { foglioMarkResponse } from "@/lib/brand-icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Full-bleed mark — iOS applies its own mask to apple-touch icons. */
export default function AppleIcon() {
  return foglioMarkResponse({ size: 180, rounded: false });
}
