/**
 * Create (or update the password of) an admin account.
 * Run:  node --env-file=.env scripts/create-admin.mjs <username> <password>
 */
import { neon } from "@neondatabase/serverless";
import { randomBytes, scryptSync } from "node:crypto";

const [, , usernameArg, password] = process.argv;
const username = String(usernameArg ?? "").trim().toLowerCase(); // usernames are case-insensitive → store lowercased
if (!username || !password) {
  console.error("Usage: node --env-file=.env scripts/create-admin.mjs <username> <password>");
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("✗ DATABASE_URL is not set.");
  process.exit(1);
}

function hashPassword(pw) {
  const salt = randomBytes(16);
  const hash = scryptSync(pw, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

const sql = neon(process.env.DATABASE_URL);
const password_hash = hashPassword(password);

const rows = await sql`
  insert into admins (username, password_hash)
  values (${username}, ${password_hash})
  on conflict (username) do update set password_hash = excluded.password_hash
  returning id, username, created_at
`;
console.log("✓ Admin ready:", rows[0]);
