import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { BriefType } from '@/lib/types'
import { enforceWafRateLimit } from '@/lib/wafRateLimit'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SECTION_LABELS: Record<string, string> = {
  firstMove: 'First Move — a concrete action to take this week (one sentence: action, owner, deadline)',
  nextSteps: 'Next Steps — a follow-up action after the first move lands (one sentence)',
  risks: 'Risks & Tradeoffs — a specific risk or tradeoff to watch for (one sentence)',
}

const BRIEF_TYPE_LABELS: Record<BriefType, string> = {
  product: 'Product Brief',
  operations: 'Operational Risk',
  workflow: 'Process Issue',
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'API key not set.' }, { status: 500 })
  }

  const limited = await enforceWafRateLimit(req, [
    'VERCEL_WAF_RATE_LIMIT_ID_RELOAD',
    'VERCEL_WAF_RATE_LIMIT_ID',
  ])
  if (limited) return limited

  const body = await req.json()
  const { section, briefType, contextText, currentText, existingItems, mode = 'replace' } = body

  if (!section || !contextText?.trim()) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  const sectionLabel = SECTION_LABELS[section] ?? section
  const briefLabel = BRIEF_TYPE_LABELS[briefType as BriefType] ?? briefType
  const others = Array.isArray(existingItems) && existingItems.length > 0
    ? `\nExisting items in this section (do not duplicate):\n${existingItems.map((t: string) => `- ${t}`).join('\n')}`
    : ''

  const prompt = mode === 'add'
    ? `Write ONE new item for the "${sectionLabel}" section of an exec brief.

Brief type: ${briefLabel}
Situation: ${contextText}${others}

Return ONLY the text — no bullet, no numbering, no quotes, no explanation.`
    : `Replace one item in an exec brief.

Brief type: ${briefLabel}
Situation: ${contextText}

Section: ${sectionLabel}
Replace this: ${currentText}${others}

Write ONE replacement. Match the directness and length. Return ONLY the text — no bullet, no numbering, no quotes, no explanation.`

  try {
    // Use Haiku for speed — this is a single-item replacement, not a full brief
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }],
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No response from AI.' }, { status: 500 })
    }

    const suggestion = textBlock.text.trim().replace(/^[-•*]\s*/, '').replace(/^["']|["']$/g, '')
    return NextResponse.json({ suggestion })
  } catch (err) {
    console.error('Reload suggestion error:', err)
    return NextResponse.json({ error: 'Failed to generate suggestion.' }, { status: 500 })
  }
}
