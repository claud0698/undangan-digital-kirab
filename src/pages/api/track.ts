import type { APIRoute } from "astro";
import { recordEvent } from "~/lib/db";
import { sameOrigin } from "~/lib/csrf";
import { isValidSlug } from "~/lib/slug";

export const prerender = false;

/**
 * Public open-tracking beacon. The invitation cover posts here on page load
 * ("visit") and when "Buka Undangan" is pressed ("open"), identifying the guest
 * by their slug (carried through the /undangan/<slug> redirect as ?via=).
 *
 * Always replies 204 so navigator.sendBeacon never surfaces an error. Best-effort
 * same-origin check keeps casual cross-site abuse out; it is not authenticated.
 */
export const POST: APIRoute = async ({ request }) => {
  const noop = new Response(null, { status: 204 });
  if (!sameOrigin(request)) return noop;

  const body = await request.json().catch(() => ({}));
  const via = String(body?.via ?? "").trim().toLowerCase();
  const type = body?.type === "open" ? "open" : "visit";
  if (!via || !isValidSlug(via)) return noop;

  await recordEvent(via, type).catch(() => {});
  return noop;
};
