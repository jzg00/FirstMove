'use client'

import { useEffect, useRef, useState } from 'react'
import { BriefOutput, IdeaType } from '@/lib/types'

interface OutputPanelProps {
  output: BriefOutput | null
  loading: boolean
  ideaType: IdeaType
  idea: string
}

type SectionKey = 'firstMove' | 'nextSteps' | 'risks'

const EMPTY_ADDED: Record<SectionKey, string[]> = {
  firstMove: [], nextSteps: [], risks: [],
}

export default function OutputPanel({ output, loading, ideaType, idea }: OutputPanelProps) {
  const [highlighted, setHighlighted] = useState<Set<string>>(new Set())
  const [removed, setRemoved] = useState<Set<string>>(new Set())
  const [texts, setTexts] = useState<Record<string, string>>({})
  const [reloading, setReloading] = useState<Set<string>>(new Set())
  const [editing, setEditing] = useState<{ key: string; draft: string } | null>(null)
  const [added, setAdded] = useState<Record<SectionKey, string[]>>(EMPTY_ADDED)
  const [addingSection, setAddingSection] = useState<SectionKey | null>(null)
  const [addDraft, setAddDraft] = useState('')
  const [generatingSection, setGeneratingSection] = useState<SectionKey | null>(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [copied, setCopied] = useState<'markdown' | 'plain' | null>(null)
  const shareRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHighlighted(new Set())
    setRemoved(new Set())
    setTexts({})
    setReloading(new Set())
    setEditing(null)
    setAdded(EMPTY_ADDED)
    setAddingSection(null)
    setAddDraft('')
    setGeneratingSection(null)
    setShareOpen(false)
    setCopied(null)
  }, [output])

  useEffect(() => {
    if (!shareOpen) return
    function onOutsideClick(e: MouseEvent) {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false)
      }
    }
    document.addEventListener('mousedown', onOutsideClick)
    return () => document.removeEventListener('mousedown', onOutsideClick)
  }, [shareOpen])

  // --- Brief serialization ---

  function getItems(section: SectionKey, originalItems: string[]): string[] {
    return [
      ...originalItems
        .map((item, i) => ({ key: `${section}-${i}`, text: texts[`${section}-${i}`] ?? item }))
        .filter((item) => !removed.has(item.key))
        .map((item) => item.text),
      ...added[section]
        .map((item, i) => ({ key: `${section}-add-${i}`, text: texts[`${section}-add-${i}`] ?? item }))
        .filter((item) => !removed.has(item.key))
        .map((item) => item.text),
    ]
  }

  function buildBrief(format: 'markdown' | 'plain'): string {
    if (!output) return ''
    const cp = texts['coreProblem'] ?? output.coreProblem
    const fm = getItems('firstMove', output.firstMove)
    const ns = getItems('nextSteps', output.nextSteps)
    const ri = getItems('risks', output.risks)

    if (format === 'markdown') {
      return [
        `## Core Problem\n\n${cp}`,
        `## First Move\n\n${fm.map((i) => `- ${i}`).join('\n')}`,
        `## Next Steps\n\n${ns.map((i, n) => `${n + 1}. ${i}`).join('\n')}`,
        `## Risks & Tradeoffs\n\n${ri.map((i) => `- ${i}`).join('\n')}`,
        `## Estimated Time Saved\n\n${output.timeSaved}`,
      ].join('\n\n')
    }

    const hr = (t: string) => `${t}\n${'─'.repeat(t.length)}`
    return [
      `${hr('CORE PROBLEM')}\n${cp}`,
      `${hr('FIRST MOVE')}\n${fm.map((i) => `• ${i}`).join('\n')}`,
      `${hr('NEXT STEPS')}\n${ns.map((i, n) => `${n + 1}. ${i}`).join('\n')}`,
      `${hr('RISKS & TRADEOFFS')}\n${ri.map((i) => `• ${i}`).join('\n')}`,
      `${hr('ESTIMATED TIME SAVED')}\n${output.timeSaved}`,
    ].join('\n\n')
  }

  async function handleCopy(format: 'markdown' | 'plain') {
    await navigator.clipboard.writeText(buildBrief(format))
    setCopied(format)
    setTimeout(() => {
      setCopied(null)
      setShareOpen(false)
    }, 1500)
  }

  function handleEmail() {
    window.open(
      `mailto:?subject=${encodeURIComponent('FirstMove Brief')}&body=${encodeURIComponent(buildBrief('plain'))}`,
      '_blank',
    )
    setShareOpen(false)
  }

  function handleDownload() {
    const blob = new Blob([buildBrief('plain')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'firstmove-brief.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setShareOpen(false)
  }

  // --- Item interaction handlers ---

  function handleHighlight(key: string) {
    setHighlighted((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function handleRemove(key: string) {
    if (editing?.key === key) setEditing(null)
    setRemoved((prev) => new Set([...prev, key]))
  }

  async function handleReload(section: SectionKey, key: string, currentText: string) {
    setReloading((prev) => new Set([...prev, key]))
    try {
      const sectionItems = output
        ? getItems(section, output[section] as string[]).filter((t) => t !== currentText)
        : []
      const res = await fetch('/api/reload-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, ideaType, ideaText: idea, currentText, existingItems: sectionItems, mode: 'replace' }),
      })
      if (res.ok) {
        const { suggestion } = await res.json()
        if (suggestion) setTexts((prev) => ({ ...prev, [key]: suggestion }))
      }
    } catch {
      // silently fail — keep existing text
    }
    setReloading((prev) => { const next = new Set(prev); next.delete(key); return next })
  }

  function handleEdit(key: string, currentText: string) {
    setAddingSection(null)
    setEditing({ key, draft: currentText })
  }

  function handleSaveEdit() {
    if (!editing?.draft.trim()) return
    setTexts((prev) => ({ ...prev, [editing.key]: editing.draft.trim() }))
    setEditing(null)
  }

  function handleCancelEdit() {
    setEditing(null)
  }

  function handleStartAdd(section: SectionKey) {
    setEditing(null)
    setAddingSection(section)
    setAddDraft('')
  }

  function handleSaveAdd(section: SectionKey) {
    if (!addDraft.trim()) return
    setAdded((prev) => ({ ...prev, [section]: [...prev[section], addDraft.trim()] }))
    setAddingSection(null)
    setAddDraft('')
  }

  function handleCancelAdd() {
    setAddingSection(null)
    setAddDraft('')
  }

  async function handleGenerateItem(section: SectionKey) {
    setGeneratingSection(section)
    try {
      const sectionItems = output ? getItems(section, output[section] as string[]) : []
      const res = await fetch('/api/reload-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, ideaType, ideaText: idea, existingItems: sectionItems, mode: 'add' }),
      })
      if (res.ok) {
        const { suggestion } = await res.json()
        if (suggestion) setAdded((prev) => ({ ...prev, [section]: [...prev[section], suggestion] }))
      }
    } catch {
      // silently fail
    }
    setGeneratingSection(null)
  }

  // --- Section renderer ---

  function renderSection(
    section: SectionKey,
    originalItems: string[],
    prefixFn: (displayIdx: number) => React.ReactNode,
  ) {
    const visibleOriginal = originalItems
      .map((item, i) => ({ key: `${section}-${i}`, text: texts[`${section}-${i}`] ?? item }))
      .filter((item) => !removed.has(item.key))

    const visibleAdded = added[section]
      .map((item, i) => ({ key: `${section}-add-${i}`, text: texts[`${section}-add-${i}`] ?? item }))
      .filter((item) => !removed.has(item.key))

    const allItems = [...visibleOriginal, ...visibleAdded]
    const isAddingHere = addingSection === section
    const isGeneratingHere = generatingSection === section

    return (
      <div className="flex flex-col">
        <ul className="flex flex-col gap-0.5">
          {allItems.map((item, displayIdx) => (
            <EditableItem
              key={item.key}
              isHighlighted={highlighted.has(item.key)}
              isReloading={reloading.has(item.key)}
              isEditing={editing?.key === item.key}
              editDraft={editing?.key === item.key ? editing.draft : item.text}
              onHighlight={() => handleHighlight(item.key)}
              onRemove={() => handleRemove(item.key)}
              onReload={() => handleReload(section, item.key, item.text)}
              onEdit={() => handleEdit(item.key, item.text)}
              onDraftChange={(v) => setEditing((prev) => (prev ? { ...prev, draft: v } : null))}
              onSave={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              prefix={prefixFn(displayIdx)}
            >
              {item.text}
            </EditableItem>
          ))}
        </ul>

        {isGeneratingHere && (
          <div className="mt-2 flex items-center gap-2 px-2 py-2 text-xs text-sage-600">
            <Spinner />
            <span>Generating…</span>
          </div>
        )}

        {isAddingHere ? (
          <AddItemInput
            draft={addDraft}
            onDraftChange={setAddDraft}
            onSave={() => handleSaveAdd(section)}
            onCancel={handleCancelAdd}
            prefix={prefixFn(allItems.length)}
          />
        ) : (
          !isGeneratingHere && (
            <AddItemRow
              onAdd={() => handleStartAdd(section)}
              onGenerate={() => handleGenerateItem(section)}
            />
          )
        )}
      </div>
    )
  }

  // --- Render ---

  if (loading) return <LoadingSkeleton />

  if (!output) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-8">
        <div className="w-12 h-12 rounded-2xl bg-sage-50 border border-sage-100 flex items-center justify-center mb-4">
          <svg className="w-5 h-5 text-sage-500" viewBox="0 0 20 20" fill="none">
            <path d="M10 3v7m0 0l-3-3m3 3l3-3M4 14h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-700 mb-1">Your execution plan will appear here</p>
        <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
          Enter an idea on the left and click "Generate First Move" to get a structured brief in seconds.
        </p>
      </div>
    )
  }

  const highlightedCount = highlighted.size
  const removedCount = removed.size
  const coreProblemText = texts['coreProblem'] ?? output.coreProblem
  const isEditingCoreProblem = editing?.key === 'coreProblem'

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-sage-600 uppercase tracking-widest mb-1">Execution Brief</p>
          <h2 className="text-xl font-semibold text-gray-900">Your First Move</h2>
          <p className="text-sm text-gray-500 mt-0.5">Hover any item to edit, highlight, swap, or remove.</p>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {/* Share */}
          <div ref={shareRef} className="relative">
            <button
              onClick={() => setShareOpen((o) => !o)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors duration-100 ${
                shareOpen ? 'bg-sage-50 border-sage-300 text-sage-700' : 'bg-white border-gray-200 text-gray-600 hover:border-sage-300 hover:text-sage-700 hover:bg-sage-50'
              }`}
            >
              <ShareIcon />
              Share
              <ChevronIcon open={shareOpen} />
            </button>
            {shareOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl border border-gray-100 bg-white shadow-lg shadow-black/5 z-20 overflow-hidden">
                <div className="p-1">
                  <ShareMenuItem icon={<MarkdownIcon />} label="Copy as Markdown" checked={copied === 'markdown'} onClick={() => handleCopy('markdown')} />
                  <ShareMenuItem icon={<TextFileIcon />} label="Copy as Plain Text" checked={copied === 'plain'} onClick={() => handleCopy('plain')} />
                  <div className="my-1 border-t border-gray-100" />
                  <ShareMenuItem icon={<EmailIcon />} label="Share via Email" onClick={handleEmail} />
                  <ShareMenuItem icon={<DownloadIcon />} label="Download as .txt" onClick={handleDownload} />
                </div>
              </div>
            )}
          </div>

          {(highlightedCount > 0 || removedCount > 0) && (
            <div className="flex gap-1.5 flex-wrap justify-end">
              {highlightedCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />{highlightedCount} highlighted
                </span>
              )}
              {removedCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 border border-gray-200 px-2 py-0.5 text-[11px] font-semibold text-gray-500">
                  {removedCount} removed
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Core Problem */}
      <Card icon={<ProblemIcon />} title="Core Problem" action={
        !isEditingCoreProblem ? (
          <button
            title="Edit"
            onClick={() => handleEdit('coreProblem', coreProblemText)}
            className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-100 w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <EditIcon />
          </button>
        ) : null
      }>
        {isEditingCoreProblem ? (
          <div className="flex flex-col gap-2">
            <textarea
              autoFocus
              value={editing!.draft}
              onChange={(e) => setEditing((prev) => (prev ? { ...prev, draft: e.target.value } : null))}
              onKeyDown={(e) => { if (e.key === 'Escape') handleCancelEdit() }}
              rows={3}
              className="w-full text-sm text-gray-800 bg-transparent border-none focus:outline-none resize-none leading-relaxed"
            />
            <div className="flex items-center gap-2.5">
              <button onClick={handleSaveEdit} disabled={!editing?.draft.trim()} className="text-xs font-semibold text-white bg-sage-600 hover:bg-sage-700 disabled:bg-gray-200 disabled:text-gray-400 px-3 py-1 rounded-lg transition-colors">Save</button>
              <button onClick={handleCancelEdit} className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">Cancel</button>
              <span className="text-[11px] text-gray-300 ml-auto hidden sm:block">Esc to cancel</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-700 leading-relaxed">{coreProblemText}</p>
        )}
      </Card>

      {/* First Move — hero */}
      <div className="rounded-xl border-2 border-sage-300 bg-sage-50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sage-600"><MoveIcon /></span>
          <h3 className="text-xs font-bold text-sage-700 uppercase tracking-widest flex-1">First Move</h3>
          <span className="text-[10px] font-semibold text-sage-500 bg-sage-100 px-2 py-0.5 rounded-full">This week</span>
        </div>
        {renderSection('firstMove', output.firstMove, () => <MovePrefix />)}
      </div>

      {/* Next Steps */}
      <Card icon={<StepsIcon />} title="Next Steps">
        {renderSection('nextSteps', output.nextSteps, (i) => <NumberPrefix n={i + 1} />)}
      </Card>

      {/* Risks */}
      <Card icon={<RiskIcon />} title="Risks & Tradeoffs">
        {renderSection('risks', output.risks, () => <WarningPrefix />)}
      </Card>

      {/* Time Saved */}
      <div className="rounded-xl border border-sage-200 bg-sage-50 px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sage-600"><ClockIcon /></span>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Time Saved</span>
        </div>
        <span className="text-xl font-bold text-sage-700 tracking-tight text-right">{output.timeSaved}</span>
      </div>
    </div>
  )
}

// --- Share menu item ---

function ShareMenuItem({ icon, label, checked, onClick }: { icon: React.ReactNode; label: string; checked?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-gray-700 hover:bg-sage-50 hover:text-sage-800 transition-colors duration-100 text-left">
      <span className={`flex-shrink-0 ${checked ? 'text-sage-600' : 'text-gray-400'}`}>{checked ? <CheckCircleIcon /> : icon}</span>
      <span className="flex-1">{checked ? 'Copied!' : label}</span>
    </button>
  )
}

// --- EditableItem ---

function EditableItem({ isHighlighted, isReloading, isEditing, editDraft, onHighlight, onRemove, onReload, onEdit, onDraftChange, onSave, onCancelEdit, prefix, children }: {
  isHighlighted: boolean; isReloading: boolean; isEditing: boolean; editDraft: string
  onHighlight: () => void; onRemove: () => void; onReload: () => void; onEdit: () => void
  onDraftChange: (v: string) => void; onSave: () => void; onCancelEdit: () => void
  prefix: React.ReactNode; children: React.ReactNode
}) {
  if (isEditing) {
    return (
      <li className="flex items-start gap-2 rounded-xl border border-sage-300 bg-white px-3 py-2.5 my-0.5">
        <span className="mt-1 opacity-40">{prefix}</span>
        <div className="flex-1 flex flex-col gap-2">
          <textarea
            autoFocus
            value={editDraft}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSave() }
              if (e.key === 'Escape') onCancelEdit()
            }}
            rows={2}
            className="w-full text-sm text-gray-800 bg-transparent border-none focus:outline-none resize-none leading-relaxed"
          />
          <div className="flex items-center gap-2.5">
            <button onClick={onSave} disabled={!editDraft.trim()} className="text-xs font-semibold text-white bg-sage-600 hover:bg-sage-700 disabled:bg-gray-200 disabled:text-gray-400 px-3 py-1 rounded-lg transition-colors">Save</button>
            <button onClick={onCancelEdit} className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">Cancel</button>
            <span className="text-[11px] text-gray-300 ml-auto hidden sm:block">Enter to save · Esc to cancel</span>
          </div>
        </div>
      </li>
    )
  }

  return (
    <li className={`group relative flex items-start gap-2 rounded-lg px-2 py-1.5 -mx-2 transition-colors duration-100 ${isHighlighted ? 'bg-amber-50 border border-amber-200' : 'hover:bg-black/[0.025]'}`}>
      {prefix}
      <span className={`text-sm text-gray-700 leading-relaxed flex-1 min-w-0 ${isReloading ? 'opacity-30' : ''}`}>
        {isReloading ? (
          <span className="inline-flex items-center gap-1.5 text-gray-400 italic text-xs"><Spinner /> Generating…</span>
        ) : children}
      </span>
      <div className="flex-shrink-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-100 mt-0.5">
        <ActionBtn title={isHighlighted ? 'Remove highlight' : 'Highlight'} onClick={onHighlight} active={isHighlighted}><HighlightIcon active={isHighlighted} /></ActionBtn>
        <ActionBtn title="Edit" onClick={onEdit}><EditIcon /></ActionBtn>
        <ActionBtn title="Swap suggestion" onClick={onReload} disabled={isReloading}><ReloadIcon spinning={isReloading} /></ActionBtn>
        <ActionBtn title="Remove" onClick={onRemove} danger><RemoveIcon /></ActionBtn>
      </div>
    </li>
  )
}

// --- Add item UI ---

function AddItemInput({ draft, onDraftChange, onSave, onCancel, prefix }: {
  draft: string; onDraftChange: (v: string) => void; onSave: () => void; onCancel: () => void; prefix: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-2 mt-2 rounded-xl border border-dashed border-sage-300 bg-white px-3 py-2.5">
      <span className="mt-1 opacity-40">{prefix}</span>
      <div className="flex-1 flex flex-col gap-2">
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSave() }
            if (e.key === 'Escape') onCancel()
          }}
          placeholder="Type a new item…"
          rows={2}
          className="w-full text-sm text-gray-800 placeholder-gray-400 bg-transparent border-none focus:outline-none resize-none leading-relaxed"
        />
        <div className="flex items-center gap-2.5">
          <button onClick={onSave} disabled={!draft.trim()} className="text-xs font-semibold text-white bg-sage-600 hover:bg-sage-700 disabled:bg-gray-200 disabled:text-gray-400 px-3 py-1 rounded-lg transition-colors">Add</button>
          <button onClick={onCancel} className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">Cancel</button>
          <span className="text-[11px] text-gray-300 ml-auto hidden sm:block">Enter to add · Esc to cancel</span>
        </div>
      </div>
    </div>
  )
}

function AddItemRow({ onAdd, onGenerate }: { onAdd: () => void; onGenerate: () => void }) {
  return (
    <div className="mt-1.5 flex items-center gap-1">
      <button
        onClick={onAdd}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-sage-600 hover:bg-sage-50 px-2 py-1.5 rounded-lg transition-colors"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        Add manually
      </button>
      <span className="text-gray-200">|</span>
      <button
        onClick={onGenerate}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-sage-600 hover:bg-sage-50 px-2 py-1.5 rounded-lg transition-colors"
      >
        <SparkleIcon />
        Generate
      </button>
    </div>
  )
}

// --- ActionBtn ---

function ActionBtn({ title, onClick, active, danger, disabled, children }: {
  title: string; onClick: () => void; active?: boolean; danger?: boolean; disabled?: boolean; children: React.ReactNode
}) {
  return (
    <button
      title={title} onClick={onClick} disabled={disabled}
      className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors duration-100 disabled:pointer-events-none ${
        active ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
        : danger ? 'text-gray-400 hover:bg-red-50 hover:text-red-500'
        : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
      }`}
    >
      {children}
    </button>
  )
}

