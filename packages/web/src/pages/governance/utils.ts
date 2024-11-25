export const GOVERNANCE_KEY = {
  1: 'Upcoming',
  2: 'Active',
  3: 'Ended',
  4: 'Invalid'
}

export const GOVERNANCE_UPCOMING = 1
export const GOVERNANCE_ACTIVE = 2
export const GOVERNANCE_ENDED = 3
export const GOVERNANCE_INVALID = 4

export const GOVERNANCE_STATUS_STYLE = {
  1: 'px-3 rounded py-1 text-white px-2 text-xs bg-primary',
  2: 'px-3 rounded py-1 text-white px-2 text-xs bg-[#00BFA5]',
  3: 'px-3 rounded py-1 text-white px-2 text-xs bg-warning',
  4: 'px-3 rounded py-1 text-white px-2 text-xs bg-grey5'
}

export const signerVoteTypes = {
  voteInfo: [
    { name: 'From', type: 'string' },
    { name: 'Startup', type: 'string' },
    { name: 'timestamp', type: 'uint256' },
    { name: 'proposal', type: 'string' },
    { name: 'choice', type: 'string' }
  ]
}

export const signerProposalTypes = {
  proposalInfo: [
    { name: 'From', type: 'string' },
    { name: 'Startup', type: 'string' },
    { name: 'Timestamp', type: 'uint256' },
    { name: 'Type', type: 'string' },
    { name: 'Title', type: 'string' },
    { name: 'Choice', type: 'string[]' },
    { name: 'Start', type: 'uint256' },
    { name: 'End', type: 'uint256' },
    { name: 'BlockHeight', type: 'uint256' },
    { name: 'Description', type: 'string' },
    { name: 'Discussion', type: 'string' }
  ]
}
