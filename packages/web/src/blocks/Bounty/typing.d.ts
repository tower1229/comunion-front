export interface ContactType {
  type: number
  value: string
  blur?: boolean
}
export interface BountyInfo {
  current: number
  startup_id: number | undefined
  title: string
  expiresIn: number | undefined
  contact: ContactType[]
  discussionLink: string
  applicantsSkills: never[]
  applicantsDeposit: number
  description: string
  payDetailType: string
  token1_symbol: string
  token2_symbol: string
  payTokenSymbol: string
  stages: { token1_amount: number; token2_amount: number; terms: string }[]
  period: {
    periodType: number
    periodAmount: number
    hoursPerDay: number
    target: string
    token1_amount: number
    token2_amount: number
  }
  deposit: number
  agreement: boolean
  on_chain: boolean
}
export type chainInfoType = {
  chain_id: number | undefined
  on_chain: boolean
}
export interface CreateBountyFormRef {
  bountyInfo: BountyInfo
  toPreviousStep?: () => void
  toNext?: () => void
  onSubmit?: () => void
  onCancel?: () => void
  showLeaveTipModal?: () => void
}
