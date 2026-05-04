# Phase 3 Handoff

## Status: Complete

Both Phase 3 deliverables are done. The changes are uncommitted (see below). Phase 4 is the next session.

---

## What's done

### `components/SignalPanel.tsx` — new file (untracked, not yet committed)

Full implementation of the Signal Scanner panel. Everything in the Phase 3 spec is working:

- **Dataset switcher** — pill buttons populated directly from `SAMPLE_DATASETS` (see decision below). Selecting a new dataset clears any prior signals and error state.
- **Dataset preview table** — renders immediately on dataset select, before any AI call. Horizontally and vertically scrollable, capped at 400px height. Sticky thead. Alternating row stripes. "N rows" badge. Column headers auto-derived from row keys via camelCase → Title Case conversion. Smart cell formatter handles: ISO dates, booleans, `$` currency (per-unit and large integer variants), `%` rates, signed deltas (variance/trend), comma-separated integers, and generic decimals — all key-name-driven, no per-dataset configuration.
- **"Analyze with AI" button** — POSTs `{ datasetId }` to `/api/prioritize-signals`. Button disabled during loading.
- **Loading animation** — `ScanLoadingSkeleton` mirrors `OutputPanel`'s `LoadingSkeleton` exactly: bouncing dots, stage label with `fade-in-up` animation, 4 shimmer signal cards that progress active → done → pending at 1400ms intervals. The interval self-clears when the last stage is reached (not just capped).
- **Signal cards** — title, impact badge (red/amber/gray), reasoning, rank number. "Draft brief" button on each card.
- **"Draft brief" click** — calls `onDraftBrief(signal.suggestedContext)`, which in `page.tsx` sets the `idea` state and smooth-scrolls to the InputPanel container. Does **not** auto-generate the brief (see decision below).
- **Error state** — shown below the button if the API call fails.

### `app/page.tsx` — modified (unstaged)

- Imports `SignalPanel` and `useRef`.
- `handleDraftBrief(context: string)` — calls `setIdea(context)` and `briefPanelRef.current?.scrollIntoView(...)`.
- `SignalPanel` renders full-width above the two-column InputPanel/OutputPanel grid, inside `<main>`.
- The left column `<div>` (wrapping `InputPanel`) has `ref={briefPanelRef}` — this is the scroll target.
- No other changes to the existing InputPanel/OutputPanel layout.

---

## Files touched

| File | Status | Notes |
|------|--------|-------|
| `components/SignalPanel.tsx` | New, untracked | Full Phase 3 component |
| `app/page.tsx` | Modified, unstaged | SignalPanel wired in |

No other files were modified. `InputPanel.tsx`, `OutputPanel.tsx`, `lib/types.ts`, `lib/sampleData.ts`, and `app/api/prioritize-signals/route.ts` are all unchanged from their committed state.

---

## Decisions made

**`DATASETS` array removed — using `SAMPLE_DATASETS` directly.** The original implementation had a separate `DATASETS` constant in SignalPanel with UI-specific labels ("Logistics Exceptions", "Supplier Performance", "Menu Performance"). This was removed in favor of reading `SAMPLE_DATASETS` from `lib/sampleData.ts` directly. Consequence: pill button labels now use the dataset's `name` field as stored in sampleData, which is sentence-case ("Logistics exceptions", "Supplier performance", "Menu & SKU performance"). If you want title-case labels or different display names, add a `label` field to the `SignalDataset` type and sampleData entries rather than re-introducing a parallel array in SignalPanel.

**No auto-generate on "Draft brief".** Clicking "Draft brief" pre-fills the InputPanel textarea and scrolls to it, but does not trigger `handleGenerate()`. This is the recommendation from the rework plan ("require click — it makes the demo feel less magical-black-box"). The user sees the pre-filled text, then clicks "Generate First Move" themselves.

**State lift is already done.** `idea` state lives in `page.tsx` and is set via `handleDraftBrief`. Phase 4's "lift state to page.tsx" step is therefore already complete. The only remaining Phase 4 work is on the InputPanel side (see below).

---

## Where Phase 4 picks up

Phase 4 deliverable from the plan:
> InputPanel accepts an optional `prefilledContext` prop and seeds its textarea with it.

The state lift is done. What remains:

1. **`InputPanel.tsx`** — add an optional `prefilledContext?: string` prop. When truthy, the plan suggests visually signaling that the content was pre-filled (e.g., a subtle "from signal" label near the textarea, or a different border color). This is cosmetic — the textarea already shows the text because `idea` state is set in the parent. The prop is only needed if InputPanel should react differently when pre-filled vs. manually typed.

2. **Optional**: a "Clear" or "×" affordance on the pre-filled textarea so the user can dismiss it and go back to manual entry. Not in the Phase 4 spec but obvious UX.

3. **Do not** auto-generate on prefill unless the demo story changes. The current recommendation is to keep it as a visible handoff moment.

Phase 5 (landing copy, README) is completely untouched.

---

## Commit before starting Phase 4

Both changed files should be committed before the Phase 4 session:

```bash
git add components/SignalPanel.tsx app/page.tsx
git commit -m "phase 3: SignalPanel with dataset table and loading animation"
```
