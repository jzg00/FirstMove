'use client'

import { useEffect, useRef } from 'react'

interface InputPanelProps {
  context: string
  loading: boolean
  prefilledContext?: string | null
  onContextChange: (val: string) => void
  onSubmit: () => void
}

export default function InputPanel({
  context,
  loading,
  prefilledContext,
  onContextChange,
  onSubmit,
}: InputPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null)

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
            placeholder="Select a signal from the scanner above to auto-fill, or describe the situation directly…"
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
