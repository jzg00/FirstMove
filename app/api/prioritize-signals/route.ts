import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { Signal, DatasetId } from '@/lib/types'
import { enforceWafRateLimit } from '@/lib/wafRateLimit'
import { getDataset } from '@/lib/sampleData'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are a predictive operations analyst for the executive office of a meal-kit company. Your job is not just to flag what is broken right now — it is to identify what is most likely to escalate into a crisis in the next 7-14 days, so leadership can act before it becomes one.

Each row pairs internal operating metrics with at least one external signal field (e.g. weatherSignal, marketSignal, demandSignal). External signals are leading indicators: weather forecasts, commodity moves, demand-side trends. Treat them as first-class inputs, not background context. The most dangerous items are usually the ones where a weak internal metric is compounding with a concerning external signal — that combination is what tells you something is about to break.

Given a dataset, return the 3-5 items most likely to escalate, ranked by forward-looking business risk. For each item, generate a suggestedContext — a 2-3 sentence operational briefing that names the internal metric, the external signal, the compounding effect, and the window in which a decision needs to be made. This text will be handed directly to an executive as the starting point for drafting a response brief.

Return ONLY a raw JSON array — no markdown fences, no commentary.

Schema (array of objects):
[
  {
    "id": "unique-kebab-case-id",
    "title": "Short title (5-8 words max)",
    "reasoning": "One sentence: what is likely to escalate in the next 7-14 days, and why — reference both the internal metric and the external signal where applicable.",
    "impact": "high",
    "suggestedContext": "2-3 sentences. Name the internal metric (with numbers), the external signal driving compounding risk, and what decision/action window the executive is operating in."
  }
]

Rules:
- Return 3-5 items only, ranked from highest to lowest forward-looking risk.
- impact must be exactly "high", "medium", or "low" — no other values.
- Do not include items that are stable on both internal metrics and external signals.
- Prioritize compounding risk: weak/declining internal metric AND a concerning external signal pointing to escalation. Pure internal noise without external pressure ranks lower.
- Also weigh: sudden changes week-over-week, open escalations, approaching contract/deadline pressure, and issues that cascade across many SKUs/regions/customers.
- reasoning and suggestedContext must reference the external signal field by content (not by field name) wherever one is contributing to the risk.
- suggestedContext must include specific numbers from the data (rates, costs, volumes, counts). No vague language.
- Valid JSON array only. No markdown.`

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'Server configuration error: API key not set.' },
      { status: 500 }
    )
  }

  const limited = await enforceWafRateLimit(req, [
    'VERCEL_WAF_RATE_LIMIT_ID_RELOAD',
    'VERCEL_WAF_RATE_LIMIT_ID',
  ])
  if (limited) return limited

  const body = await req.json()
  const datasetId: DatasetId = body.datasetId

  if (!datasetId) {
    return NextResponse.json({ error: 'datasetId is required.' }, { status: 400 })
  }

  const dataset = getDataset(datasetId)
  if (!dataset) {
    return NextResponse.json({ error: 'Unknown dataset.' }, { status: 400 })
  }

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      temperature: 0,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Dataset: ${dataset.name}\nDescription: ${dataset.description}\n\nData:\n${JSON.stringify(dataset.rows, null, 2)}`,
        },
      ],
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json(
        { error: 'No text response from AI. Please try again.' },
        { status: 500 }
      )
    }

    // Strip markdown fences Claude occasionally adds despite instructions
    const raw = textBlock.text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

    let parsed: Signal[]
    try {
      parsed = JSON.parse(raw) as Signal[]
    } catch {
      return NextResponse.json(
        { error: 'AI returned an unexpected format. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(parsed)
  } catch (err) {
    console.error('Anthropic API error:', err)
    return NextResponse.json(
      { error: 'Something went wrong analyzing the data. Please try again.' },
      { status: 500 }
    )
  }
}
