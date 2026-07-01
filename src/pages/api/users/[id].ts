import type { APIRoute } from "astro";
import { updateGuest, deleteGuest, getGuestById, uniqueSlug } from "~/lib/db";
import { getSession } from "~/lib/auth";
import { sameOrigin } from "~/lib/csrf";
import { isValidCategory } from "~/lib/categories";
import { isValidSlug } from "~/lib/slug";

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

// Sebutan (salutation) is optional and may be blanked; the rest cannot be empty.
const EDITABLE = ["salutation", "name", "address", "category"] as const;
const REQUIRED = ["name", "address", "category"] as const;

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  const session = getSession(cookies);
  if (!session) return json({ error: "unauthorized" }, 401);
  if (!sameOrigin(request)) return json({ error: "forbidden" }, 403);
  const id = Number(params.id);
  if (!Number.isInteger(id)) return json({ error: "bad id" }, 400);

  const body = await request.json().catch(() => ({}));
  const patch: { salutation?: string | null; name?: string; address?: string; category?: string; slug?: string | null } = {};
  for (const key of [...EDITABLE, "slug"] as const) {
    if (key in body) patch[key] = String(body[key] ?? "").trim();
  }

  // Required fields cannot be blanked.
  for (const key of REQUIRED) {
    if (key in patch && !patch[key]) return json({ error: `${key} tidak boleh kosong` }, 400);
  }
  // Sebutan is optional — an empty value clears it.
  if ("salutation" in patch && !patch.salutation) patch.salutation = null;
  if ("category" in patch && !isValidCategory(String(patch.category))) return json({ error: "Kategori tidak valid." }, 400);

  if ("slug" in patch) {
    // Every guest always keeps exactly one link. A typed slug is normalized and,
    // on collision, gets an incrementing suffix (andriwijaya, andriwijaya1, …);
    // an emptied slug is regenerated from the guest's name — it never becomes null.
    const raw = String(patch.slug ?? "");
    const cleaned = raw.toLowerCase().replace(/[^a-z0-9-]+/g, "");
    if (raw && !isValidSlug(cleaned))
      return json({ error: "Tautan kustom tidak valid (huruf kecil, angka, tanda hubung)." }, 400);
    const nameForSlug = patch.name ?? (await getGuestById(id))?.name ?? "";
    patch.slug = await uniqueSlug(cleaned, nameForSlug, id);
  }

  const guest = await updateGuest(id, patch, session.id);
  if (!guest) return json({ error: "not found" }, 404);
  return json({ guest: { ...guest, audited_by: session.username } });
};

export const DELETE: APIRoute = async ({ params, request, cookies }) => {
  if (!getSession(cookies)) return json({ error: "unauthorized" }, 401);
  if (!sameOrigin(request)) return json({ error: "forbidden" }, 403);
  const id = Number(params.id);
  if (!Number.isInteger(id)) return json({ error: "bad id" }, 400);
  await deleteGuest(id);
  return json({ ok: true });
};
