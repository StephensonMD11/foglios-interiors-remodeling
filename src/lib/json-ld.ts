/** Escape `<` so JSON-LD cannot break out of the script tag. */
export function safeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
