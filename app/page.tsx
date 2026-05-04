'use client'

import { useRef, useState } from 'react'
import InputPanel from '@/components/InputPanel'
import OutputPanel from '@/components/OutputPanel'
import SignalPanel from '@/components/SignalPanel'
import { BriefOutput, IdeaType } from '@/lib/types'

const GITHUB_REPO_URL = 'https://github.com/jzg00/FirstMove'

export default function Home() {
  const [idea, setIdea] = useState('')
  const [ideaType, setIdeaType] = useState<IdeaType>('product')
  const [output, setOutput] = useState<BriefOutput | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const briefPanelRef = useRef<HTMLDivElement>(null)

  function handleDraftBrief(context: string) {
    setIdea(context)
    briefPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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
            <div className="h-7 w-7 shrink-0 overflow-hidden rounded-lg" aria-hidden>
              <svg
                className="h-full w-full text-sage-600"
                viewBox="0 0 20 20"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <mask id="firstmove-logo-arrow-cutout" maskUnits="userSpaceOnUse">
                    <rect width="20" height="20" fill="white" />
                    {/* Shaft: cascading vertical slots (thin → thick); black = transparent */}
                    <rect x="4.15" y="7.7" width="0.28" height="4.6" fill="black" />
                    <rect x="4.85" y="7.7" width="0.42" height="4.6" fill="black" />
                    <rect x="5.75" y="7.7" width="0.58" height="4.6" fill="black" />
                    <rect x="6.85" y="7.7" width="0.78" height="4.6" fill="black" />
                    <rect x="8.15" y="7.7" width="1.02" height="4.6" fill="black" />
                    <rect x="9.65" y="7.7" width="1.28" height="4.6" fill="black" />
                    <rect x="11.35" y="7.7" width="1.58" height="4.6" fill="black" />
                    {/* Arrowhead — tip near right edge of tile */}
                    <path
                      fill="black"
                      d="M 14.35 6.95 L 19.72 10 L 14.35 13.05 L 14.35 11.18 L 13.05 11.18 L 13.05 8.82 L 14.35 8.82 Z"
                    />
                  </mask>
                </defs>
                <rect
                  width="20"
                  height="20"
                  rx="5"
                  ry="5"
                  fill="currentColor"
                  mask="url(#firstmove-logo-arrow-cutout)"
                />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-sm tracking-tight">
              FirstMove
            </span>
          </div>
          <p className="pointer-events-none absolute left-1/2 top-1/2 hidden max-w-[min(20rem,calc(100%-11rem))] -translate-x-1/2 -translate-y-1/2 text-center text-xs text-gray-400 sm:block">
            Don&apos;t overthink. Make the first move.
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
            Describe your idea in plain language. Get a clear first move and next steps—in seconds.
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

        {/* Signal Scanner */}
        <div className="mb-8">
          <SignalPanel onDraftBrief={handleDraftBrief} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left */}
          <div ref={briefPanelRef} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
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
      <footer className="border-t border-gray-100 py-6 px-6 flex flex-col items-center gap-4 text-center">
        <p className="text-xs text-gray-400 max-w-md">
          Built to explore how AI can reduce the gap between idea and execution.
        </p>
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
          aria-label="View FirstMove source on GitHub"
        >
          <GitHubLogo className="h-5 w-5 text-current" aria-hidden />
          <span>GitHub</span>
        </a>
      </footer>
    </div>
  )
}

function GitHubLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.225-22.23-5.475-22.23-24.372 0-5.404 1.902-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.796 5.015 13.2 0 18.905-11.404 23.06-22.324 24.285 1.774 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
      />
    </svg>
  )
}
