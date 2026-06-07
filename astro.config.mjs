import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://undangan-digital-kirab.liefisca.com",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
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
