import { TagRelationResponse } from './startup'
import { ComerBasicResponse } from './user'

export type BountyListItem = {
  applicant_count: number
  applicant_deposit: number
  applicant_min_deposit: number
  apply_deadline: string
  chain_id?: number
  comer_id: number
  contract_address: string
  deposit_contract_address: string
  deposit_contract_token_symbol: string
  discussion_link: string
  founder_deposit: number
  id: number
  payment_mode: number
  skills?: {
    id: number
    tag?: {
      id: number
      name: string
      type: number
    }
    tag_id: number
    target_id: number
    type: number
  }[]
  reward?: {
    bounty_id: number
    token1_amount: number
    token1_symbol: string
    token2_amount: number
    token2_symbol: string
  }
  startup?: {
    chain_id: number
    comer_id: number
    contract_audit: string
    id: number
    is_connected: boolean
    kyc: string
    logo: string
    mission: string
    name: string
    on_chain: boolean
    tx_hash: string
    type: number
  }
  created_at: string
  startup_id: number
  /**
   * @description query bounty status
   */
  status: number
  title: string
  tx_hash: string
}

export type BountyApplicant = {
  apply_at: string
  approve_at: string
  bounty_id: number
  comer?: BountyComer
  comer_id: number
  created_at?: string
  description: string
  id: number
  refunded_at: string
  status: number
}

export type BountyComer = {
  address: string
  avatar: string
  banner: string
  id: number
  is_connected: boolean
  location: string
  name: string
  skills?: TagRelationResponse[]
  time_zone: string
}

export type BountyContract = {
  bounty_id: number
  id: number
  type: number
  value: string
}

export type BountyDepositRecord = {
  amount: number
  bounty_id: number
  comer?: ComerBasicResponse
  comer_id: number
  created_at?: string
  id: number
  mode: number
  status: number
  tx_hash: string
}

export type PostUpdate = {
  comer?: ComerBasicResponse
  comer_id: number
  content: string
  created_at?: string
  id: number
  target_id: number
  type: number
}

export type SocialBookResponse = {
  id: number
  social_tool?: {
    id: number
    logo: string
    name: string
  }
  social_tool_id: number
  target_id: number
  type: number
  value: string
}

export type StartupCardResponse = {
  banner: string
  chain_id: number
  comer_id: number
  contract_audit: string
  id: number
  is_connected: boolean
  kyc: string
  logo: string
  mission: string
  name: string
  on_chain: boolean
  socials?: SocialBookResponse[]
  tags?: TagRelationResponse[]
  tx_hash: string
  type: number
}

export type BountyPaymentTerms = {
  bounty_id: number
  id: number
  sort_index: number
  status: number
  terms: string
  token1_amount: number
  token1_symbol: string
  token2_amount: number
  token2_symbol: string
}

export type BountyPaymentPeriod = {
  bounty_id: number
  hours_per_day: number
  id: number
  period: number
  period_type: number
  terms: string
  token1_amount: number
  token1_symbol: string
  token2_amount: number
  token2_symbol: string
}

export type BountyInfo = {
  applicant_deposit: number
  applicant_min_deposit: number
  applicants?: BountyApplicant[]
  apply_deadline: string
  approved?: BountyApplicant
  chain_id?: number
  comer_id: number
  contract_address: string
  contacts?: BountyContract[]
  created_at?: string
  deposit_contract_address: string
  deposit_contract_token_decimal: number
  deposit_contract_token_symbol: string
  deposit_records?: BountyDepositRecord[]
  description: string
  discussion_link: string
  expired_time: string
  founder?: BountyComer
  founder_deposit: number
  id: number
  is_lock: number
  my_deposit: number
  my_role: number
  my_status: number
  payment_mode: number
  period?: BountyPaymentPeriod
  post_updates?: PostUpdate[]
  skills?: TagRelationResponse[]
  startup?: StartupCardResponse
  startup_id: number
  /**
   * @description query bounty status
   */
  status: number
  terms?: BountyPaymentTerms[]
  title: string
  tx_hash: string
}
