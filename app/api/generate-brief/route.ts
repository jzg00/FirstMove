import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { BriefOutput, IdeaType } from '@/lib/types'
import { enforceWafRateLimit } from '@/lib/wafRateLimit'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are FirstMove. Turn rough ideas into crisp exec briefs. Return ONLY a raw JSON object — no markdown fences, no commentary.

Schema:
{
  "coreProblem": "1–2 sentences. What is broken, why it costs the business.",
  "firstMove": ["string", "string", "string"],
  "nextSteps": ["string", "string", "string"],
  "risks": ["string", "string", "string"],
  "timeSaved": "string"
}

Rules:
- firstMove: exactly 3 items. Each is ONE direct sentence — the action, the owner, the deadline. No hedging.
- nextSteps: exactly 3 items. What happens after the first move lands. One sentence each.
- risks: exactly 3 items. Specific to this idea. One sentence each.
- timeSaved: one tight phrase, e.g. "3–5 hours per leader per week".
- Everything must be specific to the idea — no generic filler.
- Valid JSON only. No markdown.`

function ideaTypeLabel(ideaType: IdeaType): string {
  const labels: Record<IdeaType, string> = {
    product: 'Product Idea',
    operations: 'Operations Improvement',
    workflow: 'Workflow Redesign',
  }
  return labels[ideaType]
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'Server configuration error: API key not set.' },
      { status: 500 }
    )
  }

  const limited = await enforceWafRateLimit(req, [
    'VERCEL_WAF_RATE_LIMIT_ID_GENERATE',
    'VERCEL_WAF_RATE_LIMIT_ID',
  ])
  if (limited) return limited

  const body = await req.json()
  const idea: string = body.idea ?? ''
  const ideaType: IdeaType = body.ideaType ?? 'product'

  if (!idea.trim()) {
    return NextResponse.json({ error: 'Idea cannot be empty.' }, { status: 400 })
  }

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 4096,
      thinking: { type: 'adaptive' },
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
          content: `Idea Type: ${ideaTypeLabel(ideaType)}\n\nIdea:\n${idea.trim()}`,
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

    let parsed: BriefOutput
    try {
      parsed = JSON.parse(raw) as BriefOutput
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
      { error: 'Something went wrong generating your brief. Please try again.' },
      { status: 500 }
    )
  }
}
