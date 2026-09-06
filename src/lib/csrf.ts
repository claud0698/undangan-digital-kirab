/**
 * Same-origin check for state-changing requests. Astro's built-in
 * `security.checkOrigin` mis-detects the host behind Vercel's proxy, so we do
 * our own check against the public host (x-forwarded-host) here.
 */
function requestHost(request: Request): string | null {
  return request.headers.get("x-forwarded-host") ?? request.headers.get("host");
}

/** True only if the request's Origin (or Referer) host matches the served host. */
export function sameOrigin(request: Request): boolean {
  const host = requestHost(request);
  if (!host) return false;
  const src = request.headers.get("origin") ?? request.headers.get("referer");
  if (!src) return false;
  try {
    return new URL(src).host === host;
  } catch {
    return false;
  }
}

/**
 * Client IP from Vercel's forwarding headers.
 *
 * x-vercel-forwarded-for and x-real-ip are set by Vercel's proxy and cannot be
 * spoofed by the client. Plain x-forwarded-for can carry a client-supplied
 * prefix, so it is only a last resort — reading it first would have let anyone
 * mint a fresh throttle bucket per request and make the rate limit a no-op.
 */
export function getClientIp(request: Request): string {
  const h = request.headers;
  const trusted = h.get("x-vercel-forwarded-for") ?? h.get("x-real-ip");
  if (trusted?.trim()) return trusted.split(",")[0].trim();
  const xff = h.get("x-forwarded-for");
  return (xff ? xff.split(",")[0].trim() : "") || "unknown";
}
