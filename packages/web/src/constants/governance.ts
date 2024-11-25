export const GOVERNANCE_TYPES = ['Upcoming', 'Active', 'Ended', 'Invalid'] as const
export type GovernanceType = typeof GOVERNANCE_TYPES[number]

export const VOTING_OPTIONS = [
  {
    label: 'Single choice voting',
    subLabel: 'Each voter can select only one choice.',
    key: 'single',
    value: 1
  },
  {
    label: 'Basic voting',
    subLabel: 'Single choice voting with three choices: Yes, No or Abstain',
    key: 'basic',
    value: 2
  }
]
