/**
 * Turn the forced password change on or off for admin accounts.
 *
 *   node --env-file=.env scripts/require-password-change.mjs on  lukas bella
 *   node --env-file=.env scripts/require-password-change.mjs off claudio
 *   node --env-file=.env scripts/require-password-change.mjs list
 *
 * While the flag is on, the change-password box opens by itself every time that
 * account signs in. It is a prompt, not a lock: their existing password keeps
 * working, and "Nanti saja" postpones it to the next sign-in. Actually changing
 * the password clears the flag; nothing else does.
 */
import { neon } from "@neondatabase/serverless";

const [, , mode, ...names] = process.argv;
if (!process.env.DATABASE_URL) {
  console.error("✗ DATABASE_URL is not set.");
  process.exit(1);
}
if (!["on", "off", "list"].includes(mode ?? "")) {
  console.error("Usage: node --env-file=.env scripts/require-password-change.mjs <on|off|list> [username…]");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const show = async () => {
  const rows = await sql`
    select username, password_change_required, password_changed_at, last_login_at
    from admins order by id
  `;
  for (const r of rows) {
    console.log(
      `  ${r.username.padEnd(14)} ` +
        `${r.password_change_required ? "MUST CHANGE" : "free       "}  ` +
        `password:${r.password_changed_at ? "changed" : "initial"}  ` +
        `login:${r.last_login_at ? "yes" : "never"}`,
    );
  }
};

if (mode === "list") {
  await show();
  process.exit(0);
}

if (names.length === 0) {
  console.error("✗ Name at least one username.");
  process.exit(1);
}

const wanted = names.map((n) => n.trim().toLowerCase());
const updated = await sql`
  update admins set password_change_required = ${mode === "on"}
  where lower(username) = any(${wanted})
  returning username
`;

const missing = wanted.filter((w) => !updated.some((u) => u.username.toLowerCase() === w));
if (missing.length) console.error("✗ No such account:", missing.join(", "));
console.log(`✓ Forced change ${mode.toUpperCase()} for: ${updated.map((u) => u.username).join(", ") || "(none)"}\n`);
await show();
