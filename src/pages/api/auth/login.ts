import type { APIRoute } from "astro";
import {
  findAdminByUsername, getLoginLock, recordLoginFail, resetLoginAttempts,
  markAdminLogin, getAdminState, throttleKeys,
} from "~/lib/db";
import { verifyPassword, createSessionToken, setSessionCookie, dummyVerify, pwcOf } from "~/lib/auth";
import { sameOrigin, getClientIp } from "~/lib/csrf";

export const prerender = false;

/** Refuse absurd input before spending a ~100ms blocking scrypt on it. */
const MAX_LENGTH = 200;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (!sameOrigin(request)) return redirect("/admin?error=1", 303);

  const form = await request.formData();
  const username = String(form.get("username") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (password.length > MAX_LENGTH || username.length > MAX_LENGTH) {
    return redirect("/admin?error=1", 303);
  }

  // Counted against the source IP and the account being tried. The account key
  // is the one that bites: an IP-only counter was cleared by any successful
  // login, so one valid credential bought unlimited guesses at everyone else.
  const keys = throttleKeys(getClientIp(request), username);
  const lock = await getLoginLock(keys);
  if (lock) return redirect("/admin?error=locked", 303);

  const admin = username ? await findAdminByUsername(username) : null;
  if (!admin || !verifyPassword(password, admin.password_hash)) {
    if (!admin) dummyVerify(password); // equalize timing → no username enumeration
    const nowLocked = await recordLoginFail(keys);
    return redirect(nowLocked ? "/admin?error=locked" : "/admin?error=1", 303);
  }

  await resetLoginAttempts(keys);
  await markAdminLogin(admin.id);
  const state = await getAdminState(admin.id);
  setSessionCookie(cookies, createSessionToken(admin, pwcOf(state?.password_changed_at)));
  return redirect("/admin", 303);
};
