import type { APIRoute } from "astro";
import { getSession, verifyPassword, hashPassword, createSessionToken, setSessionCookie } from "~/lib/auth";
import { getAdminPasswordHash, setAdminPassword, getLoginLock, recordLoginFail, resetLoginAttempts } from "~/lib/db";
import { sameOrigin, getClientIp } from "~/lib/csrf";

export const prerender = false;

/** Shortest password we accept. Long enough to matter, short enough to be typed on a phone. */
const MIN_LENGTH = 8;
/** scrypt cost scales with input, so refuse anything absurd rather than hashing it. */
const MAX_LENGTH = 200;

const fail = (error: string, status = 400) =>
  new Response(JSON.stringify({ ok: false, error }), {
    status,
    headers: { "content-type": "application/json" },
  });

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!sameOrigin(request)) return fail("Permintaan ditolak.", 403);

  const session = getSession(cookies);
  if (!session) return fail("Sesi berakhir. Silakan masuk lagi.", 401);

  // A wrong current password here is the same guessing game as the login form,
  // so it goes through the same per-IP throttle rather than being unlimited.
  const ip = getClientIp(request);
  const lock = await getLoginLock(ip);
  if (lock?.locked_until && new Date(lock.locked_until).getTime() > Date.now()) {
    return fail("Terlalu banyak percobaan. Coba lagi dalam beberapa menit.", 429);
  }

  let body: { current?: unknown; next?: unknown; confirm?: unknown };
  try {
    body = await request.json();
  } catch {
    return fail("Permintaan tidak terbaca.");
  }

  const current = typeof body.current === "string" ? body.current : "";
  const next = typeof body.next === "string" ? body.next : "";
  const confirm = typeof body.confirm === "string" ? body.confirm : "";

  if (!current || !next || !confirm) return fail("Semua kolom wajib diisi.");
  if (next.length > MAX_LENGTH || current.length > MAX_LENGTH) return fail("Kata sandi terlalu panjang.");
  if (next.length < MIN_LENGTH) return fail(`Kata sandi baru minimal ${MIN_LENGTH} karakter.`);
  if (next !== confirm) return fail("Konfirmasi kata sandi tidak cocok.");
  if (next === current) return fail("Kata sandi baru harus berbeda dari yang lama.");

  const stored = await getAdminPasswordHash(session.id);
  if (!stored) return fail("Akun tidak ditemukan.", 401);

  if (!verifyPassword(current, stored)) {
    await recordLoginFail(ip);
    return fail("Kata sandi lama salah.");
  }

  await setAdminPassword(session.id, hashPassword(next));
  await resetLoginAttempts(ip);

  // Sessions are stateless HMAC tokens, so changing the password cannot revoke
  // the ones already handed out — they stay valid until they expire. Re-issuing
  // this browser's cookie at least resets its 7 days from the change, and keeps
  // the admin signed in instead of bouncing them to the login screen.
  setSessionCookie(cookies, createSessionToken({ id: session.id, username: session.username }));

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};
