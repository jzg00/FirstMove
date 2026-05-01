import { checkRateLimit } from '@vercel/firewall'
import { NextRequest, NextResponse } from 'next/server'

function resolveRuleId(envKeys: string[]): string | null {
  for (const key of envKeys) {
    const value = process.env[key]
    if (value && value.trim()) return value.trim()
  }
  return null
}

export async function enforceWafRateLimit(
  req: NextRequest,
  envKeys: string[]
): Promise<NextResponse | null> {
  const ruleId = resolveRuleId(envKeys)
  if (!ruleId) return null

  try {
    const { rateLimited } = await checkRateLimit(ruleId, { request: req })
    if (rateLimited) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait and try again.' },
        { status: 429 }
      )
    }
  } catch (err) {
    // MVP-safe behavior: do not block valid traffic if WAF config is missing/misconfigured.
    console.error('WAF rate limit check failed:', err)
  }

  return null
}
