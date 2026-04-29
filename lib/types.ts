export type IdeaType = 'product' | 'operations' | 'workflow'

export interface BriefOutput {
  coreProblem: string
  firstMove: string[]
  nextSteps: string[]
  risks: string[]
  timeSaved: string
}
