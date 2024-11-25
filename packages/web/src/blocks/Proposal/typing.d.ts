export interface ProposalInfo {
  current: number
  startup_id?: number
  title?: string
  description?: string
  discussion?: string
  vote: string
  start_time?: number
  end_time?: number
  vote_choices?: { value: string; disabled?: boolean }[]
}

export interface CreateProposalFormRef {
  proposalInfo: ProposalInfo
  submitLoading: boolean
  toPreviousStep?: () => void
  toNext?: () => void
  onSubmit?: () => void
  onCancel?: () => void
  showLeaveTipModal?: () => void
}

export interface VoteOption {
  label: string
  value: string
  remark?: string
  key?: number
}
