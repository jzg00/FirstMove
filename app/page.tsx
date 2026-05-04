'use client'

import { useState, useEffect } from 'react'
import InputPanel from '@/components/InputPanel'
import OutputPanel from '@/components/OutputPanel'
import SignalPanel from '@/components/SignalPanel'
import { BriefOutput, BriefType } from '@/lib/types'

const GITHUB_REPO_URL = 'https://github.com/jzg00/FirstMove'

const PAGE_STYLES = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-16px); }
    to   { opacity: 1; transform: translateX(0);     }
  }
  @keyframes demoReveal {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  .animate-fade-up    { animation: fadeInUp    0.6s ease-out both; }
  .animate-slide-left { animation: slideInLeft 0.6s ease-out both; }
  .demo-reveal        { animation: demoReveal  0.65s ease-out both; }

  .stagger-1 { animation-delay: 0.10s; }
  .stagger-2 { animation-delay: 0.20s; }
  .stagger-3 { animation-delay: 0.32s; }
  .stagger-4 { animation-delay: 0.44s; }

  .scroll-reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.55s ease-out, transform 0.55s ease-out;
  }
  .scroll-reveal-left {
    opacity: 0;
    transform: translateX(-18px);
    transition: opacity 0.55s ease-out, transform 0.55s ease-out;
  }
  .scroll-reveal.is-visible,
  .scroll-reveal-left.is-visible {
    opacity: 1;
    transform: none;
  }
