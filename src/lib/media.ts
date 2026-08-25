/** Helpers for Vercel Blob private-store project photos. */

export function isVercelBlobUrl(src: string) {
  try {
    const host = new URL(src).hostname;
    return (
      host.endsWith(".blob.vercel-storage.com") ||
      host === "blob.vercel-storage.com"
    );
  } catch {
    return false;
  }
}

/**
 * Convert a stored image URL into something the public site can load.
 * Private Blob URLs are served through /api/media; local and Unsplash URLs pass through.
 */
export function publicImageSrc(src: string) {
  if (!src) return src;
  if (src.startsWith("/")) return src;
  if (src.startsWith("/api/media?")) return src;
  if (isVercelBlobUrl(src)) {
    return `/api/media?u=${encodeURIComponent(src)}`;
  }
  return src;
}

export function publicProjectImages<T extends { images: string[] }>(item: T): T {
  return {
    ...item,
    images: item.images.map(publicImageSrc),
  };
}
