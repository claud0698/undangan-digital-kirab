/**
 * Neon Postgres access for the admin tool.
 * Server-side only — never import from client/component frontmatter that ships to the browser.
 */
import { neon } from "@neondatabase/serverless";
import { slugify, isValidSlug } from "./slug";

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
  // Open-tracking (see /api/track). Present on listGuests(); absent elsewhere.
  visit_count?: number;
  open_count?: number;
  first_visited_at?: string | null;
  last_visited_at?: string | null;
  first_opened_at?: string | null;
  last_opened_at?: string | null;
};

export type Admin = {
  id: number;
  username: string;
  password_hash: string;
};

/** The three self-service flags. Null everywhere means "never done it". */
export type AdminState = {
  password_changed_at: string | null;
  last_login_at: string | null;
  onboarded_at: string | null;
  /** True = the change-password box opens at each sign-in until they change it. */
  password_change_required: boolean;
};

// ─── guests (users table) ──────────────────────────────────────────
export async function listGuests(): Promise<Guest[]> {
  return (await sql`
    select u.id, u.salutation, u.name, u.address, u.category, u.slug, u.created_at, u.updated_at,
           u.visit_count, u.open_count,
           u.first_visited_at, u.last_visited_at, u.first_opened_at, u.last_opened_at,
           coalesce(ua.username, ca.username) as audited_by
    from users u
    left join admins ua on ua.id = u.updated_by
    left join admins ca on ca.id = u.created_by
    order by u.created_at desc, u.id desc
  `) as Guest[];
}

/**
 * Derive a unique slug from a requested value (or the guest's name), appending
 * an incrementing number on collision: `andriwijaya`, `andriwijaya1`, … Pass
 * `excludeId` when re-slugging an existing guest so it doesn't collide with itself.
 */
export async function uniqueSlug(requested: string, name: string, excludeId?: number): Promise<string> {
  let base = requested ? requested.toLowerCase().replace(/[^a-z0-9-]+/g, "") : "";
  if (!isValidSlug(base)) base = slugify(name); // requested empty/invalid/reserved → derive from name
  if (!isValidSlug(base)) base = "tamu"; // name also empty/reserved → safe default
  let slug = base;
  let n = 1;
  for (;;) {
    const existing = await getGuestBySlug(slug);
    if (!existing || (excludeId != null && existing.id === excludeId)) return slug;
    slug = `${base}${n++}`;
  }
}

/** Record a visit (landed via slug link) or open ("Buka Undangan" pressed). Returns false if no such slug. */
export async function recordEvent(slug: string, type: "visit" | "open"): Promise<boolean> {
  const rows =
    type === "open"
      ? await sql`
          update users set open_count = open_count + 1,
            first_opened_at = coalesce(first_opened_at, now()), last_opened_at = now()
          where slug = ${slug} returning id`
      : await sql`
          update users set visit_count = visit_count + 1,
            first_visited_at = coalesce(first_visited_at, now()), last_visited_at = now()
          where slug = ${slug} returning id`;
  return (rows as unknown[]).length > 0;
}

export async function getGuestById(id: number): Promise<Guest | null> {
  const rows = (await sql`
    select id, salutation, name, address, category, slug, created_at, updated_at
    from users where id = ${id}
  `) as Guest[];
  return rows[0] ?? null;
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
  // Username match is case-insensitive; a case-insensitive unique index keeps
  // this from matching more than one row.
  const rows = (await sql`
    select id, username, password_hash from admins where lower(username) = lower(${username})
  `) as Admin[];
  return rows[0] ?? null;
}

/** Flags used to decide whether to nudge about the password or run the tour. */
export async function getAdminState(id: number): Promise<AdminState | null> {
  const rows = (await sql`
    select password_changed_at, last_login_at, onboarded_at, password_change_required
    from admins where id = ${id}
  `) as AdminState[];
  return rows[0] ?? null;
}

export async function getAdminPasswordHash(id: number): Promise<string | null> {
  const rows = (await sql`select password_hash from admins where id = ${id}`) as { password_hash: string }[];
  return rows[0]?.password_hash ?? null;
}

/**
 * Replace an admin's password. Stamping password_changed_at is what stops the
 * "you are still on the password you were given" nudge, so the two must move
 * together — never write password_hash on its own.
 */
export async function setAdminPassword(id: number, passwordHash: string): Promise<void> {
  // Changing the password is the only thing that stops the prompt — the flag
  // clears here and nowhere else, so "Nanti saja" postpones but never dismisses.
  await sql`
    update admins set password_hash = ${passwordHash}, password_changed_at = now(),
                      password_change_required = false
    where id = ${id}
  `;
}



/** Stamp a successful sign-in. Called after the credentials check, never before. */
export async function markAdminLogin(id: number): Promise<void> {
  await sql`update admins set last_login_at = now() where id = ${id}`;
}

/** Finished or skipped the walkthrough — either way we stop opening it by itself. */
export async function markAdminOnboarded(id: number): Promise<void> {
  await sql`update admins set onboarded_at = now() where id = ${id}`;
}

// ─── login throttle ────────────────────────────────────────────────
const LOGIN_MAX_FAILS = 8;
const LOGIN_LOCK_MINUTES = 15;

/**
 * Every attempt is counted against two keys: the source IP and the username
 * being tried. A lock on either refuses it.
 *
 * The account key exists because the IP key alone is worthless here — it used
 * to be deleted outright on any successful login, so an admin holding one valid
 * credential could guess seven times at a colleague's password, sign in as
 * themselves to wipe the counter, and repeat without ever tripping the lock.
 * Nobody can clear another account's key, because clearing it requires signing
 * in as that account.
 */
export const throttleKeys = (ip: string, username: string): string[] => [
  `ip:${ip}`,
  `user:${username.trim().toLowerCase()}`,
];

/** The furthest-away lock across the given keys, or null if none is locked. */
export async function getLoginLock(keys: string[]): Promise<{ locked_until: string } | null> {
  const rows = (await sql`
    select max(locked_until) as locked_until from login_throttle
    where key = any(${keys}) and locked_until > now()
  `) as { locked_until: string | null }[];
  const until = rows[0]?.locked_until;
  return until ? { locked_until: until } : null;
}

/**
 * Count a failed attempt against every key and lock the ones that cross the
 * line. Returns true when this attempt is the one that tripped the lock, so the
 * caller can say so now rather than reporting a plain wrong password and only
 * revealing the lockout on the next try.
 */
export async function recordLoginFail(keys: string[]): Promise<boolean> {
  const rows = (await sql`
    insert into login_throttle (key, fails, updated_at)
    select k, 1, now() from unnest(${keys}::text[]) as k
    on conflict (key) do update set
      fails = case when login_throttle.fails + 1 >= ${LOGIN_MAX_FAILS} then 0 else login_throttle.fails + 1 end,
      locked_until = case when login_throttle.fails + 1 >= ${LOGIN_MAX_FAILS}
                          then now() + (${LOGIN_LOCK_MINUTES} || ' minutes')::interval
                          else login_throttle.locked_until end,
      updated_at = now()
    returning locked_until
  `) as { locked_until: string | null }[];
  return rows.some((r) => r.locked_until && new Date(r.locked_until).getTime() > Date.now());
}

/** Clear the keys a successful sign-in has earned the right to clear. */
export async function resetLoginAttempts(keys: string[]): Promise<void> {
  await sql`delete from login_throttle where key = any(${keys})`;
}
