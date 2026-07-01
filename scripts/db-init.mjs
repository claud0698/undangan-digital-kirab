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
