import type { APIRoute } from "astro";
import { getLiveSession } from "~/lib/auth";
import { markAdminOnboarded } from "~/lib/db";
import { sameOrigin } from "~/lib/csrf";

export const prerender = false;

/**
 * Marks the walkthrough as done. Sent both when it is finished and when it is
 * skipped — either way the admin has seen it and it should stop opening itself.
 * The guide stays reachable from the "Panduan" button afterwards.
 */
export const POST: APIRoute = async ({ request, cookies }) => {
  if (!sameOrigin(request)) return new Response("forbidden", { status: 403 });

  const session = await getLiveSession(cookies);
  if (!session) return new Response("unauthorized", { status: 401 });

  await markAdminOnboarded(session.id);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};
