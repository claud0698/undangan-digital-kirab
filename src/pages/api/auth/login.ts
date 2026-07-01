import type { APIRoute } from "astro";
import { findAdminByUsername } from "~/lib/db";
import { verifyPassword, createSessionToken, setSessionCookie } from "~/lib/auth";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const username = String(form.get("username") ?? "").trim();
  const password = String(form.get("password") ?? "");

  const admin = username ? await findAdminByUsername(username) : null;
  if (!admin || !verifyPassword(password, admin.password_hash)) {
    return redirect("/admin?error=1", 303);
  }

  setSessionCookie(cookies, createSessionToken(admin));
  return redirect("/admin", 303);
};