// --- Item prefixes ---

function MovePrefix() {
  return (
    <span className="flex-shrink-0 mt-[3px] w-4 h-4 text-sage-500">
      <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

function NumberPrefix({ n }: { n: number }) {
  return (
    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[11px] font-bold flex items-center justify-center mt-0.5">{n}</span>
  )
}

function WarningPrefix() {
  return (
    <span className="flex-shrink-0 mt-0.5 text-amber-500">
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M8 2L14 13H2L8 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M8 7v2M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </span>
  )
}

// --- Card ---

function Card({ icon, title, action, children }: { icon: React.ReactNode; title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="group/card rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sage-600">{icon}</span>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex-1">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  )
}

// --- Loading Skeleton ---

const SKELETON_STAGES = [
  { label: 'Analyzing your idea…', cardIdx: -1 },
  { label: 'Framing the core problem…', cardIdx: 0 },
  { label: 'Planning your first moves…', cardIdx: 1 },
  { label: 'Mapping next steps…', cardIdx: 2 },
  { label: 'Identifying risks…', cardIdx: 3 },
  { label: 'Estimating time saved…', cardIdx: 4 },
]

const SKELETON_CARDS = [
  { title: 'Core Problem', lines: [90, 65] },
  { title: 'First Move', lines: [80, 70, 85] },
  { title: 'Next Steps', lines: [75, 60, 80] },
  { title: 'Risks & Tradeoffs', lines: [65, 80, 70] },
  { title: 'Time Saved', lines: [40] },
]

function LoadingSkeleton() {
  const [stageIdx, setStageIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setStageIdx((prev) => Math.min(prev + 1, SKELETON_STAGES.length - 1))
    }, 1400)
    return () => clearInterval(id)
  }, [])

  const activeCard = SKELETON_STAGES[stageIdx].cardIdx

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5 px-1 mb-1">
        <span className="flex gap-[3px] items-center">
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-sage-500 inline-block animate-bounce" style={{ animationDelay: `${i * 160}ms`, animationDuration: '900ms' }} />
          ))}
        </span>
        <span key={stageIdx} className="text-xs font-medium text-sage-700 fade-in-up">
          {SKELETON_STAGES[stageIdx].label}
        </span>
      </div>

      {SKELETON_CARDS.map((card, i) => {
        const isActive = i === activeCard
        const isDone = activeCard > i
        return (
          <div
            key={i}
            className={`rounded-xl border p-5 transition-all duration-500 ${
              isActive ? 'border-sage-300 bg-sage-50/60 shadow-sm' : isDone ? 'border-sage-100 bg-white opacity-60' : 'border-gray-100 bg-white opacity-40'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-4 h-4 rounded shimmer-line ${isActive ? 'opacity-60' : 'opacity-30'}`} />
              <div className={`h-2.5 rounded shimmer-line ${isActive ? 'opacity-60' : 'opacity-30'}`} style={{ width: `${card.title.length * 7 + 10}px` }} />
              {isActive && <span className="ml-auto text-[10px] font-semibold text-sage-500 uppercase tracking-wider animate-pulse">Writing…</span>}
            </div>
            <div className="flex flex-col gap-2">
              {card.lines.map((w, j) => (
                <div key={j} className="h-3 shimmer-line" style={{ width: `${w}%`, animationDelay: `${j * 120}ms`, opacity: isActive ? 0.7 : isDone ? 0.4 : 0.25 }} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// --- Icons ---

const ic = 'w-3.5 h-3.5'

function ShareIcon() {
  return (
    <svg className={ic} viewBox="0 0 16 16" fill="none">
      <circle cx="12" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="13" r="1.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="4" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5.5 7.2l5-2.9M5.5 8.8l5 2.9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg className={`w-3 h-3 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} viewBox="0 0 16 16" fill="none">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MarkdownIcon() {
  return (
    <svg className={ic} viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4 10V6l2 2 2-2v4M11 10V6M9.5 8.5l1.5 1.5 1.5-1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TextFileIcon() {
  return (
    <svg className={ic} viewBox="0 0 16 16" fill="none">
      <path d="M9 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V6L9 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M9 2v4h4M5 9h6M5 11.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg className={ic} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="4" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 5l6 4.5L14 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg className={ic} viewBox="0 0 16 16" fill="none">
      <path d="M8 3v7M5 7.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg className={ic} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HighlightIcon({ active }: { active?: boolean }) {
  return (
    <svg className={ic} viewBox="0 0 16 16" fill={active ? 'currentColor' : 'none'}>
      <path d="M10 2l4 4-6 6H4v-4l6-6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg className={ic} viewBox="0 0 16 16" fill="none">
      <path d="M11 2.5l2.5 2.5-8 8H3v-2.5l8-8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function ReloadIcon({ spinning }: { spinning?: boolean }) {
  return (
    <svg className={`${ic} ${spinning ? 'animate-spin' : ''}`} viewBox="0 0 16 16" fill="none">
      <path d="M13.5 8A5.5 5.5 0 112.5 5M2.5 2v3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function RemoveIcon() {
  return (
    <svg className={ic} viewBox="0 0 16 16" fill="none">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg className={ic} viewBox="0 0 16 16" fill="none">
      <path d="M8 2v2M8 12v2M2 8h2M12 8h2M4.2 4.2l1.4 1.4M10.4 10.4l1.4 1.4M4.2 11.8l1.4-1.4M10.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

const iconClass = 'w-4 h-4'

function ProblemIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function MoveIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StepsIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 16 16" fill="none">
      <path d="M3 4h10M3 8h7M3 12h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function RiskIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 16 16" fill="none">
      <path d="M8 2L14 13H2L8 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M8 7v2.5M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 5v3l2.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
