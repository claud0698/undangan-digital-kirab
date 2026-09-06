/**
 * Creates the Neon tables for the invitation admin tool.
 * Run:  node --env-file=.env scripts/db-init.mjs
 *
 * Idempotent — safe to run multiple times.
 */
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("✗ DATABASE_URL is not set. Run with:  node --env-file=.env scripts/db-init.mjs");
  process.exit(1);
}

const sql = neon(url);

async function main() {
  // Admin accounts that can log into /admin.
  await sql`
    create table if not exists admins (
      id            bigint generated always as identity primary key,
      username      text        not null unique,
      password_hash text        not null,
      created_at    timestamptz not null default now()
    )
  `;
  // Usernames are case-insensitive: "Yanny" and "yanny" are the same account.
  await sql`create unique index if not exists admins_username_lower_key on admins (lower(username))`;

  // Password self-service + first-run onboarding.
  //   password_changed_at  null = still on the password whoever created the
  //                        account handed over, so the tool nudges them to change it.
  //   last_login_at        null = has never signed in.
  //   onboarded_at         null = has not finished (or skipped) the walkthrough.
  // All three are nullable on purpose: existing admins created before this
  // migration read as "never changed / never logged in / never onboarded",
  // which is exactly how they should be treated.
  await sql`alter table admins add column if not exists password_changed_at timestamptz`;
  await sql`alter table admins add column if not exists last_login_at       timestamptz`;
  await sql`alter table admins add column if not exists onboarded_at        timestamptz`;

  // While true, the change-password box opens by itself at every sign-in until
  // the account actually changes it. It is a prompt, not a lock: the existing
  // password keeps working and the tool stays usable if they postpone. Nobody
  // gets locked out of the guest list in the middle of the event.
  // Set per account — see scripts/require-password-change.mjs.
  await sql`alter table admins add column if not exists password_change_required boolean not null default false`;

  // Guests / invitation recipients. One row per personalized link.
  await sql`
    create table if not exists users (
      id          bigint generated always as identity primary key,
      salutation  text,
      name        text        not null,
      address     text,
      category    text,
      created_by  bigint      references admins(id) on delete set null,
      created_at  timestamptz not null default now(),
      updated_at  timestamptz not null default now()
    )
  `;

  // Custom slug for pretty personalized links (/andriwijaya → redirect).
  await sql`alter table users add column if not exists slug text`;
  await sql`create unique index if not exists users_slug_key on users (slug) where slug is not null`;

  // Audit: who last modified the row (created_by already exists).
  await sql`alter table users add column if not exists updated_by bigint references admins(id) on delete set null`;

  // Open-tracking: counters + timestamps per guest. A "visit" is landing on the
  // invitation via the guest's slug link; an "open" is pressing "Buka Undangan".
  // Both are recorded client-side (see /api/track), so bots/link-previews that
  // don't run JS mostly don't inflate them.
  await sql`alter table users add column if not exists visit_count int not null default 0`;
  await sql`alter table users add column if not exists open_count  int not null default 0`;
  await sql`alter table users add column if not exists first_visited_at timestamptz`;
  await sql`alter table users add column if not exists last_visited_at  timestamptz`;
  await sql`alter table users add column if not exists first_opened_at  timestamptz`;
  await sql`alter table users add column if not exists last_opened_at   timestamptz`;

  // Login throttle: per-IP failed-attempt counter + temporary lockout.
  await sql`
    create table if not exists login_attempts (
      ip           text        primary key,
      fails        int         not null default 0,
      locked_until timestamptz,
      updated_at   timestamptz not null default now()
    )
  `;

  const tables = await sql`
    select table_name from information_schema.tables
    where table_schema = 'public' and table_name in ('admins', 'users')
    order by table_name
  `;
  console.log("✓ Tables ready:", tables.map((t) => t.table_name).join(", "));

  const cols = await sql`
    select column_name, data_type from information_schema.columns
    where table_schema = 'public' and table_name = 'users'
    order by ordinal_position
  `;
  console.log("  users columns:", cols.map((c) => `${c.column_name}`).join(", "));
}

main().catch((e) => {
  console.error("✗ Migration failed:", e.message);
  process.exit(1);
});
