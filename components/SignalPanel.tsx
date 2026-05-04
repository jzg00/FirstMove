'use client'

import { useEffect, useState } from 'react'
import { DatasetId, Signal } from '@/lib/types'
import { SAMPLE_DATASETS } from '@/lib/sampleData'

const IMPACT_STYLES: Record<Signal['impact'], string> = {
  high: 'bg-red-50 border-red-200 text-red-700',
  medium: 'bg-amber-50 border-amber-200 text-amber-700',
  low: 'bg-gray-100 border-gray-200 text-gray-500',
}

const SCAN_STAGES = [
  { label: 'Reading dataset…', cardIdx: -1 },
  { label: 'Identifying top issues…', cardIdx: 0 },
  { label: 'Ranking by business impact…', cardIdx: 1 },
  { label: 'Writing reasoning…', cardIdx: 2 },
  { label: 'Finalizing signals…', cardIdx: 3 },
]

const SCAN_CARDS = [
  { titleW: 72, badgeW: 52, lines: [90, 68] },
  { titleW: 85, badgeW: 60, lines: [88, 75] },
  { titleW: 65, badgeW: 52, lines: [92, 60] },
  { titleW: 78, badgeW: 60, lines: [85, 72] },
]

// --- Cell formatters ---

function formatHeader(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).trim()
}

function formatCell(key: string, value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(value + 'T12:00:00').toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    }
    return value
  }
  if (typeof value === 'number') {
    const k = key.toLowerCase()
    if (k.includes('variance') || k.includes('trend')) {
      const sign = value > 0 ? '+' : ''
      return `${sign}${value.toFixed(1)}`
    }
    if (k.includes('dollar')) return `$${value.toLocaleString()}`
    if (k.includes('cost')) return `$${value.toFixed(2)}`
    if (k.includes('rate') || k.includes('cancelled')) return `${(value * 100).toFixed(1)}%`
    if (Number.isInteger(value) && value >= 1000) return value.toLocaleString()
    if (!Number.isInteger(value)) return value.toFixed(1)
    return String(value)
  }
  return String(value)
}

// --- Main component ---

interface SignalPanelProps {
  onDraftBrief: (context: string) => void
}

