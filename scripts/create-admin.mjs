/**
 * Create an admin account, or set the password of an existing one.
 *   node --env-file=.env scripts/create-admin.mjs <username> <password>
 *   node --env-file=.env scripts/create-admin.mjs <username> <password> --no-prompt
 *
 * A password set here is one somebody else chose and has read, so by default
 * the account is flagged to be asked for a new one at its next sign-in, and
 * password_changed_at is cleared so the "still on the password you were given"
 * line shows. Both stop the moment the owner actually changes it.
 *
 * Pass --no-prompt only for an account that should not be asked.
 */
import { neon } from "@neondatabase/serverless";
import { randomBytes, scryptSync } from "node:crypto";

const [, , usernameArg, password, ...flags] = process.argv;
const askToChange = !flags.includes("--no-prompt");
const username = String(usernameArg ?? "").trim().toLowerCase(); // usernames are case-insensitive → store lowercased
if (!username || !password) {
  console.error("Usage: node --env-file=.env scripts/create-admin.mjs <username> <password> [--no-prompt]");
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
  insert into admins (username, password_hash, password_changed_at, password_change_required)
  values (${username}, ${password_hash}, null, ${askToChange})
  on conflict (username) do update set
    password_hash = excluded.password_hash,
    password_changed_at = null,
    password_change_required = ${askToChange}
  returning id, username, created_at
`;
console.log("✓ Admin ready:", rows[0]);
console.log(
  askToChange
    ? "  Will be asked to choose their own password at next sign-in."
    : "  Will NOT be asked to change it (--no-prompt).",
);
