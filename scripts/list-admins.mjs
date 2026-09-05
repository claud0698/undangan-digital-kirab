/** List admin usernames (never hashes). Run: node --env-file=.env scripts/list-admins.mjs */
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
const rows = await sql`select username, created_at from admins order by created_at`;
for (const r of rows) console.log(`  ${r.username.padEnd(12)} ${new Date(r.created_at).toISOString().slice(0, 10)}`);
console.log(`  — ${rows.length} akun`);
