/**
 * Auth for the admin tool: scrypt password hashing + HMAC-signed session cookies.
 * Uses node:crypto (Vercel serverless Node runtime). Server-side only.
 */
import { randomBytes, scryptSync, timingSafeEqual, createHmac } from "node:crypto";

const SECRET = import.meta.env.SESSION_SECRET ?? process.env.SESSION_SECRET;
if (!SECRET) throw new Error("SESSION_SECRET is not set");

export const SESSION_COOKIE = "kirab_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// ─── password hashing (scrypt) ─────────────────────────────────────
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, salt, expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// Run a scrypt of equal cost when the username doesn't exist, so response time
// can't be used to enumerate valid admin usernames.
const DUMMY_HASH = hashPassword("timing-equalizer-please-ignore");
export function dummyVerify(password: string): void {
  verifyPassword(password, DUMMY_HASH);
}

// ─── signed session token ──────────────────────────────────────────
export type Session = { id: number; username: string; exp: number };

function sign(data: string): string {
  return createHmac("sha256", SECRET as string).update(data).digest("base64url");
}

export function createSessionToken(admin: { id: number; username: string }): string {
  const payload: Session = { id: admin.id, username: admin.username, exp: Math.floor(Date.now() / 1000) + MAX_AGE };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(token: string | undefined): Session | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const session = JSON.parse(Buffer.from(body, "base64url").toString()) as Session;
    if (session.exp < Math.floor(Date.now() / 1000)) return null;
    return session;
  } catch {
    return null;
  }
}

// ─── cookie helpers (Astro APIContext.cookies) ─────────────────────
type CookieJar = {
  get(name: string): { value: string } | undefined;
  set(name: string, value: string, opts?: Record<string, unknown>): void;
  delete(name: string, opts?: Record<string, unknown>): void;
};

export function setSessionCookie(cookies: CookieJar, token: string): void {
  cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function clearSessionCookie(cookies: CookieJar): void {
  cookies.delete(SESSION_COOKIE, { path: "/" });
}

/** Returns the session if the request carries a valid cookie, else null. */
export function getSession(cookies: CookieJar): Session | null {
  return verifySessionToken(cookies.get(SESSION_COOKIE)?.value);
}
