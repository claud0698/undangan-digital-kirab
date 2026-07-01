import type { APIRoute } from "astro";
import { clearSessionCookie } from "~/lib/auth";
import { sameOrigin } from "~/lib/csrf";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (!sameOrigin(request)) return redirect("/admin", 303);
  clearSessionCookie(cookies);
  return redirect("/admin", 303);
};
