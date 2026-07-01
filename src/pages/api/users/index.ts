import type { APIRoute } from "astro";
import { listGuests, createGuest, uniqueSlug } from "~/lib/db";
import { getSession } from "~/lib/auth";
import { sameOrigin } from "~/lib/csrf";
import { isValidCategory } from "~/lib/categories";

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

const isUniqueViolation = (e: unknown): boolean =>
  !!e && (((e as { code?: string }).code === "23505") || /duplicate key|unique/i.test(String((e as Error).message ?? "")));

export const GET: APIRoute = async ({ cookies }) => {
  if (!getSession(cookies)) return json({ error: "unauthorized" }, 401);
  return json({ guests: await listGuests() });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = getSession(cookies);
  if (!session) return json({ error: "unauthorized" }, 401);
  if (!sameOrigin(request)) return json({ error: "forbidden" }, 403);

  const body = await request.json().catch(() => ({}));
  const salutation = String(body.salutation ?? "").trim();
  const name = String(body.name ?? "").trim();
  const address = String(body.address ?? "").trim();
  const category = String(body.category ?? "").trim();

  // Sebutan (salutation) is optional; the rest are required.
  if (!name || !address || !category)
    return json({ error: "Kolom wajib belum lengkap (nama, alamat, kategori)." }, 400);
  if (!isValidCategory(category)) return json({ error: "Kategori tidak valid." }, 400);

  const requested = String(body.slug ?? "").trim();
  // Retry on the (rare) race where two creates pick the same slug between the
  // uniqueness check and the insert — the partial unique index rejects the loser.
  for (let attempt = 0; attempt < 5; attempt++) {
    const slug = await uniqueSlug(requested, name);
    try {
      const guest = await createGuest({ salutation: salutation || null, name, address, category, slug, createdBy: session.id });
      return json({ guest: { ...guest, audited_by: session.username } }, 201);
    } catch (e) {
      if (isUniqueViolation(e) && attempt < 4) continue;
      return json({ error: "Gagal menyimpan tamu." }, 500);
    }
  }
  return json({ error: "Gagal membuat tautan unik." }, 500);
};
