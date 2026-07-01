import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://undangan-digital-kirab.liefisca.com",
  // Invitation pages stay prerendered/static (CDN-cached on Vercel).
  // Only /admin + /api/* opt into on-demand rendering via `export const prerender = false`.
  adapter: vercel(),
  // Astro's default origin check rejects form POSTs behind Vercel's proxy (its
  // perceived host differs from the request Origin). We disable it and instead
  // enforce our own Origin-vs-(x-forwarded-)host check in every state-changing
  // API handler (see src/lib/csrf.ts), backed by a SameSite=Lax httpOnly cookie.
  security: { checkOrigin: false },
  i18n: {
    defaultLocale: "id",
    locales: ["id", "en"],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "id",
        locales: { id: "id-ID", en: "en-US" },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    domains: [],
  },
  build: {
    inlineStylesheets: "auto",
  },
  compressHTML: true,
});
