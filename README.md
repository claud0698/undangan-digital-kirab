# Undangan Digital Kirab — Klenteng Hian Thian Siang Tee Welahan

Static digital invitation for the Kirab HUT Paduka YM Kongco Hian Thian Siang Tee Welahan, 17–19 April 2026 (Sa Gwee 01–03 / Imlek 2577).

## Stack

- **Astro 5** (static, ~zero JS by default)
- **Tailwind v4** (via Vite plugin) + CSS variables
- **Self-hosted Google Fonts** (Cardo, Spectral, Ma Shan Zheng)
- Bilingual ID (default) / EN (`/en/`)

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs ./dist
npm run preview
```

Deploy `./dist` to **Cloudflare Pages** or **Vercel** — static, no backend needed.

## Editing content

All copy, schedule, donations, and contact details live in **`src/config/invitation.ts`**. Edit there, rebuild, redeploy.

To add a Google Maps embed: paste the iframe `src` URL into `invitation.venue.embedUrl`.

## Gallery

Drop `.jpeg` images into `public/gallery/` named `01.jpeg`, `02.jpeg`, … Currently using temple photos copied from `/assets`.

## Phase 2 (not in this MVP)

- Per-guest personalized links via `?to=` query param
- Background audio toggle
- Admin / RSVP integration (would require a backend)
