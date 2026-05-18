<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Frontend (Next.js 16) — Local Conventions

Guidance specific to `frontend/`. Root `AGENTS.md` has project-wide context.

## Folder layout

```
src/
├── app/                          Next.js pages — thin: fetch + compose only
│   ├── page.tsx                          Home (rooms grid)
│   ├── rooms/[slug]/page.tsx             Room detail
│   ├── artifacts/page.tsx                All artifacts (paginated, filtered)
│   └── artifacts/[slug]/page.tsx         Artifact detail (360°)
├── components/
│   ├── artifact/                 ArtifactCard, TurntableViewer, AudioGuide, …
│   ├── room/                     RoomCard
│   └── ui/                       BackLink, Pagination, EmptyState, SectionLabel
└── lib/
    ├── api.ts                    Public DRF fetchers
    ├── adminApi.ts               JWT-authenticated admin fetchers
    ├── auth.ts                   Login / refresh / logout
    ├── lang.ts                   getLang() + pick()
    ├── translations.ts           UI strings (en + ka) + localizeEra()
    ├── categories.ts             ARTIFACT_CATEGORIES — mirrors backend enum
    └── types.ts                  TS shapes mirroring DRF serializers
```

## Patterns to follow

### Pages stay thin

Page files **only fetch data and compose components**. No JSX logic, no inline
helper components. If you need a helper, extract it under `components/`.

### Server-first components

Components are server components by default. Add `"use client"` **only** when
you need:
- event handlers (`onClick`, `onChange`, …)
- React hooks (`useState`, `useEffect`, …)
- browser APIs (`window`, `localStorage`)

If a page needs interactivity in only part of the tree, keep the page server
and pass data into a `*Client.tsx` child (e.g. `RoomDetailClient.tsx`).

### Async params

In Next 16, `params` and `searchParams` are `Promise<…>`. Always `await`:

```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // …
}
```

### Bilingual everywhere

- Get language: `const lang = await getLang();`
- Pick localized value: `pick(lang, artifact.name_en, artifact.name_ka)`
- UI strings: `translations[lang].searchPlaceholder`
- Era dates: `localizeEra(period.era_display, lang)`
- **Never hardcode user-visible English/Georgian** — always go through `translations.ts`.

### Filters and pagination live in URL

Filter/search state belongs in `searchParams`, not React state. Forms are
plain `<form method="get">` so submitting navigates and the page refetches.
This makes every filtered view deep-linkable and shareable.

Pagination component preserves the rest of the query string via `preserveParams`.

### API client conventions

- Public reads → `lib/api.ts` (`fetchRooms`, `fetchArtifact`, `fetchArtifactsPage`, …)
- Authenticated admin writes → `lib/adminApi.ts` (handles JWT + auto-refresh on 401)
- All fetchers return typed data; types come from `lib/types.ts`.
- Image URLs are normalized inside `getJSON()` — never paste raw `http://backend:8000` URLs into `<Image>`.

### Mirror backend changes

When the backend adds a model field, choice, or endpoint:
1. Update `lib/types.ts` to match the serializer
2. Update `lib/categories.ts` if `Artifact.CATEGORY_CHOICES` changed
3. Add the matching `tr` key in both `en` and `ka` blocks of `translations.ts`

### Image handling

- `next.config.ts` sets `images.unoptimized: true` — Next 16 blocks private-IP
  fetches (localhost), and we need media from Django at `localhost:8000`.
- Use `<Image>` for static layout sizing (fill, sizes), but optimization is off.
- For production: swap to a CDN and re-enable optimization.

## Things to avoid

- ❌ Page files with helper components inlined → move them to `components/`
- ❌ Hardcoded strings in JSX → use `translations[lang]`
- ❌ React state for filters/search/pagination → use URL params
- ❌ Mixing API URLs (`http://backend:8000` in browser code) → use the api.ts client
- ❌ Adding npm deps without checking impact on Docker build cache
- ❌ Editing the auto-managed block at the top of this file
