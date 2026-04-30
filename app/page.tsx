'use client'

import { useState } from 'react'
import InputPanel from '@/components/InputPanel'
import OutputPanel from '@/components/OutputPanel'
import { BriefOutput, IdeaType } from '@/lib/types'

export default function Home() {
  const [idea, setIdea] = useState('')
  const [ideaType, setIdeaType] = useState<IdeaType>('product')
  const [output, setOutput] = useState<BriefOutput | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    if (!idea.trim()) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, ideaType }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error ?? 'Something went wrong. Please try again.')
        return
      }
      setOutput(data as BriefOutput)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="relative max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-sage-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-sm tracking-tight">
              FirstMove
            </span>
          </div>
          <p className="pointer-events-none absolute left-1/2 top-1/2 hidden max-w-[min(20rem,calc(100%-11rem))] -translate-x-1/2 -translate-y-1/2 text-center text-xs text-gray-400 sm:block">
            Save time. Make the first move.
          </p>
          <div className="relative z-10 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-sage-50 border border-sage-200 px-2.5 py-0.5 text-[11px] font-semibold text-sage-700">
              <span className="w-1.5 h-1.5 rounded-full bg-sage-500 inline-block" />
              MVP
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center">
          <p className="text-xs font-semibold text-sage-600 uppercase tracking-widest mb-3">
            For leaders who move fast
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-3">
            Turn messy ideas into{' '}
            <span className="text-sage-600">execution-ready plans</span>
          </h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Describe your idea in plain language. Get a structured brief with
            problem framing, scope, next steps, risks, and time saved — in
            seconds.
          </p>
        </div>
      </section>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <InputPanel
              idea={idea}
              ideaType={ideaType}
              loading={loading}
              onIdeaChange={setIdea}
              onTypeChange={setIdeaType}
              onSubmit={handleGenerate}
            />
          </div>

          {/* Right */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm min-h-[500px]">
            <OutputPanel output={output} loading={loading} ideaType={ideaType} idea={idea} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center">
        <p className="text-xs text-gray-400">
          FirstMove &mdash; Built for leaders who value their time.
        </p>
      </footer>
    </div>
  )
}
