import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://undangan-digital-kirab.liefisca.com",
  // Invitation pages stay prerendered/static (CDN-cached on Vercel).
  // Only /admin + /api/* opt into on-demand rendering via `export const prerender = false`.
  adapter: vercel(),
  // Astro's default origin check rejects form POSTs behind Vercel's proxy (the
  // perceived host differs from the request Origin). CSRF is instead handled by
  // our SameSite=Lax httpOnly session cookie + CORS on the JSON API.
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
