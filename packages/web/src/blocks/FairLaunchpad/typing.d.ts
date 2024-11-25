export interface CrowdfundingInfo {
  title: string
  current: number
  startupId: number | undefined
  startupName?: string
  sellTokenContract?: string
  sellTokenName: string
  sellTokenSymbol: string
  sellTokenDecimals: string
  sellTokenSupply: string
  teamWallet: string
  listing: string
  Router: string | null
  chainId?: number
  listingRate?: number
  raiseGoal: number | null
  buyTokenContract: string
  buyTokenName?: string
  buyTokenSymbol?: string
  buyTokenDecimals?: string
  swapPercent?: number
  totalSellToken?: number
  buyPrice?: number
  maxBuyAmount?: number
  minBuyAmount?: number
  sellTax?: number
  maxSell?: number
  startTime?: string
  endTime?: string
  sellTokenDeposit: number
  poster?: FileInfo
  youtube: string
  detail: string
  description?: string
}
export type chainInfoType = {
  chainID: number | undefined
  onChain: boolean
}
export interface CrowdfundingFormRef {
  crowdfundingInfo: CrowdfundingInfo
  toPreviousStep?: () => void
  toNext?: () => void
  onSubmit?: () => void
  onCancel?: () => void
  showLeaveTipModal?: () => void
}
