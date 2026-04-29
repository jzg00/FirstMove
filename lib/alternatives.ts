import { IdeaType } from './types'

type SectionKey = 'firstMove' | 'v1Scope' | 'nextSteps' | 'risks'

export const RELOAD_POOL: Record<IdeaType, Record<SectionKey, string[]>> = {
  product: {
    firstMove: [
      'Launch a Notion brief template and validate the format with 3 teams before building anything.',
      'Define the 5 fields that make any product brief actionable — build the form around those constraints only.',
      'Run a 48-hour design sprint focused solely on the brief format: prototype, test, decide.',
      'Assign one PM as the brief owner and run a weekly async review cycle for the first month.',
    ],
    v1Scope: [
      'Shareable brief link with view-only access for stakeholders',
      'Auto-suggested tags based on idea content for easier search',
      'Version history: see what changed between brief drafts',
      'Slack integration: post brief summary to a channel on generation',
    ],
    nextSteps: [
      'Write a one-page PRD from this brief and share with the engineering lead this week',
      'Define the 3 success metrics that will determine if v1 is worth expanding',
      'Identify the single riskiest assumption and design a test to validate it in 5 days',
      'Schedule a stakeholder demo for the end of next sprint',
    ],
    risks: [
      'Team adoption curve may slow velocity in the first 2 weeks — plan an internal demo and FAQ',
      'Scope creep: define explicitly what is out of scope and enforce it in sprint planning',
      'Data privacy: ensure brief content is not persisted or logged without user consent',
      'Over-reliance on AI output quality before prompt engineering is tuned',
    ],
  },
  operations: {
    firstMove: [
      "Shadow the current process for one full cycle before proposing any changes — observe, don't assume.",
      "Interview 3 people at different steps in the process to surface pain points that don't show up in reports.",
      'Run a 5-day pilot with one team before rolling out changes organization-wide.',
      'Create a simple RACI for the improved process and get sign-off from leads before socializing.',
    ],
    v1Scope: [
      'RACI matrix for each step in the revised process',
      'Weekly check-in template to track adoption in the first 60 days',
      'Before/after comparison: cycle time, error rate, handoff count',
      'Exception-handling playbook for edge cases outside the standard flow',
    ],
    nextSteps: [
      'Schedule a kickoff with key stakeholders within 5 business days',
      'Document the current process in a one-pager as a baseline before any changes land',
      'Identify quick wins that can ship in the next 2-week sprint to build momentum',
      'Define rollback criteria: under what conditions do we revert to the old process?',
    ],
    risks: [
      'Over-rotation on tooling instead of behavior change — focus on habits and training first',
      'Change fatigue: sequence this improvement after existing initiatives settle',
      'Leadership alignment gap: get explicit sign-off before socializing the plan broadly',
      'Measurement gap: agree on metrics before the change so you can prove impact after',
    ],
  },
  workflow: {
    firstMove: [
      "Shadow the workflow for one full cycle before proposing changes — observe, don't assume.",
      'Interview 3 people at different steps to surface pain points not visible in process docs.',
      'Time-box the redesign to 2 weeks max — a good-enough new workflow ships faster than a perfect one.',
      'Start with the highest-frequency workflow path; ignore edge cases until v2.',
    ],
    v1Scope: [
      'SLA targets per workflow step with assigned owner',
      'Integration checklist with upstream and downstream tools',
      'Training guide for teams transitioning from old to new workflow',
      'Audit log: track when each step was completed and by whom',
    ],
    nextSteps: [
      'Pilot the redesigned workflow with one team for 2 weeks and measure cycle time delta',
      'Create a transition plan: how do in-flight items move to the new flow?',
      'Define escalation paths for steps that stall or exceed SLA',
      'Schedule a 30-day retrospective to assess adoption and surface friction',
    ],
    risks: [
      'Hidden dependencies on adjacent workflows not captured in this analysis — audit broadly first',
      'Training gap: staff need time to internalize new steps — plan for a 2-week ramp period',
      'Tooling constraints may limit the ideal design — validate technical feasibility before committing',
      'Resistance from teams who own steps being consolidated or removed — involve them early',
    ],
  },
}
