# FirstMove → Signal Rework Plan

## Goal

Evolve FirstMove from a one-shot brief generator into a two-step flow:
**signal → brief**. AI scans operational data, surfaces what needs attention,
and one click generates a delegatable brief for the flagged item.

Tailored for HelloFresh AI Operations & Automation Intern interview.
Demonstrates: AI prioritization over messy data, executive-grade output,
working product over slideware.

## Branding

Keep "FirstMove" as the product name. Preserve the punchy, exec-flavored
voice from the original — just shift the language from "ideas" to
"signal → action."

**Final copy:**

- **Hero:** Cut the noise. Make the first move.
- **Subhead:** For leaders who move fast.
- **Tagline:** Turn messy data into the next decision.
- **Description:** See what needs your attention. Decide what to do about it. In seconds.
- **Footer:** Built to explore how AI can compress the time between signal and action — for the leaders who can least afford to wait.

These should replace the equivalent strings throughout the app and README.
Anywhere the old copy used "idea" or "ideas," update to match the new framing.

## Scope (what's in / out)

**In scope:**
- New sample dataset(s) of HelloFresh-flavored operational data
- New API route: `/api/prioritize-signals` — Claude reads dataset, returns ranked items
- New component: `SignalPanel` — displays ranked signals with reasoning
- Wire signal click → pre-fill existing brief input → generate brief
- Dataset switcher (2-3 sample datasets to demonstrate flexibility)
- Updated README + landing copy with new branding above

**Out of scope (explicitly):**
- Real data ingestion (CSV upload, DB connection)
- Persistence (briefs still ephemeral)
- Authentication, user accounts
- Autonomous agents / scheduled checks
- Slack/email/Linear integrations
- Tests, linting (per existing CLAUDE.md)

## Phases

Each phase = one Claude Code session. `/clear` between phases.
Run `npm run build` at the end of each phase to catch type errors.

---

### Phase 1: Sample data + types (1-2 hrs)

**Deliverables:**
- `lib/sampleData.ts` exports 2-3 datasets as typed TS objects
- New types in `lib/types.ts` for dataset rows and signal output

**Dataset ideas (pick 2):**
1. **Logistics exceptions** — recent delivery failures by region, carrier, root cause, customer impact, $ impact
2. **Supplier performance** — lead time variance, quality issues, cost trends per ingredient/supplier
3. **Menu/SKU performance** — recipes with declining ratings, ingredient cost spikes, fulfillment difficulty

Each dataset: 15-30 rows, plausible numbers, mix of obvious-priority and subtle-priority items so AI ranking has something to do.

**Types to add:**
```ts
export type DatasetId = 'logistics' | 'suppliers' | 'menu';
export type SignalDataset = { id: DatasetId; name: string; description: string; rows: Record<string, unknown>[] };
export type Signal = { id: string; title: string; reasoning: string; impact: 'high' | 'medium' | 'low'; suggestedContext: string };
```

`suggestedContext` is the pre-filled text that gets passed to the brief generator when clicked.

---

### Phase 2: Prioritization API route (2-3 hrs)

**Deliverables:**
- `app/api/prioritize-signals/route.ts` — POST endpoint, takes `{ datasetId }`, returns `Signal[]`

**Implementation notes:**
- Copy structure from `app/api/generate-brief/route.ts`
- Call `enforceWafRateLimit` first (per existing convention)
- Use `claude-haiku-4-5-20251001` for speed (this isn't the heavy reasoning task)
- Prompt should: read the dataset, identify top 3-5 items by impact, return structured JSON with reasoning for each
- Use prompt engineering to ensure deterministic-ish output (low temperature, explicit JSON schema in prompt)

**Prompt outline:**
> You are an operations analyst for an executive office at a meal-kit company. Given the following operational data, identify the 3-5 items that most need executive attention this week, ranked by business impact. For each, explain why in one sentence. Output as JSON matching this schema: [...]

---

### Phase 3: SignalPanel component (2-3 hrs)

**Deliverables:**
- `components/SignalPanel.tsx` — new client component
- Updated `app/page.tsx` to render SignalPanel above InputPanel

**Behavior:**
- Dataset switcher at top (dropdown or pill buttons): "Logistics exceptions / Supplier performance / Menu performance"
- Below that: "Analyze with AI" button → calls `/api/prioritize-signals`
- Loading state while AI processes
- Result: list of 3-5 signal cards, each with title, impact badge, reasoning, and a "Draft brief" button
- Clicking "Draft brief" → pre-fills InputPanel textarea with `signal.suggestedContext` and triggers brief generation

**Styling:**
- Match existing sage palette
- Impact badges: high = red-ish but on-brand, medium = amber-ish, low = neutral
- Card layout consistent with existing components

---

### Phase 4: Wire signal → brief (1 hr)

**Deliverables:**
- State lifted to `app/page.tsx` so SignalPanel can pass context to InputPanel
- InputPanel accepts an optional `prefilledContext` prop and seeds its textarea with it
- Optional: auto-trigger brief generation when prefilled (or just leave the user to click Generate — simpler and more demo-able since it shows the existing flow)

**Decision point:** Auto-generate or require click? Recommend require click — it makes the demo feel less magical-black-box and more "look, the AI handed me the input, then I run it."

---

### Phase 5: Demo polish + README + landing copy (1-2 hrs)

**Deliverables:**
- Update all landing page copy with the new branding strings (Hero / Subhead / Tagline / Description / Footer above)
- Update README:
  - New tagline at top
  - "How it works" section reflects two-step flow (signal → brief)
  - "What's next" reads like a roadmap an Executive Office would care about: company-data ingestion, persistent signals, Slack handoff, calendar integration
- One pre-loaded "demo dataset" that's particularly compelling for an interview walkthrough — make sure the top-ranked signal is something a HelloFresh exec would immediately go "yeah, that one"
- Smoke-test the full flow end-to-end 3+ times

**README opening paragraph (suggested):**
> FirstMove turns operational signal into executive action. Point it at a dataset, and the AI surfaces what needs attention — ranked by impact, with reasoning you can challenge. One click turns any signal into a delegatable brief. Built to compress the time between "something's off" and "here's what we're doing about it."

---

## Demo flow (to practice before Tuesday)

1. **Open the app** — show the dataset switcher, briefly explain what each dataset represents
2. **Pick logistics exceptions** — click "Analyze with AI"
3. **AI returns 3-5 ranked signals** — read the top one's reasoning aloud
4. **Click "Draft brief" on the top signal** — show the input gets pre-filled
5. **Generate brief** — show the existing brief output
6. **Pivot to story:** "I started this as just the brief generator. After reading the JD and thinking about Brian and Nancy's world, I realized the harder problem isn't writing the brief — it's knowing *which* problem deserves a brief in the first place."
7. **Close with vision:** "If I were in this role, the next step is hooking this to real data — fulfillment records, supplier reports, whatever the office is already getting in their inbox — so the President's morning queue is just 'here are the 3 things only you can decide today.'"

## Token / context discipline reminder

- One phase per Claude Code session
- `/clear` between phases
- Stay under 60% context per session
- Use `/btw` for clarifying questions mid-task instead of polluting main thread
- Plan + iterate in chat (with me), execute in Code