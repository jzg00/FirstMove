export type IdeaType = 'product' | 'operations' | 'workflow'

export interface BriefOutput {
  coreProblem: string
  firstMove: string[]
  nextSteps: string[]
  risks: string[]
  timeSaved: string
}

export type DatasetId = 'logistics' | 'suppliers' | 'menu'

export type SignalDataset = {
  id: DatasetId
  name: string
  description: string
  rows: Record<string, unknown>[]
}

export type Signal = {
  id: string
  title: string
  reasoning: string
  impact: 'high' | 'medium' | 'low'
  suggestedContext: string
}
