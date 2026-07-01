/** Slug helpers for pretty personalized links (/andriwijaya). */

// Paths that resolve to real routes/files — a guest slug must never take these.
export const RESERVED_SLUGS = new Set(["admin", "api", "en", "404", "index", "robots", "sitemap", "favicon", "og-image"]);

/** Turn a name into a candidate slug: lowercase, alphanumerics only, no spaces. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "");
}

/** A stored slug may contain dashes but nothing exotic. */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]{1,64}$/.test(slug) && !RESERVED_SLUGS.has(slug);
}
