/**
 * Neon Postgres access for the admin tool.
 * Server-side only — never import from client/component frontmatter that ships to the browser.
 */
import { neon } from "@neondatabase/serverless";

const url = import.meta.env.DATABASE_URL ?? process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

export const sql = neon(url);

export type Guest = {
  id: number;
  salutation: string | null;
  name: string;
  address: string | null;
  category: string | null;
  slug: string | null;
  created_at: string;
  updated_at: string;
  audited_by?: string | null; // username of the admin who last created/edited (display only)
};

export type Admin = {
  id: number;
  username: string;
  password_hash: string;
};

// ─── guests (users table) ──────────────────────────────────────────
export async function listGuests(): Promise<Guest[]> {
  return (await sql`
    select u.id, u.salutation, u.name, u.address, u.category, u.slug, u.created_at, u.updated_at,
           coalesce(ua.username, ca.username) as audited_by
    from users u
    left join admins ua on ua.id = u.updated_by
    left join admins ca on ca.id = u.created_by
    order by u.created_at desc, u.id desc
  `) as Guest[];
}

export async function getGuestBySlug(slug: string): Promise<Guest | null> {
  const rows = (await sql`
    select id, salutation, name, address, category, slug, created_at, updated_at
    from users where slug = ${slug}
  `) as Guest[];
  return rows[0] ?? null;
}

export async function createGuest(input: {
  salutation?: string | null;
  name: string;
  address?: string | null;
  category?: string | null;
  slug?: string | null;
  createdBy?: number | null;
}): Promise<Guest> {
  const rows = (await sql`
    insert into users (salutation, name, address, category, slug, created_by, updated_by)
    values (${input.salutation ?? null}, ${input.name}, ${input.address ?? null},
            ${input.category ?? null}, ${input.slug ?? null}, ${input.createdBy ?? null}, ${input.createdBy ?? null})
    returning id, salutation, name, address, category, slug, created_at, updated_at
  `) as Guest[];
  return rows[0];
}

export async function updateGuest(
  id: number,
  patch: { salutation?: string | null; name?: string; address?: string | null; category?: string | null; slug?: string | null },
  updatedBy?: number | null,
): Promise<Guest | null> {
  const rows = (await sql`
    update users set
      salutation = case when ${"salutation" in patch} then ${patch.salutation ?? null} else salutation end,
      name       = coalesce(${patch.name ?? null}, name),
      address    = case when ${"address" in patch} then ${patch.address ?? null} else address end,
      category   = case when ${"category" in patch} then ${patch.category ?? null} else category end,
      slug       = case when ${"slug" in patch} then ${patch.slug ?? null} else slug end,
      updated_by = ${updatedBy ?? null},
      updated_at = now()
    where id = ${id}
    returning id, salutation, name, address, category, slug, created_at, updated_at
  `) as Guest[];
  return rows[0] ?? null;
}

export async function deleteGuest(id: number): Promise<void> {
  await sql`delete from users where id = ${id}`;
}

// ─── admins ────────────────────────────────────────────────────────
export async function findAdminByUsername(username: string): Promise<Admin | null> {
  const rows = (await sql`
    select id, username, password_hash from admins where username = ${username}
  `) as Admin[];
  return rows[0] ?? null;
}
