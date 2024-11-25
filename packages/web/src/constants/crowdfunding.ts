export const CROWDFUNDING_TYPES = [
  'Pending',
  'Upcoming',
  'Live',
  'Ended',
  'Cancelled',
  'Failure'
] as const
export type CrowdfundingType = typeof CROWDFUNDING_TYPES[number]
