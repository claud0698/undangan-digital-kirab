# GEMINI.md

This file provides guidance to Google Antigravity / Gemini when working with code in this repository.

## Project Overview

Digital invitation website and guest management system for **Kirab Budaya & Ruwat Bumi 2026** (Memperingati Sejit YMS Tjie Thien Ta Sen & HUT Tjie Thien Ta Sen Bio yang ke-43 Tahun, 23–27 September 2026 / 13–17 Pwe Gwee 2577) organized by **Klenteng Tjie Thien Ta Sen Bio Tangerang** (齊天大聖廟).

- **Production URL**: `https://undangan-digital-kirab.liefisca.com`
- **Primary Language**: Indonesian (default at `/`) with English at (`/en/`)
- **Key Source of Truth**: Proposal PDF / `CONTENT.md` / `src/config/invitation.ts`

## Tech Stack & Architecture

- **Framework**: Astro 5 with hybrid rendering:
  - **Prerendered / Static**: Invitation pages (`/`, `/en/`) are prerendered and cached on Vercel's Edge/CDN.
  - **On-Demand / SSR**: `/admin`, `/api/*`, and `/undangan/[slug]` opt into server rendering via `export const prerender = false`.
- **Adapter**: `@astrojs/vercel`
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` plugin and scoped CSS variables.
- **Database**: Neon Serverless Postgres (`@neondatabase/serverless`) for guest list, admin users, categories, and RSVP/open tracking.
- **Typography**: Self-hosted web fonts (Cardo, Spectral, Ma Shan Zheng).
- **Media Optimization**: `sharp` for image processing and audio scripts for ambient music.

## Commands

- `npm install` — Install dependencies
- `npm run dev` — Start local dev server (default: `http://localhost:4321`)
- `npm run build` — Build project for production (`./dist`)
- `npm run preview` — Preview the local production build
- `npm run audio:optimize` — Optimize background audio files via `scripts/optimize-audio.mjs`

## Key Patterns & Code Conventions

### Content Management
- **Single Source of Truth**: All invitation copy, timeline/schedule, donation accounts, venue info, and committee contacts live in `src/config/invitation.ts`. Update this file directly for content updates.

### Admin & Security
- **Authentication**: Custom session management in `src/lib/auth.ts` using HMAC-signed HTTP-only cookies (`SESSION_SECRET`). Supports password change flow, onboarding guide walkthrough, and per-user tracking.
- **CSRF Protection**: Astro's native `checkOrigin` is set to `false` in `astro.config.mjs` to support Vercel proxying; instead, custom origin validation is enforced in `src/lib/csrf.ts` on all state-changing API endpoints.
- **Database Access**: Centralized queries in `src/lib/db.ts` using `@neondatabase/serverless`.

### Personalized Guest Routing & Tracking
- Guests receive vanity links like `/undangan/[slug]`.
- The slug is looked up in Neon Postgres via `getGuestBySlug()`.
- Redirects to `/?to=<name>&alamat=<address>&via=<slug>` to prefill greeting cards and track open events via `/api/track`.
- Three-state guest lifecycle: Unsent/Sent, Visited, and Opened (Cover Gate unlocked).

## Environment Variables

Defined in `.env` (see `.env.example`):
- `DATABASE_URL` — Neon Postgres pooled connection string (server-side only)
- `SESSION_SECRET` — Cryptographic secret for signing admin session cookies
- `PUBLIC_SCROLL_SPEED` — Auto-scroll drift speed on cover in px/second (default: `40`)

## Git & Contributor Guidelines

- **Personal Project**: Always use the personal Git identity:
  - Name: `claud0698`
  - Email: `claudio.aditya@gmail.com`
- Keep static assets optimized (compress images before dropping into `public/` or `assets/`).
