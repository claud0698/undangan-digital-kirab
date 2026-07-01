import type { APIRoute } from "astro";
import { updateGuest, deleteGuest, getGuestBySlug } from "~/lib/db";
import { getSession } from "~/lib/auth";
import { isValidCategory } from "~/lib/categories";
import { isValidSlug } from "~/lib/slug";

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

const REQUIRED = ["salutation", "name", "address", "category"] as const;

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  const session = getSession(cookies);
  if (!session) return json({ error: "unauthorized" }, 401);
  const id = Number(params.id);
  if (!Number.isInteger(id)) return json({ error: "bad id" }, 400);

  const body = await request.json().catch(() => ({}));
  const patch: Record<string, string> = {};

  for (const key of [...REQUIRED, "slug"] as const) {
    if (key in body) patch[key] = String(body[key] ?? "").trim();
  }

  // Required fields cannot be blanked.
  for (const key of REQUIRED) {
    if (key in patch && !patch[key]) return json({ error: `${key} tidak boleh kosong` }, 400);
  }
  if ("category" in patch && !isValidCategory(patch.category)) return json({ error: "Kategori tidak valid." }, 400);

  if ("slug" in patch) {
    const s = patch.slug.toLowerCase().replace(/[^a-z0-9-]+/g, "");
    if (!isValidSlug(s)) return json({ error: "Tautan kustom tidak valid (huruf kecil, angka, tanda hubung)." }, 400);
    const existing = await getGuestBySlug(s);
    if (existing && existing.id !== id) return json({ error: "Tautan kustom sudah dipakai tamu lain." }, 409);
    patch.slug = s;
  }

  const guest = await updateGuest(id, patch, session.id);
  if (!guest) return json({ error: "not found" }, 404);
  return json({ guest: { ...guest, audited_by: session.username } });
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  if (!getSession(cookies)) return json({ error: "unauthorized" }, 401);
  const id = Number(params.id);
  if (!Number.isInteger(id)) return json({ error: "bad id" }, 400);
  await deleteGuest(id);
  return json({ ok: true });
};