`

export default function Home() {
  const [context, setContext] = useState('')
  const briefType: BriefType = 'operations'
  const [output, setOutput] = useState<BriefOutput | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [prefilledContext, setPrefilledContext] = useState<string | null>(null)
  const [showApp, setShowApp] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = (entry.target as HTMLElement).dataset.delay ?? '0'
            setTimeout(() => entry.target.classList.add('is-visible'), parseFloat(delay) * 1000)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.scroll-reveal, .scroll-reveal-left').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  function handleDraftBrief(signalContext: string) {
    setPrefilledContext(signalContext)
    setOutput(null)
  }

  async function handleGenerate() {
    if (!context.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, briefType }),
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

  function handleTryFirstMove() {
    setShowApp(true)
    setTimeout(() => document.getElementById('app')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  return (
    <>
      <style>{PAGE_STYLES}</style>
      <div className="min-h-screen flex flex-col bg-[#F5F3EE]">

        {/* ── Nav ── */}
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="relative max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
            <div className="relative z-10 flex items-center gap-2.5">
              <div className="h-7 w-7 shrink-0 overflow-hidden rounded-lg" aria-hidden>
                <svg className="h-full w-full text-sage-600" viewBox="0 0 20 20" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <mask id="firstmove-logo-arrow-cutout" maskUnits="userSpaceOnUse">
                      <rect width="20" height="20" fill="white" />
                      <rect x="4.15" y="7.7" width="0.28" height="4.6" fill="black" />
                      <rect x="4.85" y="7.7" width="0.42" height="4.6" fill="black" />
                      <rect x="5.75" y="7.7" width="0.58" height="4.6" fill="black" />
                      <rect x="6.85" y="7.7" width="0.78" height="4.6" fill="black" />
                      <rect x="8.15" y="7.7" width="1.02" height="4.6" fill="black" />
                      <rect x="9.65" y="7.7" width="1.28" height="4.6" fill="black" />
                      <rect x="11.35" y="7.7" width="1.58" height="4.6" fill="black" />
                      <path fill="black" d="M 14.35 6.95 L 19.72 10 L 14.35 13.05 L 14.35 11.18 L 13.05 11.18 L 13.05 8.82 L 14.35 8.82 Z" />
                    </mask>
                  </defs>
                  <rect width="20" height="20" rx="5" ry="5" fill="currentColor" mask="url(#firstmove-logo-arrow-cutout)" />
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-sm tracking-tight">FirstMove</span>
            </div>
            <p className="pointer-events-none absolute left-1/2 top-1/2 hidden max-w-[min(28rem,calc(100%-11rem))] -translate-x-1/2 -translate-y-1/2 text-center text-xs text-gray-400 sm:block">
              Turn operational signals into decisions — before they become crises.
            </p>
            <div className="relative z-10 flex items-center gap-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-sage-50 border border-sage-200 px-2.5 py-0.5 text-[11px] font-semibold text-sage-700">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-500 inline-block" />
                Demo
              </span>
            </div>
          </div>
        </header>

        {/* ── Hero ── */}
        <section className="border-b border-gray-100 bg-white">
          <div className="max-w-4xl mx-auto px-6 py-20 text-center">
            <p className="text-xs font-semibold text-sage-600 uppercase tracking-widest mb-3 animate-fade-up">
              For leaders who move fast
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-5 animate-fade-up stagger-1">
              Don&apos;t wait.{' '}
              <span className="text-sage-600">Make the first move.</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed animate-fade-up stagger-2">
              FirstMove ingests operational data and external signals to surface what&apos;s about to need your attention. One click turns any risk into a delegatable brief.
            </p>
          </div>
        </section>

        {/* ── Explainer ── */}
        <div className="max-w-5xl mx-auto w-full px-6">

          {/* Signal-to-decision loop */}
          <section className="pt-20 pb-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-10 scroll-reveal-left">
              The signal-to-decision loop
            </h2>

            <div className="flex flex-col lg:flex-row items-stretch gap-4">
              {/* Step 1 */}
              <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 scroll-reveal group cursor-default" data-delay="0.05">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sage-100 to-sage-50 border border-sage-200 flex items-center justify-center flex-shrink-0 group-hover:from-sage-200 transition-all duration-300">
                    <svg className="w-6 h-6 text-sage-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                      <path d="M8 10h8M8 14h8" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Ingest</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Operational data + external signals</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Operational datasets paired with external leading indicators — weather, commodity moves, demand trends — in a single view.
                </p>
              </div>

              <div className="flex lg:hidden justify-center py-2" aria-hidden>
                <svg className="w-5 h-5 text-sage-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
              </div>
              <div className="hidden lg:flex items-center justify-center" aria-hidden>
                <svg className="w-5 h-5 text-sage-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 6 15 12 9 18" /></svg>
              </div>

              {/* Step 2 */}
              <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 scroll-reveal group cursor-default" data-delay="0.15">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sage-100 to-sage-50 border border-sage-200 flex items-center justify-center flex-shrink-0 group-hover:from-sage-200 transition-all duration-300">
                    <svg className="w-6 h-6 text-sage-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M9 4H5a2 2 0 00-2 2v14a2 2 0 002 2h4M15 4h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M9 9h6M9 13h6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Rank</h3>
                    <p className="text-xs text-gray-500 mt-0.5">What matters most right now</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  AI surfaces the top items most likely to escalate in 7–14 days, weighting <em>compounding risk</em> — weak internal metrics and external signals pointing the same direction.
                </p>
              </div>

              <div className="flex lg:hidden justify-center py-2" aria-hidden>
                <svg className="w-5 h-5 text-sage-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
              </div>
              <div className="hidden lg:flex items-center justify-center" aria-hidden>
                <svg className="w-5 h-5 text-sage-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 6 15 12 9 18" /></svg>
              </div>

              {/* Step 3 */}
              <div className="flex-1 bg-gradient-to-br from-sage-50 to-white rounded-2xl border border-sage-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 scroll-reveal group cursor-default" data-delay="0.25">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sage-200 to-sage-100 border border-sage-300 flex items-center justify-center flex-shrink-0 group-hover:from-sage-300 transition-all duration-300">
                    <svg className="w-6 h-6 text-sage-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
                      <polyline points="13 2 13 9 20 9" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Brief</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Executable plan, ready to delegate</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  One click generates problem framing, first moves, next steps, and risks. Edit any section, then share or delegate.
                </p>
              </div>
            </div>
          </section>

          {/* Why it matters */}
          <section className="py-20 border-t border-gray-200 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 scroll-reveal">Why this matters</h2>
            <div className="max-w-2xl mx-auto scroll-reveal" data-delay="0.12">
              <p className="text-base text-gray-700 leading-relaxed mb-4">
                Operational crises are rarely surprises. The signal is usually in the data — a delivery hub running 2× its failure rate, a supplier whose lead time keeps creeping — days before it breaks. What&apos;s missing isn&apos;t better data. It&apos;s the orchestration layer that reads internal metrics and external signals together, identifies which are about to compound, and surfaces the one question that matters this week.
              </p>
              <p className="text-base text-gray-600 leading-relaxed">
                That&apos;s what AI is built to do.{' '}
                <span className="text-gray-800 font-medium">FirstMove is that orchestration layer</span> — turning a stream of data into a prioritized queue of decisions, with a delegatable brief already written.
              </p>
            </div>
          </section>

          {/* What's possible next */}
          <section className="py-16 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 scroll-reveal-left">
              What&apos;s possible next
            </h2>
            <p className="text-sm text-gray-500 mb-12 max-w-2xl scroll-reveal" data-delay="0.1">
              The signal → brief loop works on sample data. The next step is wiring it to live sources so the morning queue is real.
            </p>

            <div className="space-y-4">
              {([
                {
                  icon: (
                    <svg className="w-5 h-5 text-sage-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <circle cx="6"  cy="6"  r="2.2" />
                      <circle cx="18" cy="6"  r="2.2" />
                      <circle cx="12" cy="18" r="2.2" />
                      <line x1="8.1"  y1="6"    x2="15.9" y2="6"    />
                      <line x1="7.1"  y1="7.8"  x2="11.1" y2="16.1" />
                      <line x1="16.9" y1="7.8"  x2="12.9" y2="16.1" />
                    </svg>
                  ),
                  title: 'Real data connectors',
                  description: 'Connect directly to fulfillment systems, supplier dashboards, menu/SKU performance feeds, Slack, and data warehouses. The sample datasets are stand-ins for a continuous read of the operational systems leadership already trusts.',
                },
                {
                  icon: (
                    <svg className="w-5 h-5 text-sage-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
                      <path d="M8.5 16.5a5 5 0 017 0" />
                      <path d="M5 13a9.5 9.5 0 0114 0" />
                      <path d="M1.5 9.5a14 14 0 0121 0" />
                    </svg>
                  ),
                  title: 'External signal feeds',
                  description: 'Live weather APIs (NOAA, OpenWeather, Tomorrow.io), commodity futures (USDA, CME, Mintec), demand trends (Google Trends, retail intelligence), and social listening — anything that moves before internal metrics do.',
                },
                {
                  icon: (
                    <svg className="w-5 h-5 text-sage-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <rect x="7" y="7" width="10" height="10" rx="1" />
                      <line x1="9" y1="7" x2="9" y2="4" /><line x1="12" y1="7" x2="12" y2="4" /><line x1="15" y1="7" x2="15" y2="4" />
                      <line x1="9" y1="20" x2="9" y2="17" /><line x1="12" y1="20" x2="12" y2="17" /><line x1="15" y1="20" x2="15" y2="17" />
                      <line x1="7" y1="9" x2="4" y2="9" /><line x1="7" y1="12" x2="4" y2="12" /><line x1="7" y1="15" x2="4" y2="15" />
                      <line x1="20" y1="9" x2="17" y2="9" /><line x1="20" y1="12" x2="17" y2="12" /><line x1="20" y1="15" x2="17" y2="15" />
                    </svg>
                  ),
                  title: 'AI agents for operations',
                  description: 'Monitor signals continuously on a schedule. Draft briefs automatically when a threshold is crossed. Create tickets, assign follow-ups, prepare action items — without waiting for someone to open the dashboard.',
                },
                {
                  icon: (
                    <svg className="w-5 h-5 text-sage-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M21 2v6h-6" />
                      <path d="M3 12a9 9 0 0115-6.7L21 8" />
                      <path d="M3 22v-6h6" />
                      <path d="M21 12a9 9 0 01-15 6.7L3 16" />
                    </svg>
                  ),
                  title: 'Signal feedback loop',
                  description: 'Track which forecasts played out. Learn what matters for this specific operation. Tune the prioritizer over time and build accountability — every flagged signal goes somewhere (Slack, Linear, calendar) instead of evaporating when the tab closes.',
                },
              ] as { icon: React.ReactNode; title: string; description: string }[]).map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-sage-300 hover:shadow-md transition-all duration-300 scroll-reveal"
                  data-delay={`${0.08 * (i + 1)}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-sage-50 border border-sage-200 flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Path forward */}
          <section className="py-16 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-10 scroll-reveal-left">
              The path forward
            </h2>
            <div className="space-y-7">
              {([
                { phase: 'Now',     desc: 'MVP proves the signal → brief loop with sample data across three operational domains: delivery risk, procurement risk, and demand signals.' },
                { phase: 'Phase 1', desc: 'Connect to real operational systems — fulfillment, supplier dashboards, support tickets, Slack, and data warehouses.' },
                { phase: 'Phase 2', desc: 'Add live external signal integrations: weather APIs, commodity futures, demand trends, social listening — anything predictive.' },
                { phase: 'Phase 3', desc: 'AI agents monitor signals continuously, draft briefs on a schedule, create tickets, assign follow-ups, and learn which signals actually escalated.' },
              ] as { phase: string; desc: string }[]).map((item, i) => (
                <div key={i} className="flex items-start gap-4 scroll-reveal" data-delay={`${0.1 * i}`}>
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-sage-100 to-sage-50 border border-sage-200 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-semibold text-sage-700">{i + 1}</span>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-xs font-semibold text-sage-700 uppercase tracking-wider mb-1">{item.phase}</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 border-t border-gray-200 text-center scroll-reveal">
            <p className="text-sm text-gray-500 mb-2 max-w-md mx-auto leading-relaxed">
              FirstMove is an MVP for an internal AI workflow layer.
            </p>
            <p className="text-sm font-medium text-gray-700 mb-8">
              Signal → decision → prepared action → approved execution.
            </p>
            <button
              onClick={handleTryFirstMove}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-sage-600 hover:bg-sage-700 active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-sm hover:shadow-md"
            >
              Try FirstMove
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </section>

        </div>

        {/* ── App ── */}
        {showApp && (
          <div id="app" className="bg-white border-t-2 border-sage-100 demo-reveal">
            <div className="max-w-7xl mx-auto px-6 py-10">

              <div className="mb-8">
                <SignalPanel onDraftBrief={handleDraftBrief} />
              </div>

              {prefilledContext !== null && (
                <div key={prefilledContext} className="demo-reveal">
                  {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <InputPanel
                        context={context}
                        loading={loading}
                        prefilledContext={prefilledContext}
                        onContextChange={setContext}
                        onSubmit={handleGenerate}
                      />
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm min-h-[500px]">
                      <OutputPanel output={output} loading={loading} briefType={briefType} context={context} />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <footer className="border-t border-gray-100 py-6 px-6 flex flex-col items-center gap-4 text-center bg-white">
          <p className="text-xs text-gray-400 max-w-md">
            Built to explore how AI can reduce the gap between signal and action
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
    </>
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
