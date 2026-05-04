import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { Signal, DatasetId } from '@/lib/types'
import { enforceWafRateLimit } from '@/lib/wafRateLimit'
import { getDataset } from '@/lib/sampleData'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are an operations analyst for an executive office at a meal-kit company. Your job is to read operational data and identify the items that most need executive attention this week.

Given a dataset, return the 3-5 highest-impact items, ranked by urgency and business impact. For each item, generate a suggestedContext — a 2-3 sentence operational briefing capturing the specific problem, the numbers, and why it matters. This text will be handed directly to an executive as the starting point for drafting a response brief.

Return ONLY a raw JSON array — no markdown fences, no commentary.

Schema (array of objects):
[
  {
    "id": "unique-kebab-case-id",
    "title": "Short title (5-8 words max)",
    "reasoning": "One sentence: what makes this the highest priority right now.",
    "impact": "high",
    "suggestedContext": "2-3 sentences describing the specific problem with numbers from the data. Frame it as an ops brief the executive will use to generate a response plan."
  }
]

Rules:
- Return 3-5 items only, ranked from highest to lowest impact.
- impact must be exactly "high", "medium", or "low" — no other values.
- Do not include items that are performing normally with no flags.
- Prioritize: sudden changes week-over-week, open escalations, approaching contract/deadline pressure, and issues that cascade (e.g. a supplier problem affecting many SKUs).
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
