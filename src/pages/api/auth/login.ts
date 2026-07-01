import type { APIRoute } from "astro";
import { findAdminByUsername, getLoginLock, recordLoginFail, resetLoginAttempts } from "~/lib/db";
import { verifyPassword, createSessionToken, setSessionCookie, dummyVerify } from "~/lib/auth";
import { sameOrigin, getClientIp } from "~/lib/csrf";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (!sameOrigin(request)) return redirect("/admin?error=1", 303);

  const ip = getClientIp(request);
  const lock = await getLoginLock(ip);
  if (lock?.locked_until && new Date(lock.locked_until).getTime() > Date.now()) {
    return redirect("/admin?error=locked", 303);
  }

  const form = await request.formData();
  const username = String(form.get("username") ?? "").trim();
  const password = String(form.get("password") ?? "");

  const admin = username ? await findAdminByUsername(username) : null;
  if (!admin || !verifyPassword(password, admin.password_hash)) {
    if (!admin) dummyVerify(password); // equalize timing → no username enumeration
    await recordLoginFail(ip);
    return redirect("/admin?error=1", 303);
  }

  await resetLoginAttempts(ip);
  setSessionCookie(cookies, createSessionToken(admin));
  return redirect("/admin", 303);
};
