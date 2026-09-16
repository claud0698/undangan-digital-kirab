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

/**
 * Normalize a user-typed custom slug (possibly a pasted URL): strip protocol/host,
 * leading slashes, collapse whitespace/underscores to dashes, drop anything else.
 * Mirrored in the admin page's inline `focusout` handler for the same field — that
 * script is `is:inline` and can't import this module, so keep both in sync by hand.
 */
export function normalizeSlugInput(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^\/+/, "")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/^-+|-+$/g, "");
}
