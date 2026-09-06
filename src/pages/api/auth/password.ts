import type { APIRoute } from "astro";
import { getLiveSession, verifyPassword, hashPassword, createSessionToken, setSessionCookie, pwcOf } from "~/lib/auth";
import { getAdminPasswordHash, setAdminPassword, getAdminState, getLoginLock, recordLoginFail, resetLoginAttempts, throttleKeys } from "~/lib/db";
import { sameOrigin, getClientIp } from "~/lib/csrf";

export const prerender = false;

/** Shortest password we accept. Long enough to matter, short enough to be typed on a phone. */
const MIN_LENGTH = 8;
/**
 * scrypt's cost is fixed by N/r/p, not by input length — so this is not about
 * hashing cost. It is about not accepting a megabyte of request body, and
 * scryptSync blocks the event loop, so every wasted call stalls the lambda.
 * The login route applies the same cap for the same reason.
 */
const MAX_LENGTH = 200;

const fail = (error: string, status = 400) =>
  new Response(JSON.stringify({ ok: false, error }), {
    status,
    headers: { "content-type": "application/json" },
  });

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!sameOrigin(request)) return fail("Permintaan ditolak.", 403);

  const session = await getLiveSession(cookies);
  if (!session) return fail("Sesi berakhir. Silakan masuk lagi.", 401);

  // A wrong current password here is the same guessing game as the login form,
  // so it shares the same two-key throttle rather than being unlimited.
  const keys = throttleKeys(getClientIp(request), session.username);
  if (await getLoginLock(keys)) {
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
    await recordLoginFail(keys);
    return fail("Kata sandi lama salah.");
  }

  await setAdminPassword(session.id, hashPassword(next));
  await resetLoginAttempts(keys);

  // Every token carries the password_changed_at it was minted against, and
  // getLiveSession compares that to the database, so the change just invalidated
  // every other browser holding a cookie for this account — which is the whole
  // point of telling someone to change their password. This browser gets a fresh
  // one so the person doing it is not signed out by their own action.
  const state = await getAdminState(session.id);
  setSessionCookie(
    cookies,
    createSessionToken({ id: session.id, username: session.username }, pwcOf(state?.password_changed_at)),
  );

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};
