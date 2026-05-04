'use client'

import { useEffect, useRef } from 'react'
import { BriefType } from '@/lib/types'

const BRIEF_TYPES: { value: BriefType; label: string }[] = [
  { value: 'product', label: 'Product Brief' },
  { value: 'operations', label: 'Operational Risk' },
  { value: 'workflow', label: 'Process Issue' },
]

const EXAMPLES: Record<BriefType, { label: string; text: string }[]> = {
  product: [
    {
      label: 'Late Delivery Alerts',
      text: "Delivery failure rates are spiking in three regions and customers aren't getting actionable alerts. They're going straight to support instead of taking self-serve action. We need a proactive alert system that tells them exactly what's happening and what they can do about it.",
    },
    {
      label: 'Stockout Handling',
      text: "Key ingredients are running out almost every week. The ops team is manually emailing customers with substitution options and it's not scaling. Ratings are starting to slip. We need a self-serve flow that lets customers act before they escalate.",
    },
    {
      label: 'Demand Forecasting',
      text: "Production planning is spreadsheet + gut instinct. We're over/underproducing across different weeks and waste is creeping up. We can't scale to new cities with this. We need real forecasting before Q3 expansion.",
    },
  ],
  operations: [
    {
      label: 'Refund Bottleneck',
      text: "Customer refund requests hit three different teams depending on the issue type and take 6 days to resolve on average. CSAT is dropping and there's no consistent process. It's becoming a retention problem.",
    },
    {
      label: 'Warehouse Slowdown',
      text: "Pick-and-pack speed crashes 40% every Monday because of how we schedule weekend restocks. The whole line backs up and we miss morning delivery windows. We've known for months and haven't fixed it.",
    },
    {
      label: 'Driver Onboarding',
      text: "We're onboarding 20+ drivers a month but the process takes 2 weeks and requires manual sign-off from 4 people. About half drop off before their first delivery. We're losing already-vetted candidates.",
    },
  ],
  workflow: [
    {
      label: 'Delivery Escalations',
      text: "When deliveries fail — late, missing, damaged — drivers, support, and ops all handle it differently. Some customers wait 3 days for a response. We don't have one escalation path that everyone actually follows.",
    },
    {
      label: 'New Market Launch',
      text: "Every time we launch in a new city it takes 5 months and feels completely chaotic. We repeat the same mistakes and miss the same setup steps. We need a repeatable playbook with clear owners before the next launch.",
    },
    {
      label: 'Menu Change Process',
      text: "Updating a single menu item takes 8 weeks across 6 teams, and half that time is waiting on approvals. We need to get it under 3 weeks without cutting corners on food safety.",
    },
  ],
}

interface InputPanelProps {
  context: string
  briefType: BriefType
  loading: boolean
  prefilledContext?: string | null
  onContextChange: (val: string) => void
  onTypeChange: (val: BriefType) => void
  onSubmit: () => void
}

export default function InputPanel({
  context,
  briefType,
  loading,
  prefilledContext,
  onContextChange,
  onTypeChange,
  onSubmit,
}: InputPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const examples = EXAMPLES[briefType]

  useEffect(() => {
    if (!prefilledContext) return
    onContextChange(prefilledContext)
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [prefilledContext])

  return (
    <div ref={containerRef} className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Generate a brief
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Describe the situation that needs attention. We'll turn it into an action plan.
        </p>
      </div>

      {/* Brief Type */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Brief Type
        </label>
        <div className="flex gap-2 flex-wrap">
          {BRIEF_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => onTypeChange(t.value)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                briefType === t.value
                  ? 'bg-sage-600 text-white border-sage-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-sage-400 hover:text-sage-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Textarea + primary CTA */}
      <div className="flex flex-col gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Situation
          </label>
          <textarea
            value={context}
            onChange={(e) => onContextChange(e.target.value)}
            rows={7}
            placeholder="e.g. Delivery failures spiked 40% in the Pacific region due to capacity shortfalls at the hub. We need a decision on whether to bring in surge capacity or reroute shipments…"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent resize-none transition"
          />
          <p className="text-xs text-gray-400 mt-1.5 text-right">
            {context.length} chars
          </p>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!context.trim() || loading}
          className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-sage-600 hover:bg-sage-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold px-6 py-3.5 text-sm transition-all duration-150 shadow-sm hover:shadow-md disabled:shadow-none"
        >
          {loading ? (
            <>
              <LoadingSpinner />
              Generating…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Generate First Move
            </>
          )}
        </button>
      </div>

      {/* Examples */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Try an example
        </p>
        <div className="flex flex-col gap-2">
          {examples.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => onContextChange(ex.text)}
              className="text-left px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-sage-50 hover:border-sage-300 transition-all duration-150 group"
            >
              <span className="block text-xs font-semibold text-sage-700 group-hover:text-sage-800 mb-0.5">
                {ex.label}
              </span>
              <span className="block text-xs text-gray-500 leading-relaxed line-clamp-2">
                {ex.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  )
}
