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

/** Best-effort client IP from Vercel's forwarding headers. */
export function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  return (xff ? xff.split(",")[0].trim() : "") || "unknown";
}