export default function SignalPanel({ onDraftBrief }: SignalPanelProps) {
  const [selectedDataset, setSelectedDataset] = useState<DatasetId>('logistics')
  const [loading, setLoading] = useState(false)
  const [signals, setSignals] = useState<Signal[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleSelectDataset(id: DatasetId) {
    setSelectedDataset(id)
    setSignals(null)
    setError(null)
  }

  async function handleAnalyze() {
    setLoading(true)
    setError(null)
    setSignals(null)
    try {
      const res = await fetch('/api/prioritize-signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ datasetId: selectedDataset }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error ?? 'Something went wrong. Please try again.')
        return
      }
      setSignals(data as Signal[])
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const selected = SAMPLE_DATASETS.find((d) => d.id === selectedDataset)!

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-sage-600 uppercase tracking-widest mb-1">
          Signal Scanner
        </p>
        <h2 className="text-xl font-semibold text-gray-900">What needs your attention?</h2>
        <p className="text-sm text-gray-500 mt-1">
          Pick a dataset, let AI surface the top issues ranked by business impact.
        </p>
      </div>

      {/* Dataset switcher */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Dataset
        </label>
        <div className="flex gap-2 flex-wrap">
          {SAMPLE_DATASETS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => handleSelectDataset(d.id as DatasetId)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                selectedDataset === d.id
                  ? 'bg-sage-600 text-white border-sage-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-sage-400 hover:text-sage-700'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">{selected.description}</p>
      </div>

      {/* Dataset preview table */}
      <DatasetTable rows={selected.rows} />

      {/* Analyze CTA */}
      <button
        type="button"
        onClick={handleAnalyze}
        disabled={loading}
        className="mt-4 w-full flex items-center justify-center gap-2.5 rounded-xl bg-sage-600 hover:bg-sage-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold px-6 py-3.5 text-sm transition-all duration-150 shadow-sm hover:shadow-md disabled:shadow-none"
      >
        {loading ? (
          <>
            <Spinner className="w-4 h-4" />
            Scanning for signals…
          </>
        ) : (
          <>
            <ScanIcon />
            Analyze with AI
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && <ScanLoadingSkeleton />}

      {/* Signal cards */}
      {!loading && signals && signals.length > 0 && (
        <div className="mt-5 flex flex-col gap-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {signals.length} Signal{signals.length !== 1 ? 's' : ''} · Ranked by Impact
          </p>
          {signals.map((signal, i) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              rank={i + 1}
              onDraftBrief={onDraftBrief}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// --- Dataset preview table ---

function DatasetTable({ rows }: { rows: Record<string, unknown>[] }) {
  if (rows.length === 0) return null
  const headers = Object.keys(rows[0])

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Raw Data</span>
        <span className="inline-flex items-center rounded-full bg-sage-50 border border-sage-200 px-2 py-0.5 text-[11px] font-semibold text-sage-700">
          {rows.length} rows
        </span>
      </div>
      <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
        <table className="w-full min-w-max text-xs border-collapse">
          <thead className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-[0_1px_0_0_#e5e7eb]">
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-3 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {formatHeader(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-gray-50 last:border-b-0 transition-colors duration-100 hover:bg-sage-50/40 ${
                  i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                }`}
              >
                {headers.map((h) => (
                  <td
                    key={h}
                    className="px-3 py-2 text-gray-700 whitespace-nowrap tabular-nums"
                  >
                    {formatCell(h, row[h])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// --- Signal card ---

function SignalCard({
  signal,
  rank,
  onDraftBrief,
}: {
  signal: Signal
  rank: number
  onDraftBrief: (context: string) => void
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-3 hover:border-sage-200 transition-colors duration-150">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-[11px] font-bold flex items-center justify-center mt-0.5">
          {rank}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap mb-1.5">
            <h3 className="text-sm font-semibold text-gray-900 leading-snug flex-1 min-w-0">
              {signal.title}
            </h3>
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize flex-shrink-0 ${IMPACT_STYLES[signal.impact]}`}
            >
              {signal.impact}
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">{signal.reasoning}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onDraftBrief(signal.suggestedContext)}
        className="self-end flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sage-300 bg-sage-50 hover:bg-sage-100 hover:border-sage-400 text-xs font-semibold text-sage-700 transition-all duration-150"
      >
        <DraftIcon />
        Draft brief
      </button>
    </div>
  )
}

// --- Loading skeleton ---

function skeletonCardClass(isActive: boolean, isDone: boolean): string {
  if (isActive) return 'border-sage-300 bg-sage-50/60 shadow-sm'
  if (isDone) return 'border-sage-100 bg-white opacity-60'
  return 'border-gray-100 bg-white opacity-40'
}

function ScanLoadingSkeleton() {
  const [stageIdx, setStageIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setStageIdx((prev) => {
        const next = Math.min(prev + 1, SCAN_STAGES.length - 1)
        if (next === SCAN_STAGES.length - 1) clearInterval(id)
        return next
      })
    }, 1400)
    return () => clearInterval(id)
  }, [])

  const activeCard = SCAN_STAGES[stageIdx].cardIdx

  return (
    <div className="mt-5 flex flex-col gap-3">
      <div className="flex items-center gap-2.5 px-1 mb-1">
        <span className="flex gap-[3px] items-center">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-sage-500 inline-block animate-bounce"
              style={{ animationDelay: `${i * 160}ms`, animationDuration: '900ms' }}
            />
          ))}
        </span>
        <span key={stageIdx} className="text-xs font-medium text-sage-700 fade-in-up">
          {SCAN_STAGES[stageIdx].label}
        </span>
      </div>

      {SCAN_CARDS.map((card, i) => {
        const isActive = i === activeCard
        const isDone = activeCard > i
        return (
          <div
            key={i}
            className={`rounded-xl border p-4 transition-all duration-500 ${skeletonCardClass(isActive, isDone)}`}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-full shimmer-line flex-shrink-0"
                style={{ opacity: isActive ? 0.6 : isDone ? 0.4 : 0.25 }}
              />
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3.5 rounded shimmer-line"
                    style={{ width: `${card.titleW}%`, opacity: isActive ? 0.7 : isDone ? 0.4 : 0.25 }}
                  />
                  <div
                    className="h-5 rounded-full shimmer-line"
                    style={{ width: `${card.badgeW}px`, opacity: isActive ? 0.6 : isDone ? 0.35 : 0.2 }}
                  />
                </div>
                {card.lines.map((w, j) => (
                  <div
                    key={j}
                    className="h-2.5 rounded shimmer-line"
                    style={{
                      width: `${w}%`,
                      animationDelay: `${j * 120}ms`,
                      opacity: isActive ? 0.6 : isDone ? 0.35 : 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <div
                className="h-7 w-24 rounded-lg shimmer-line"
                style={{ opacity: isActive ? 0.5 : isDone ? 0.3 : 0.15 }}
              />
            </div>
            {isActive && (
              <p className="text-right text-[10px] font-semibold text-sage-500 uppercase tracking-wider mt-2 animate-pulse">
                Analyzing…
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

// --- Icons ---

function Spinner({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className ?? 'w-3 h-3'}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

function ScanIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 5V3a1 1 0 011-1h2M11 2h2a1 1 0 011 1v2M14 11v2a1 1 0 01-1 1h-2M5 14H3a1 1 0 01-1-1v-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function DraftIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
