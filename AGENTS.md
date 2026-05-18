# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠ Critical: Next.js version

This project uses **Next.js 16** (Turbopack default). It has breaking changes
from earlier versions — APIs, file conventions, and patterns differ from older
Next.js code you may have seen. Before writing any frontend code that touches
the framework (routing, server actions, image handling, params, headers/cookies,
config, fonts, scripts) — **read the relevant doc inside
`frontend/node_modules/next/dist/docs/`** to confirm the current API.

Notable Next.js 16 specifics already in use here:
- `params` and `searchParams` in pages are `Promise<...>` — always `await` them.
- `next/image` blocks private-IP sources; we use `images.unoptimized: true`.
- Built-in dev indicator is the floating "N" badge — disable in `next.config.ts`
  if not wanted.
- No client-side rendering by default; mark interactive components with `"use client"`.

If unsure, prefer reading docs over guessing — the answer is in the
`node_modules/next/dist/docs/` tree of the actual installed version.

## Project Overview

Virtual museum of Kutaisi — bilingual (Georgian `ka` / English `en`) web app with thematic rooms, artifact galleries, 360° turntable views, and an admin panel. Backend is Django REST Framework, frontend is Next.js 16 + TypeScript, all running in Docker.

## Running the Project

```bash
# Dev mode (Mac browser — hot reload, NOT for iOS testing)
docker compose up -d

# Production mode (phone/iOS testing)
docker compose -f docker-compose.yml up -d

# Rebuild after dependency or config changes
docker compose build backend   # or frontend
docker compose up -d
```

**Dev vs Production:** `docker-compose.override.yml` (git-ignored) overrides the frontend to `npm run dev`. The base `docker-compose.yml` always runs production (`npm run build && npm start`).

## Common Backend Commands

```bash
# Run migrations
docker compose run --rm backend python manage.py migrate

# Make migrations after model changes
docker compose run --rm backend python manage.py makemigrations exhibits

# Seed thematic rooms
docker compose run --rm backend python manage.py seed_rooms

# Seed Met Museum artifacts (requires internet)
docker compose run --rm backend python manage.py seed_met

# Import turntable frames for 360° view
docker compose run --rm backend python manage.py import_turntable
```

## Architecture

### Request Flow

Browser/phone → Next.js (port 3000) → rewrites `/api/*` and `/media/*` → Django (port 8000, internal Docker hostname `backend`) → PostgreSQL

`NEXT_PUBLIC_API_URL=/api` (relative) so API calls work from any host. `INTERNAL_API_URL=http://backend:8000/api` is used for SSR-only fetches. See `frontend/src/lib/api.ts` → `apiBase()`.

### Backend (`backend/`)

- **`exhibits/models.py`** — core models: `Period`, `Topic`, `Room`, `Artifact`, `ArtifactImage`, `ArtifactTurntableFrame`. All use `AutoSlugField(populate_from='_slug_source')` for automatic unique slug generation.
- **`exhibits/views.py`** — public read-only ViewSets + `Admin*` ViewSets (JWT-protected). Admin routes are under `/api/admin/`.
- **`accounts/authentication.py`** — `TokenVersionAuthentication` extends SimpleJWT to support token invalidation via a version counter per user. Always use this instead of plain JWT.
- **`config/settings.py`** — CORS origins and `ALLOWED_HOSTS` come from `.env` via `python-decouple`. JWT access token lifetime is 1 hour, refresh is 1 day with rotation.

### Frontend (`frontend/src/`)

- **`lib/api.ts`** — all public API fetches. `normalizeMediaUrls()` rewrites `http://backend:8000` → `""` (relative) so media URLs work in the browser.
- **`lib/auth.ts`** + **`lib/adminApi.ts`** — JWT login/refresh/logout and authenticated admin fetch wrapper with automatic token refresh on 401.
- **`lib/translations.ts`** — all UI strings in `en` and `ka`. Pass `lang` prop down and use `translations[lang]`.
- **`lib/categories.ts`** — `ARTIFACT_CATEGORIES` with both `label` (English) and `label_ka` (Georgian). Use `lang === "ka" ? c.label_ka : c.label` when rendering.
- **`app/`** — Next.js App Router. Pages are server components that fetch data then pass to `*Client.tsx` client components for interactivity.

### Bilingual Pattern

Every user-facing string uses `translations[lang]`. Language comes from the URL (`?lang=ka`) or a `LanguageSwitcher` component. Period names fall back to `era_display` (date range) when `name_ka` is empty.

## Environment

Backend `.env` (at `backend/.env`, git-ignored):
```
ALLOWED_HOSTS=localhost,127.0.0.1,backend,<your-local-ip>
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://<your-local-ip>:3000
```
Update the IP here when your network changes — no code changes needed.

## Known iOS Constraint

Next.js dev mode uses Turbopack which calls `crypto.randomUUID()` — requires HTTPS. On iOS over plain HTTP, React never hydrates and buttons don't work. Always use production mode for phone testing.
