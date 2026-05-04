# CLAUDE.md

## Commands

```bash
npm install      # install dependencies
npm run dev      # dev server (port 3000, auto-increments on conflict)
npm run build    # production build — also the TypeScript type-check gate
npm run start    # serve the production build
```

No tests, no linter. `npm run build` is the only correctness gate.

## Tech stack

- **Framework**: Next.js 14 App Router (`app/` directory only — no `pages/`)
- **Language**: TypeScript 5, React 18
- **Styling**: Tailwind v3, custom `sage-50`–`sage-900` palette, background `#F5F3EE`
- **AI**: `@anthropic-ai/sdk` — generate-brief uses `claude-opus-4-7` with adaptive thinking; reload-suggestion uses `claude-haiku-4-5-20251001`
- **Rate limiting**: `@vercel/firewall` via `lib/wafRateLimit.ts`; silently skips locally when env vars are absent
- **Package manager**: npm

## Project structure

```
app/                  Next.js routes — page.tsx (root), api/generate-brief/, api/reload-suggestion/
components/           React components — InputPanel.tsx, OutputPanel.tsx
lib/                  Shared code — types.ts (shared types), wafRateLimit.ts (rate limit helper)
```

## Conventions

**Imports**: use the `@/` alias for all internal imports (e.g. `@/lib/types`, `@/components/InputPanel`).

**Exports**: default exports for components and pages; named exports for everything in `lib/`.

**Client components**: mark with `'use client'` as the first line.

**API routes**: call `enforceWafRateLimit` before any other processing; return `NextResponse.json({ error: '...' }, { status: N })` for errors.

**OutputPanel item keys**: originals are `${section}-${i}`, user-added are `${section}-add-${i}`. `getItems()` composes live state for serialization.

**`BriefOutput` field names** match the API JSON exactly: `coreProblem`, `firstMove`, `nextSteps`, `risks`, `timeSaved`. `firstMove` is an array despite the singular name.

## Things to avoid

- Don't create anything under `pages/` — this project is App Router only.
- Don't add a default export to `lib/` files.
- Don't omit `enforceWafRateLimit` when adding new API routes.
- Don't add ESLint or test infrastructure — there is none by design.

## Environment variables

```
ANTHROPIC_API_KEY=...

# Optional — Vercel WAF rule IDs for rate limiting (omit locally)
VERCEL_WAF_RATE_LIMIT_ID_GENERATE=...
VERCEL_WAF_RATE_LIMIT_ID_RELOAD=...
VERCEL_WAF_RATE_LIMIT_ID=...
```
