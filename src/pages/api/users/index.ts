import type { APIRoute } from "astro";
import { listGuests, createGuest, getGuestBySlug } from "~/lib/db";
import { getSession } from "~/lib/auth";
import { isValidCategory } from "~/lib/categories";
import { slugify, isValidSlug } from "~/lib/slug";

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

/** Derive a unique slug from a requested value (or the name), suffixing on collision. */
async function uniqueSlug(requested: string, name: string): Promise<string> {
  let base = requested ? requested.toLowerCase().replace(/[^a-z0-9-]+/g, "") : "";
  if (!base || !isValidSlug(base)) base = slugify(name);
  if (!base) base = "tamu";
  let slug = base;
  let n = 2;
  while (await getGuestBySlug(slug)) slug = `${base}-${n++}`;
  return slug;
}

export const GET: APIRoute = async ({ cookies }) => {
  if (!getSession(cookies)) return json({ error: "unauthorized" }, 401);
  return json({ guests: await listGuests() });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = getSession(cookies);
  if (!session) return json({ error: "unauthorized" }, 401);

  const body = await request.json().catch(() => ({}));
  const salutation = String(body.salutation ?? "").trim();
  const name = String(body.name ?? "").trim();
  const address = String(body.address ?? "").trim();
  const category = String(body.category ?? "").trim();

  // Everything is required.
  if (!salutation || !name || !address || !category)
    return json({ error: "Semua kolom wajib diisi (sebutan, nama, alamat, kategori)." }, 400);
  if (!isValidCategory(category)) return json({ error: "Kategori tidak valid." }, 400);

  const slug = await uniqueSlug(String(body.slug ?? "").trim(), name);

  const guest = await createGuest({ salutation, name, address, category, slug, createdBy: session.id });
  return json({ guest: { ...guest, audited_by: session.username } }, 201);
};
