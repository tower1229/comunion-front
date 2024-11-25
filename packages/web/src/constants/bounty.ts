/**
 * Bounty types
 */

export const BOUNTY_TYPES = ['Ready to work', 'Started working', 'Completed'] as const

export const BOUNTY_TYPES_COLOR_MAP = [
  {
    label: 'Pending',
    value: '#5331F4'
  },
  {
    label: 'Ready to work',
    value: '#5331F4'
  },
  {
    label: 'Started working',
    value: '#00BFA5'
  },
  {
    label: 'Completed',
    value: '#F29F39'
  },
  {
    label: 'Expired',
    value: '#DF4F51'
  }
] as const

export enum BOUNTY_STATUS {
  PENDING,
  READYTOWORK,
  WORKSTARTED,
  COMPLETED,
  EXPIRED
}

export enum APPLICANT_STATUS {
  PENDING,
  APPLIED,
  REFUNDED,
  WITHDRAW,
  REFUESED,
  APPROVED,
  UNAPPROVED
}

export enum USER_ROLE {
  PENDING,
  FOUNDER,
  APPLICANT,
  OTHERS
}

export const PERIOD_OPTIONS = [
  { label: 'Days', value: 1, type: 'Day' },
  { label: 'Weeks', value: 2, type: 'Week' },
  { label: 'Months', value: 3, type: 'Month' }
]

// Get the currency types supported by bounty
export const BASE_CURRENCY: string[] = ['USDC', 'USD']
