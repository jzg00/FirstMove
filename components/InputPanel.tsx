'use client'

import { useEffect, useRef } from 'react'
import { IdeaType } from '@/lib/types'

const IDEA_TYPES: { value: IdeaType; label: string }[] = [
  { value: 'product', label: 'Product Idea' },
  { value: 'operations', label: 'Operations Improvement' },
  { value: 'workflow', label: 'Workflow Redesign' },
]

const EXAMPLES: Record<IdeaType, { label: string; text: string }[]> = {
  product: [
    {
      label: 'Late Delivery Alerts',
      text: "When a delivery is running late we send a generic email and customers go straight to support. We need something that proactively tells them what's happening and gives them a real option — reschedule, credit, something. Right now it's just radio silence.",
    },
    {
      label: 'Stockout Handling',
      text: "We run out of key ingredients almost every week and the ops team is manually emailing customers with substitution options. It doesn't scale and our ratings are taking a hit. Need a self-serve flow before this gets worse.",
    },
    {
      label: 'Demand Forecasting Tool',
      text: "Box production planning is basically a spreadsheet and gut instinct. We overproduce some weeks, scramble others, and waste is creeping up. Need a proper forecasting tool before we expand to two new cities in Q3.",
    },
  ],
  operations: [
    {
      label: 'Refund Bottleneck',
      text: "Customer refund requests go through 3 different teams depending on the issue type and take 6 days on average to resolve. CSAT is dropping and there's no consistent process. It's becoming a real retention problem.",
    },
    {
      label: 'Warehouse Slowdown',
      text: "Pick-and-pack speed drops 40% every Monday because of how we schedule weekend inventory restocks. The whole line backs up and we miss morning delivery windows. We've known about this for months and nothing has changed.",
    },
    {
      label: 'Driver Onboarding',
      text: "We're onboarding 20+ drivers a month but the process takes 2 weeks and requires manual sign-off from 4 people. About half drop off before their first delivery. We're losing people we already recruited and paid to background-check.",
    },
  ],
  workflow: [
    {
      label: 'Delivery Escalations',
      text: "When a delivery goes wrong — late, missing, damaged — drivers, support, and ops all handle it differently. Some customers wait 3 days for a response. We need one escalation path that everyone actually follows, not another Notion doc nobody reads.",
    },
    {
      label: 'New Market Launch',
      text: "Every time we launch in a new city it takes 5 months and feels completely chaotic. We repeat the same mistakes, miss the same setup steps, and scramble at the end. We need a repeatable playbook — not a template, an actual process with owners.",
    },
    {
      label: 'Menu Change Process',
      text: "Updating a single menu item involves 6 teams and takes about 8 weeks of back-and-forth. At least half that time is just waiting on approvals. We need to get this under 3 weeks without skipping food safety sign-off.",
    },
  ],
}

interface InputPanelProps {
  idea: string
  ideaType: IdeaType
  loading: boolean
  prefilledContext?: string | null
  onIdeaChange: (val: string) => void
  onTypeChange: (val: IdeaType) => void
  onSubmit: () => void
}

export default function InputPanel({
  idea,
  ideaType,
  loading,
  prefilledContext,
  onIdeaChange,
  onTypeChange,
  onSubmit,
}: InputPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const examples = EXAMPLES[ideaType]

  useEffect(() => {
    if (!prefilledContext) return
    onIdeaChange(prefilledContext)
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [prefilledContext])

  return (
    <div ref={containerRef} className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Describe your idea
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Write freely — we handle the structure.
        </p>
      </div>

      {/* Idea Type */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Idea Type
        </label>
        <div className="flex gap-2 flex-wrap">
          {IDEA_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => onTypeChange(t.value)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                ideaType === t.value
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
            Your Idea
          </label>
          <textarea
            value={idea}
            onChange={(e) => onIdeaChange(e.target.value)}
            rows={7}
            placeholder="e.g. We need a way to turn rough product ideas into structured briefs so the team can move faster…"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent resize-none transition"
          />
          <p className="text-xs text-gray-400 mt-1.5 text-right">
            {idea.length} chars
          </p>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!idea.trim() || loading}
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
              onClick={() => onIdeaChange(ex.text)}
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
