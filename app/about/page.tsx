import type { CSSProperties } from 'react'

export default function AboutPage() {
  const GITHUB_REPO_URL = 'https://github.com/jzg00/FirstMove'

  const containerStyle = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-16px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(16px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes pulse-soft {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.6;
      }
    }

    @keyframes popIn {
      0% {
        opacity: 0;
        transform: scale(0.9);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    .animate-fade-up {
      animation: fadeInUp 0.6s ease-out;
    }

    .animate-slide-left {
      animation: slideInLeft 0.6s ease-out;
    }

    .animate-slide-right {
      animation: slideInRight 0.6s ease-out;
    }

    .animate-pop {
      animation: popIn 0.5s ease-out;
    }

    .animate-pulse-soft {
      animation: pulse-soft 2s ease-in-out infinite;
    }

    .stagger-1 { animation-delay: 0.1s; }
    .stagger-2 { animation-delay: 0.2s; }
    .stagger-3 { animation-delay: 0.3s; }
    .stagger-4 { animation-delay: 0.4s; }
  `

  return (
    <>
      <style>{containerStyle}</style>
      <div className="min-h-screen flex flex-col bg-[#F5F3EE]">
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
                      <rect x="4.15" y="7.7" width="0.28" height="4.6" fill="black" />
                      <rect x="4.85" y="7.7" width="0.42" height="4.6" fill="black" />
                      <rect x="5.75" y="7.7" width="0.58" height="4.6" fill="black" />
                      <rect x="6.85" y="7.7" width="0.78" height="4.6" fill="black" />
                      <rect x="8.15" y="7.7" width="1.02" height="4.6" fill="black" />
                      <rect x="9.65" y="7.7" width="1.28" height="4.6" fill="black" />
                      <rect x="11.35" y="7.7" width="1.58" height="4.6" fill="black" />
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
              <a href="/" className="font-bold text-gray-900 text-sm tracking-tight hover:text-sage-600 transition-colors">
                FirstMove
              </a>
            </div>
            <div className="relative z-10 flex items-center gap-3">
              <a
                href="/"
                className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Back to App
              </a>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="border-b border-gray-100 bg-white">
          <div className="max-w-5xl mx-auto px-6 py-20 text-center">
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-6 animate-fade-up">
              FirstMove
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-up stagger-1">
              Turn operational signals into decisions before they become crises.
            </p>
          </div>
        </section>

        {/* Main */}
        <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-16">
          {/* The loop */}
          <section className="mb-20">
            <h2 className="text-2xl font-semibold text-gray-900 mb-12 animate-slide-left">
              The signal-to-decision loop
            </h2>

            <div className="flex flex-col lg:flex-row items-stretch gap-4 mb-12">
              {/* Step 1 */}
              <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-up stagger-1 group cursor-default">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sage-100 to-sage-50 border border-sage-200 flex items-center justify-center flex-shrink-0 group-hover:from-sage-200 transition-all duration-300">
                    <svg className="w-6 h-6 text-sage-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                  Read datasets paired with leading indicators—weather, commodity moves, demand trends.
                </p>
              </div>

              {/* Arrow down on mobile, right on desktop */}
              <div className="flex lg:hidden justify-center py-2">
                <svg className="w-5 h-5 text-sage-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <svg className="w-5 h-5 text-sage-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </div>

              {/* Step 2 */}
              <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-up stagger-2 group cursor-default">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sage-100 to-sage-50 border border-sage-200 flex items-center justify-center flex-shrink-0 group-hover:from-sage-200 transition-all duration-300">
                    <svg className="w-6 h-6 text-sage-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 4H5a2 2 0 00-2 2v14a2 2 0 002 2h4M15 4h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M9 9h6M9 13h6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Rank</h3>
                    <p className="text-xs text-gray-500 mt-0.5">What matters most</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  AI surfaces the 3–5 items most likely to escalate in the next 7–14 days, weighing compounding risk.
                </p>
              </div>

              {/* Arrow */}
              <div className="flex lg:hidden justify-center py-2">
                <svg className="w-5 h-5 text-sage-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <svg className="w-5 h-5 text-sage-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </div>

              {/* Step 3 */}
              <div className="flex-1 bg-gradient-to-br from-sage-50 to-white rounded-2xl border border-sage-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-up stagger-3 group cursor-default">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sage-200 to-sage-100 border border-sage-300 flex items-center justify-center flex-shrink-0 group-hover:from-sage-300 transition-all duration-300">
                    <svg className="w-6 h-6 text-sage-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
                      <polyline points="13 2 13 9 20 9" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Brief</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Executable plan</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  One click generates a brief: problem framing, first moves, next steps, risks.
                </p>
              </div>
            </div>
          </section>

          {/* What's possible */}
          <section className="mb-20">
            <h2 className="text-2xl font-semibold text-gray-900 mb-12 animate-slide-left">
              What&apos;s possible next
            </h2>

            <div className="space-y-4">
              {[
                {
                  icon: '🔌',
                  title: 'Real data connectors',
                  description: 'Wire to fulfillment systems, supplier dashboards, support tickets, Slack, and data warehouses.',
                },
                {
                  icon: '📡',
                  title: 'External signal feeds',
                  description: 'Live weather, commodity futures, demand trends, social signals—anything predictive.',
                },
                {
                  icon: '🤖',
                  title: 'AI agents for operations',
                  description: 'Monitor signals continuously. Draft briefs on a schedule. Create tickets, assign follow-ups, prepare action items.',
                },
                {
                  icon: '📊',
                  title: 'Signal feedback loop',
                  description: 'Track which flagged signals escalated. Learn what matters. Refine priorities over time.',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-sage-300 hover:shadow-md transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${0.1 * (i + 1)}s` }}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Why it matters */}
          <section className="mb-16">
            <div className="bg-gradient-to-br from-sage-50 to-white rounded-2xl border border-sage-200 p-10 animate-fade-up">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Why this matters</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                Operational crises are rarely surprises. The signal is usually in the data—sometimes for days or weeks before it breaks.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                What's missing isn't better data. It's orchestration. A system that asks: <em>Which signals compound? Which decision do I need to make this week to stay ahead?</em>
              </p>
            </div>
          </section>

          {/* The roadmap */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 animate-slide-left">
              The path forward
            </h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sage-200 via-sage-300 to-transparent hidden md:block" />

              <div className="space-y-8">
                {[
                  { phase: 'Now', desc: 'MVP proves signal → brief loop with sample data' },
                  { phase: 'Phase 1', desc: 'Connect to real operational systems (fulfillment, suppliers, support)' },
                  { phase: 'Phase 2', desc: 'Add external signal integrations (weather, commodities, demand, social)' },
                  { phase: 'Phase 3', desc: 'AI agents for monitoring, drafting, creating action items, learning' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start md:pl-20 animate-fade-up" style={{ animationDelay: `${0.15 * i}s` }}>
                    <div className="hidden md:flex">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage-100 to-sage-50 border border-sage-200 flex items-center justify-center flex-shrink-0 relative z-10">
                        <span className="text-xs font-semibold text-sage-700">{i + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-sage-700 uppercase tracking-wider mb-1">{item.phase}</p>
                      <p className="text-sm text-gray-700">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA back */}
          <section className="text-center animate-fade-up stagger-4">
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sage-600 hover:bg-sage-700 active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to FirstMove
            </a>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-100 py-6 px-6 flex flex-col items-center gap-3 text-center mt-12">
          <p className="text-xs text-gray-400 max-w-md">
            Built to explore how AI can compress the time between signal and action — for the leaders who can least afford to wait.
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
