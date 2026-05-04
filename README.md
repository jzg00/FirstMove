# FirstMove

**Turn operational signals into decisions — before they become crises.**

FirstMove is a predictive operations cockpit. It ingests operational data alongside external signals — weather forecasts, commodity moves, demand-side trends — and surfaces what is most likely to escalate in the next 7-14 days. One click turns any flagged risk into a delegatable executive brief.

---

## The problem it solves

Most operational fires aren't surprises in retrospect. The signal was in the data — a delivery hub already running 2x its normal failure rate, a supplier whose lead time was creeping up, a category whose search interest was cooling — and there was usually an external signal pointing the same direction days or weeks before it broke. What's missing isn't the data. It's the orchestration: somebody, or something, asking *which of these signals are about to compound, and which decision do I need to make this week to get ahead of it?*

FirstMove is that orchestration layer. It reads internal performance data and external signals together, prioritizes the items most likely to escalate, and hands the executive a brief — problem, first move, next steps, risks — they can run with or delegate immediately.

---

## How it works

1. **Pick a dataset** — Delivery Risk Forecast, Procurement Risk Outlook, or Demand Signal Watch. Each pairs internal operating metrics with a column of external signals.
2. **Analyze with AI** — FirstMove reads the rows and ranks the 3-5 items most likely to escalate in the next 7-14 days, weighting compounding risk: a weak internal metric *and* a concerning external signal pointing the same direction.
3. **Review the signals** — each card explains the forward-looking risk, references the specific numbers, and names the external signal that's pulling it forward.
4. **Draft a brief** — one click pre-fills the brief generator with the operational context for that signal. Generate to get a focused executive brief:
   - **Core Problem** — sharp framing of what's about to break and why it costs the business
   - **First Move** — concrete actions to take this week, not a roadmap for the quarter
   - **Next Steps** — what comes after the first move lands
   - **Risks & Tradeoffs** — what's most likely to go wrong, called out early
5. **Make it yours** — every section is editable: rewrite, swap with an AI alternative, remove, or add. The output adapts to executive judgment, not the other way around.
6. **Share** — copy as Markdown or plain text, send via email, or download as a `.txt` file. Drop it in a Slack message, a meeting doc, or a leadership update.

---

## What's next

FirstMove is an MVP. The signal → brief loop works on sample data. The next step is wiring the signal side to live sources so the morning queue is real:

**Real internal data sources**
Connect directly to fulfillment systems, supplier dashboards, and menu/SKU performance feeds. The current sample datasets are stand-ins for what should be a continuous read of the operational systems leadership already trusts.

**External signal integrations**
The leading-indicator side is where the predictive value lives. Production-grade signals would include:
- **Weather APIs** (NOAA, OpenWeather, Tomorrow.io) — heat domes, storm systems, hurricanes feeding into delivery and cold-chain risk forecasts
- **Commodity and futures feeds** (USDA, CME, Mintec) — protein, grain, dairy, and produce price moves feeding procurement risk outlooks
- **Demand trend signals** (Google Trends, search APIs, retail intelligence) — category-level interest curves feeding menu and SKU forecasts
- **Social listening** (Brandwatch, Sprout, Reddit/TikTok APIs) — sentiment shifts and viral mentions feeding both demand and brand-risk signals

**Persistent signal history and handoff**
Today every scan is ephemeral. Persistent signals would let leadership track which forecasts played out, tune the prioritizer over time, and create accountability — every flagged signal goes somewhere (Slack thread, Linear ticket, calendar block) instead of evaporating when the tab closes.

**Adapt to the operation it's reading**
A delivery escalation means something different at a 10-person logistics startup than at a company running thousands of routes a day. With company context — team structure, tools, known constraints, past decisions — both the signal prioritization and the briefs stop feeling generic and start sounding like they were written by someone who knows the operation.

---

*Built to explore how AI can reduce the gap between signal and action — for the leaders who can least afford to wait.*
